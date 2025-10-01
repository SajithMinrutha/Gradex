// src/pages/ToDo.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    setTasks(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    await supabase
      .from("todos")
      .insert([{ title: newTask.trim(), user_id: user.id, completed: false }]);
    setNewTask("");
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await supabase.from("todos").update({ completed: !completed }).eq("id", id);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await supabase.from("todos").delete().eq("id", id);
    fetchTasks();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">ToDo</h1>
      <Card>
        <div className="flex gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 rounded-md bg-white/5 text-white"
            placeholder="New task..."
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-cyan-500 text-black rounded-md"
          >
            Add
          </button>
        </div>

        {loading ? (
          <p className="text-white">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between p-2 bg-white/2 rounded"
              >
                <div
                  className={`${
                    t.completed ? "line-through text-gray-400" : "text-white"
                  }`}
                >
                  {t.title}
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id, t.completed)}
                  />
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="text-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
