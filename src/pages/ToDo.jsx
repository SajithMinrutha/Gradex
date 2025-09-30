import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function ToDo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const fetchTasks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    setTasks(data || []);
  };

  const addTask = async () => {
    if (!newTask) return;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { error } = await supabase
      .from("todos")
      .insert([{ title: newTask, user_id: user.id, completed: false }]);
    if (error) console.error(error);

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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">ToDo List</h1>

      <div className="flex mb-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="border p-2 rounded mr-2 flex-1 text-black"
          placeholder="New Task"
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addTask}
        >
          Add
        </button>
      </div>

      <ul>
        {tasks.map((t) => (
          <li
            key={t.id}
            className={`p-2 border-b flex justify-between items-center ${
              t.completed ? "line-through text-gray-400" : ""
            }`}
          >
            <span>{t.title}</span>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggleTask(t.id, t.completed)}
              />
              <button
                className="text-red-500 hover:text-red-400"
                onClick={() => deleteTask(t.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
