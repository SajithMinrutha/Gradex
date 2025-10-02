// src/pages/Dashboard.jsx
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
      .order("created_at", { ascending: false });
    setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const toggleTodo = async (id, completed) => {
    await supabase.from("todos").update({ completed: !completed }).eq("id", id);
    fetchTodos();
  };

  // priority color small dot
  const priorityDot = (p) => {
    if (p === "High")
      return (
        <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-2" />
      );
    if (p === "Medium")
      return (
        <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-2" />
      );
    return (
      <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-2" />
    );
  };

  // sort: High > Medium > Low then not completed first
  const sortedTodos = [...todos].sort((a, b) => {
    const pr = { High: 3, Medium: 2, Low: 1 };
    const pa = pr[a.priority] || 2;
    const pb = pr[b.priority] || 2;
    if (pa !== pb) return pb - pa;
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="px-6 py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-cyan-300">Welcome to Gradexa</h1>
        <p className="text-gray-300">Overview of your subjects and tasks.</p>
      </div>

      {/* Graphs (dashboard) */}
      <CenterArea showStats={true} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div className="flex flex-col gap-3 ">
            <button
              onClick={() => navigate("/add-marks")}
              className="px-4 py-2 bg-cyan-500 text-black rounded-md cursor-pointer"
            >
              Add Marks
            </button>
            <button
              onClick={() => navigate("/todo")}
              className="px-4 py-2 bg-white/5 text-white rounded-md cursor-pointer"
            >
              Manage ToDos
            </button>
            <button
              onClick={() => navigate("/plan-studying")}
              className="px-4 py-2 bg-white/5 text-white rounded-md cursor-pointer"
            >
              Plan Studying
            </button>
          </div>
        </Card>

        {/* ToDos inline */}
        <Card title="Your ToDos">
          {sortedTodos.length === 0 ? (
            <p className="text-gray-400">No todos yet.</p>
          ) : (
            <ul className="space-y-2">
              {sortedTodos.map((t) => (
                <li
                  key={t.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    t.completed ? "line-through text-gray-500" : "text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {priorityDot(t.priority)}
                    <span>{t.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTodo(t.id, t.completed)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Placeholder */}
        <Card title="Shortcuts">
          <p className="text-gray-300">Useful links and summaries here.</p>
        </Card>
      </div>
    </div>
  );
}
