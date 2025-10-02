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

// neon color palette (will assign dynamically)
const colors = [
  "#3b82f6",
  "#06b6d4",
  "#f472b6",
  "#22d3ee",
  "#a3e635",
  "#facc15",
  "#f97316",
  "#e11d48",
  "#8b5cf6",
];

export default function PlanStudying() {
  const [subject, setSubject] = useState("");
  const [target, setTarget] = useState("");
  const [actual, setActual] = useState("");
  const [sessions, setSessions] = useState([]);
  const [userSubjects, setUserSubjects] = useState([]);

  // fetch user's subjects
  const fetchSubjects = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data: subs } = await supabase
      .from("subjects")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: true });

    if (subs) {
      setUserSubjects(subs);
      if (!subject && subs.length > 0) setSubject(subs[0].name);
    }
  };

  // fetch sessions
  const fetchSessions = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", user.id)
      .order("session_date", { ascending: true });

    setSessions(data || []);
  };

  useEffect(() => {
    fetchSubjects();
    fetchSessions();
  }, []);

  // add session
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
    fetchSessions();
  };

  // prepare chart data for line chart
  const prepareChartData = () => {
    const subjects = userSubjects.map((s) => s.name);

    // get all unique dates
    const dates = Array.from(
      new Set(sessions.map((s) => s.session_date))
    ).sort();
    return dates.map((date) => {
      const entry = { date };
      subjects.forEach((s) => {
        const session = sessions.find(
          (sess) => sess.subject === s && sess.session_date === date
        );
        entry[`${s}_target`] = session ? session.target_minutes : null;
        entry[`${s}_actual`] = session ? session.actual_minutes : null;
      });
      return entry;
    });
  };

  const chartData = prepareChartData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Plan Studying</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input form */}
        <Card>
          <div>
            <label className="text-sm text-gray-300">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 rounded bg-white/5 mb-3"
            >
              {userSubjects.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>

            <label className="text-sm text-gray-300">Target minutes</label>
            <input
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              type="number"
              min="0"
              className="w-full p-2 rounded bg-white/5 mb-3"
            />

            <label className="text-sm text-gray-300">Actual minutes</label>
            <input
              value={actual}
              onChange={(e) => setActual(e.target.value)}
              type="number"
              min="0"
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

        {/* Graph */}
        <Card className="lg:col-span-2">
          <h3 className="text-white font-semibold mb-3">
            Ideal vs Real Study Time
          </h3>
          <p className="text-gray-400 mb-2 text-sm">
            Each line = one subject. X = Session date, Y = Minutes.
          </p>

          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis
                  dataKey="date"
                  stroke="#93c5fd"
                  label={{ value: "Date", position: "insideBottom" }}
                />
                <YAxis
                  stroke="#93c5fd"
                  label={{
                    value: "Minutes",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />

                {userSubjects.map((s, idx) => (
                  <Line
                    key={`${s.name}_target`}
                    type="monotone"
                    dataKey={`${s.name}_target`}
                    name={`${s.name} Target`}
                    stroke={colors[idx % colors.length]}
                    strokeDasharray="5 5"
                    connectNulls
                  />
                ))}

                {userSubjects.map((s, idx) => (
                  <Line
                    key={`${s.name}_actual`}
                    type="monotone"
                    dataKey={`${s.name}_actual`}
                    name={`${s.name} Actual`}
                    stroke={colors[idx % colors.length]}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
