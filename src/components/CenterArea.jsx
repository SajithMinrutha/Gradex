import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const subjects = ["Maths", "Physics", "Chemistry"];
const colors = {
  Maths: { MCQ: "#8b5cf6", Essay: "#c084fc", Total: "#a78bfa" },
  Physics: { MCQ: "#14b8a6", Essay: "#2dd4bf", Total: "#5eead4" },
  Chemistry: { MCQ: "#f472b6", Essay: "#f9a8d4", Total: "#fbcfe8" },
};

export default function CenterArea() {
  const [marksData, setMarksData] = useState({});
  const [todos, setTodos] = useState([]);

  const fetchMarks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const newData = {};
    for (let sub of subjects) {
      const { data } = await supabase
        .from("marks")
        .select("*")
        .eq("user_id", user.id)
        .eq("subject", sub)
        .order("id", { ascending: true });
      newData[sub] = (data || []).map((m, idx) => ({
        exam: `Test ${idx + 1}`,
        MCQ: m.mcq,
        Essay: m.essay,
        Total: m.mcq + m.essay,
      }));
    }
    setMarksData(newData);
  };

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
    fetchMarks();
    fetchTodos();
  }, []);

  const calculateStats = (data) => {
    if (!data || data.length === 0)
      return { highest: "-", recent: "-", trend: "-" };
    const totalMarks = data.map((d) => d.Total);
    const highest = Math.max(...totalMarks);
    const recent = totalMarks[totalMarks.length - 1];
    const trend =
      totalMarks.length > 1
        ? totalMarks[totalMarks.length - 1] > totalMarks[totalMarks.length - 2]
          ? "⬆️ Improving"
          : totalMarks[totalMarks.length - 1] <
            totalMarks[totalMarks.length - 2]
          ? "⬇️ Declining"
          : "➡️ Steady"
        : "-";
    return { highest, recent, trend };
  };

  const toggleTodo = async (id, completed) => {
    await supabase.from("todos").update({ completed: !completed }).eq("id", id);
    fetchTodos();
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {subjects.map((sub) => {
        const data = marksData[sub] || [];
        const stats = calculateStats(data);
        return (
          <div
            key={sub}
            className="bg-transparent p-4 rounded-xl shadow-lg flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">{sub}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={data}
                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis
                  dataKey="exam"
                  axisLine={false}
                  tickLine={false}
                  stroke="#fff"
                />
                <YAxis axisLine={false} tickLine={false} stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.7)",
                    border: "none",
                    color: "#fff",
                  }}
                />
                <Legend verticalAlign="top" wrapperStyle={{ color: "#fff" }} />
                <Area
                  type="monotone"
                  dataKey="MCQ"
                  stroke={colors[sub].MCQ}
                  fill={colors[sub].MCQ + "33"}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Essay"
                  stroke={colors[sub].Essay}
                  fill={colors[sub].Essay + "33"}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Total"
                  stroke={colors[sub].Total}
                  fill={colors[sub].Total + "33"}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 text-white space-y-1">
              <p>
                <span className="font-semibold">Highest:</span> {stats.highest}
              </p>
              <p>
                <span className="font-semibold">Recent:</span> {stats.recent}
              </p>
              <p>
                <span className="font-semibold">Trend:</span> {stats.trend}
              </p>
            </div>
          </div>
        );
      })}

      {/* ToDo List */}
      <div className="md:col-span-3 bg-transparent p-4 rounded-xl shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-4 text-white">ToDo List</h2>
        {todos.length === 0 ? (
          <p className="text-white">No todos yet.</p>
        ) : (
          <ul>
            {todos.map((t) => (
              <li
                key={t.id}
                className={`p-2 border-b flex justify-between items-center ${
                  t.completed ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {t.title}
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id, t.completed)}
                  className="ml-2"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
