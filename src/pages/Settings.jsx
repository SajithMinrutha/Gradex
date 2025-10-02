import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Fetch profile + subjects
  const fetchProfileAndSubjects = async (currentUser) => {
    if (!currentUser) return;

    const { data: profile } = await supabase
      .from("names")
      .select("name, birthday")
      .eq("id", currentUser.id)
      .single();

    if (profile) {
      setName(profile.name || "");
      setBirthday(profile.birthday || "");
    }

    const { data: subs } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("id", { ascending: true });

    setSubjects(subs || []);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      if (!mounted) return;
      setUser(currentUser);
      if (currentUser) await fetchProfileAndSubjects(currentUser);
    };
    init();

    const { data: authSub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) fetchProfileAndSubjects(currentUser);
        else {
          setName("");
          setBirthday("");
          setSubjects([]);
        }
      }
    );

    return () => {
      mounted = false;
      authSub?.subscription?.unsubscribe();
    };
  }, []);

  const saveProfile = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("names")
      .upsert({ id: user.id, name, birthday }, { onConflict: "id" });

    if (error) {
      setMessage("Failed to save profile");
      setIsError(true);
    } else {
      setMessage("Profile updated successfully");
      setIsError(false);
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim() || !user) return;
    const { data, error } = await supabase
      .from("subjects")
      .insert([{ user_id: user.id, name: newSubject.trim() }])
      .select();

    if (!error && data && data.length > 0) {
      setSubjects((prev) => [...prev, data[0]]);
      setNewSubject("");
    }
  };

  const removeSubject = async (id) => {
    if (!user) return;
    const { error } = await supabase.from("subjects").delete().eq("id", id);
    if (!error) {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-6">
        Settings
      </h1>

      {/* Inline message */}
      {message && (
        <div
          className={`mb-4 flex items-center gap-2 text-sm sm:text-base ${
            isError ? "text-red-500" : "text-green-400"
          }`}
        >
          {isError ? (
            <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-3">Profile</h2>
          <label className="text-sm text-gray-300">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-white/5 mb-3 text-white text-sm sm:text-base"
          />

          <label className="text-sm text-gray-300">Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2 rounded bg-white/5 mb-3 text-white text-sm sm:text-base"
          />

          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-cyan-500 text-black rounded cursor-pointer text-sm sm:text-base"
          >
            Save
          </button>
        </Card>

        {/* Subjects */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-3">Subjects</h2>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="New subject"
              className="flex-1 p-2 rounded bg-white/5 text-white text-sm sm:text-base"
            />
            <button
              onClick={addSubject}
              className="px-3 py-2 bg-cyan-500 text-black rounded text-sm sm:text-base"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {subjects.length > 0 ? (
              subjects.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-white/5 rounded gap-2"
                >
                  <span className="text-sm sm:text-base">{s.name}</span>
                  <button
                    onClick={() => removeSubject(s.id)}
                    className="text-red-400 text-sm sm:text-base"
                  >
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-400 text-sm sm:text-base">
                No subjects yet.
              </li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
