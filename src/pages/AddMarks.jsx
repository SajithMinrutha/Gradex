// src/pages/AddMarks.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";

export default function AddMarks() {
  const [subjects, setSubjects] = useState(["Maths", "Physics", "Chemistry"]);
  const [subject, setSubject] = useState("Maths");
  const [mcq, setMcq] = useState("");
  const [essay, setEssay] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // try to load user subjects (optional)
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;
      const { data } = await supabase
        .from("user_subjects")
        .select("subject")
        .eq("user_id", user.id);
      if (mounted && data && data.length) {
        setSubjects(data.map((r) => r.subject));
        setSubject(data[0].subject);
      }
    })();
    return () => (mounted = false);
  }, []);

  const handleAdd = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert("Not signed in");
      return;
    }

    await supabase.from("marks").insert([
      {
        user_id: user.id,
        subject,
        mcq: parseInt(mcq || "0", 10),
        essay: parseInt(essay || "0", 10),
        message: message || null,
      },
    ]);

    setMcq("");
    setEssay("");
    setMessage("");
    navigate("/");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Add Marks</h1>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">MCQ</label>
            <input
              type="number"
              value={mcq}
              onChange={(e) => setMcq(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Essay</label>
            <input
              type="number"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Optional message</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-cyan-500 text-black rounded-md"
          >
            Save Mark
          </button>
        </div>
      </Card>
    </div>
  );
}
