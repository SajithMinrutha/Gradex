import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [theme, setTheme] = useState("dark");
  const [message, setMessage] = useState("");

  // fetch profile + subjects
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      if (!currentUser) return;

      setUser(currentUser);

      // fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, birthday, theme")
        .eq("id", currentUser.id)
        .single();

      if (profile) {
        setName(profile.name || "");
        setBirthday(profile.birthday || "");
        setTheme(profile.theme || "dark");
      }

      // fetch subjects
      const { data: subs } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", currentUser.id);

      setSubjects(subs || []);
    };

    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        name,
        birthday,
        theme,
      },
      { onConflict: "id" }
    );
    if (error) {
      setMessage("❌ Failed to save profile");
    } else {
      setMessage("✅ Profile updated successfully");
    }
  };

  const addSubject = async () => {
    if (!newSubject.trim() || !user) return;
    const { error } = await supabase.from("subjects").insert([
      {
        user_id: user.id,
        name: newSubject.trim(),
      },
    ]);
    if (!error) {
      setSubjects([...subjects, { name: newSubject.trim() }]);
      setNewSubject("");
    }
  };

  const removeSubject = async (subName) => {
    if (!user) return;
    await supabase
      .from("subjects")
      .delete()
      .eq("user_id", user.id)
      .eq("name", subName);
    setSubjects(subjects.filter((s) => s.name !== subName));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-6">Settings</h1>

      {message && <div className="mb-4 text-green-400">{message}</div>}

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

          <label className="text-sm text-gray-300">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 rounded bg-white/5 mb-3"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="neon">Neon</option>
          </select>

          <button
            onClick={saveProfile}
            className="px-4 py-2 bg-cyan-500 text-black rounded"
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
            {subjects.map((s) => (
              <li
                key={s.name}
                className="flex items-center justify-between p-2 bg-white/5 rounded"
              >
                <span>{s.name}</span>
                <button
                  onClick={() => removeSubject(s.name)}
                  className="text-red-400"
                >
                  Remove
                </button>
              </li>
            ))}
            {subjects.length === 0 && (
              <li className="text-gray-400">No subjects yet.</li>
            )}
          </ul>
        </Card>
      </div>
    </div>
  );
}
