// src/pages/ToDo.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  const fetchTasks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setTasks(data || []);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert("Sign in required");

    const { error } = await supabase.from("todos").insert([
      {
        title: newTask.trim(),
        priority,
        user_id: user.id,
        completed: false,
      },
    ]);

    if (error) console.error(error);

    setNewTask("");
    setPriority("Medium");
    fetchTasks();
  };

  const toggle = async (id, completed) => {
    const { error } = await supabase
      .from("todos")
      .update({ completed: !completed })
      .eq("id", id);

    if (error) console.error(error);

    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!confirm("Delete task?")) return;
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) console.error(error);
    fetchTasks();
  };

  const colorFor = (p) =>
    p === "High"
      ? "bg-red-400"
      : p === "Medium"
      ? "bg-amber-400"
      : "bg-green-400";

  const sorted = [...tasks].sort((a, b) => {
    const map = { High: 3, Medium: 2, Low: 1 };
    return (map[b.priority] || 2) - (map[a.priority] || 2);
  });

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-cyan-300 mb-4">ToDo</h1>
      <Card>
        {/* Add Task Form */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-1 p-2 rounded bg-white/5 text-white text-sm sm:text-base"
            placeholder="New Task"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 rounded bg-white/5 text-white text-sm sm:text-base"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            onClick={addTask}
            className="px-3 sm:px-4 py-2 bg-cyan-500 text-black rounded text-sm sm:text-base"
          >
            Add
          </button>
        </div>

        {/* Task List */}
        <ul className="space-y-2">
          {sorted.map((t) => (
            <li
              key={t.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 bg-white/2 rounded gap-2"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`${colorFor(
                    t.priority
                  )} inline-block w-3 h-3 rounded-full`}
                />
                <span
                  className={
                    t.completed ? "line-through text-gray-400" : "text-white"
                  }
                >
                  {t.title}
                </span>
              </div>
              <div className="flex gap-3 items-center justify-end">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t.id, t.completed)}
                  className="w-4 h-4"
                />
                <button
                  onClick={() => deleteTask(t.id)}
                  className="text-red-400 text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
          {tasks.length === 0 && (
            <li className="text-gray-400 text-sm sm:text-base">
              No tasks yet.
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}
