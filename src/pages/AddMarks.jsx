// src/pages/AddMarks.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

export default function AddMarks() {
  const [subjects, setSubjects] = useState(["Maths", "Physics", "Chemistry"]);
  const [subject, setSubject] = useState("Maths");
  const [mcq, setMcq] = useState("");
  const [essay, setEssay] = useState("");
  const [message, setMessage] = useState("");
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);

  const fetchMarks = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setMarks([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("marks")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    setMarks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const validRange = (n) => {
    if (n === "" || n === null) return false;
    const v = Number(n);
    return Number.isFinite(v) && v >= 0 && v <= 50;
  };

  const clearForm = () => {
    setMcq("");
    setEssay("");
    setMessage("");
    setSubject(subjects[0]);
    setEditId(null);
  };

  const handleAdd = async () => {
    if (!validRange(mcq) || !validRange(essay)) {
      alert("MCQ and Essay must be numbers between 0 and 50.");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      alert("Sign in required.");
      return;
    }

    await supabase.from("marks").insert([
      {
        user_id: user.id,
        subject,
        mcq: Number(mcq),
        essay: Number(essay),
        message: message || null,
      },
    ]);
    clearForm();
    fetchMarks();
  };

  const startEdit = (m) => {
    setEditId(m.id);
    setSubject(m.subject);
    setMcq(String(m.mcq));
    setEssay(String(m.essay));
    setMessage(m.message || "");
  };

  const saveEdit = async () => {
    if (!validRange(mcq) || !validRange(essay)) {
      alert("MCQ and Essay must be numbers between 0 and 50.");
      return;
    }
    await supabase
      .from("marks")
      .update({
        subject,
        mcq: Number(mcq),
        essay: Number(essay),
        message: message || null,
      })
      .eq("id", editId);
    clearForm();
    fetchMarks();
  };

  const deleteMark = async (id) => {
    if (!confirm("Delete this mark?")) return;
    await supabase.from("marks").delete().eq("id", id);
    fetchMarks();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">
        Add / Edit Marks
      </h1>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
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
              min="0"
              max="50"
              value={mcq}
              onChange={(e) => setMcq(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Essay</label>
            <input
              type="number"
              min="0"
              max="50"
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Message (optional)</label>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 rounded bg-white/5 text-white"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {editId ? (
            <>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-amber-400 text-black rounded"
              >
                Save
              </button>
              <button
                onClick={clearForm}
                className="px-4 py-2 bg-white/5 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-cyan-500 text-black rounded"
            >
              Add Mark
            </button>
          )}
        </div>
      </Card>

      <div className="mt-6">
        <Card title="Your Marks">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-sm text-gray-400">
                    <th className="p-2">Subject</th>
                    <th className="p-2">MCQ</th>
                    <th className="p-2">Essay</th>
                    <th className="p-2">Total</th>
                    <th className="p-2">Message</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {marks.map((m) => (
                    <tr key={m.id} className="border-t border-white/5">
                      <td className="p-2">{m.subject}</td>
                      <td className="p-2">{m.mcq}</td>
                      <td className="p-2">{m.essay}</td>
                      <td className="p-2">{(m.mcq || 0) + (m.essay || 0)}</td>
                      <td className="p-2">{m.message || "-"}</td>
                      <td className="p-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(m)}
                            className="px-2 py-1 bg-white/5 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteMark(m.id)}
                            className="px-2 py-1 bg-red-500/10 text-red-400 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {marks.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-4 text-gray-400">
                        No marks yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
