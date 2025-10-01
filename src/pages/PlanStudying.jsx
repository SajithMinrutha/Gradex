// src/pages/PlanStudying.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function PlanStudying() {
  const [subject, setSubject] = useState("Maths");
  const [target, setTarget] = useState("");
  const [actual, setActual] = useState("");
  const [sessions, setSessions] = useState([]);

  const subjects = ["Maths", "Physics", "Chemistry", "ICT", "Biology"];

  const fetch = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;
    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("session_date", { ascending: true });
    setSessions(
      (data || []).map((s) => ({
        id: s.id,
        date: s.session_date,
        target: s.target_minutes,
        actual: s.actual_minutes,
      }))
    );
  };

  useEffect(() => {
    fetch();
  }, []);

  const addSession = async () => {
    const t = Number(target) || 0;
    const a = Number(actual) || 0;
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert("Sign in required");
    await supabase.from("study_sessions").insert([
      {
        user_id: user.id,
        subject,
        target_minutes: t,
        actual_minutes: a,
        session_date: new Date().toISOString().slice(0, 10),
      },
    ]);
    setTarget("");
    setActual("");
    fetch();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Plan Studying</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <div>
            <label className="text-sm text-gray-300">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded bg-white/5 mb-3"
            >
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <label className="text-sm text-gray-300">Target minutes</label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              type="number"
              className="w-full p-2 rounded bg-white/5 mb-3"
            />

            <label className="text-sm text-gray-300">Actual minutes</label>
            <input
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              type="number"
              className="w-full p-2 rounded bg-white/5 mb-3"
            />

            <button
              onClick={addSession}
              className="px-4 py-2 bg-cyan-500 text-black rounded"
            >
              Add Session
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-3">Target vs Actual</h3>

          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessions}>
                <XAxis dataKey="date" stroke="#93c5fd" />
                <YAxis stroke="#93c5fd" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target (min)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  name="Actual (min)"
                  stroke="#f472b6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm text-gray-200">
            <p>
              Sessions shown by date. Add sessions with target and actual
              minutes to compare planned vs real study.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
