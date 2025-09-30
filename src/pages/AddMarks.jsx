import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

export default function AddMarks() {
  const subjects = ["Maths", "Physics", "Chemistry"];
  const [subject, setSubject] = useState(subjects[0]);
  const [mcq, setMcq] = useState("");
  const [essay, setEssay] = useState("");
  const [message, setMessage] = useState("");
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  // Fetch marks for selected subject
  const fetchMarks = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setMarks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("marks")
      .select("*")
      .eq("user_id", user.id)
      .eq("subject", subject)
      .order("id", { ascending: false });

    if (error) console.error(error);
    else setMarks(data);

    setLoading(false);
  };

  useEffect(() => {
    fetchMarks();
  }, [subject]);

  // Add or update mark
  const saveMark = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    if (editingId) {
      // Update existing mark
      const { error } = await supabase
        .from("marks")
        .update({
          mcq: mcq ? parseInt(mcq) : 0,
          essay: essay ? parseInt(essay) : 0,
          message,
        })
        .eq("id", editingId);

      if (error) console.error(error);
      setEditingId(null);
    } else {
      // Insert new mark
      const { error } = await supabase.from("marks").insert([
        {
          subject,
          mcq: mcq ? parseInt(mcq) : 0,
          essay: essay ? parseInt(essay) : 0,
          message,
          user_id: user.id,
        },
      ]);
      if (error) console.error(error);
    }

    // Reset inputs
    setMcq("");
    setEssay("");
    setMessage("");
    fetchMarks();
  };

  // Edit mark
  const editMark = (mark) => {
    setEditingId(mark.id);
    setMcq(mark.mcq);
    setEssay(mark.essay);
    setMessage(mark.message || "");
  };

  // Delete mark
  const deleteMark = async (id) => {
    const { error } = await supabase.from("marks").delete().eq("id", id);
    if (error) console.error(error);
    else fetchMarks();
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Add Marks</h1>

      {/* Subject Selection */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Subject:</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-700"
        >
          {subjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
        <input
          type="number"
          placeholder="MCQ Marks"
          value={mcq}
          onChange={(e) => setMcq(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="number"
          placeholder="Essay Marks"
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          className="p-2 rounded text-black"
        />
        <input
          type="text"
          placeholder="Optional Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 rounded text-black"
        />
        <button
          onClick={saveMark}
          className={`${
            editingId
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-500 hover:bg-blue-600"
          } p-2 rounded font-semibold`}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Marks Table */}
      {loading ? (
        <p>Loading marks...</p>
      ) : marks.length === 0 ? (
        <p>No marks added yet for {subject}.</p>
      ) : (
        <table className="w-full text-white border-collapse border border-gray-700">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">MCQ</th>
              <th className="p-2">Essay</th>
              <th className="p-2">Message</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((m) => (
              <tr key={m.id} className="border-b border-gray-700">
                <td className="p-2">{m.mcq}</td>
                <td className="p-2">{m.essay}</td>
                <td className="p-2">{m.message}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => editMark(m)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMark(m.id)}
                    className="text-red-500 hover:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
