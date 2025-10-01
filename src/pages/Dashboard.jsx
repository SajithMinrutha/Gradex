import CenterArea from "../components/CenterArea";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });
    setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodo = async (id, completed) => {
    await supabase.from("todos").update({ completed: !completed }).eq("id", id);
    fetchTodos();
  };

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cyan-300">Welcome to Gradexa</h1>
        <p className="text-gray-300">Overview of your subjects and tasks.</p>
      </div>

      {/* Graphs */}
      <CenterArea showStats={true} />

      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate("/add-marks")}
            className="px-4 py-2 bg-cyan-500 text-black rounded-md"
          >
            Add Marks
          </button>
          <button
            onClick={() => navigate("/todo")}
            className="px-4 py-2 bg-white/5 text-white rounded-md"
          >
            Manage ToDos
          </button>
        </div>
      </Card>

      {/* ToDos inline */}
      <Card title="Your ToDos">
        {todos.length === 0 ? (
          <p className="text-gray-400">No todos yet.</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((t) => (
              <li
                key={t.id}
                className={`flex justify-between p-2 rounded ${
                  t.completed ? "line-through text-gray-500" : "text-white"
                }`}
              >
                {t.title}
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id, t.completed)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
