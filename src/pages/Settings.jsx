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

  // Fetch profile (from names) + subjects
  const fetchProfileAndSubjects = async (currentUser) => {
    if (!currentUser) return;

    // ✅ Fetch from names table
    const { data: profile, error: profileError } = await supabase
      .from("names")
      .select("name, birthday")
      .eq("id", currentUser.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
    }

    if (profile) {
      setName(profile.name || "");
      setBirthday(profile.birthday || "");
    }

    // ✅ Subjects stay the same
    const { data: subs } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("id", { ascending: true });
    setSubjects(subs || []);
  };

  useEffect(() => {
    let mounted = true;

    // Initial user fetch
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;
      if (!mounted) return;
      setUser(currentUser);
      if (currentUser) await fetchProfileAndSubjects(currentUser);
    };
    init();

    // Auth listener
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

    // ✅ Save into names table instead of profiles
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-6">Settings</h1>

      {/* Inline message like before */}
      {message && (
        <div
          className={`mb-4 flex items-center gap-2 text-sm ${
            isError ? "text-red-500" : "text-green-400"
          }`}
        >
          {isError ? (
            <XCircleIcon className="w-5 h-5" />
          ) : (
            <CheckCircleIcon className="w-5 h-5" />
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
            className="w-full p-2 rounded bg-white/5 mb-3 text-white"
          />

          <label className="text-sm text-gray-300">Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full p-2 rounded bg-white/5 mb-3 text-white"
          />

          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-cyan-500 text-black rounded cursor-pointer"
          >
            Save
          </button>
        </Card>

        {/* Subjects */}
        <Card>
          <h2 className="text-lg font-semibold text-white mb-3">Subjects</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="New subject"
              className="flex-1 p-2 rounded bg-white/5 text-white"
            />
            <button
              onClick={addSubject}
              className="px-3 py-2 bg-cyan-500 text-black rounded"
            >
              Add
            </button>
          </div>

          <ul className="space-y-2">
            {subjects.length > 0 ? (
              subjects.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded"
                >
                  <span>{s.name}</span>
                  <button
                    onClick={() => removeSubject(s.id)}
                    className="text-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))
            ) : (
              <li className="text-gray-400">No subjects yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
