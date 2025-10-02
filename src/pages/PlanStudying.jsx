import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Card from "../components/Card";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ZAxis,
} from "recharts";

// neon colors for subjects
const subjectColors = {
  Maths: "#3b82f6",
  Physics: "#06b6d4",
  Chemistry: "#f472b6",
  ICT: "#22d3ee",
  Biology: "#a3e635",
};

export default function PlanStudying() {
  const [subject, setSubject] = useState("Maths");
  const [target, setTarget] = useState("");
  const [actual, setActual] = useState("");
  const [sessions, setSessions] = useState([]);

  const subjects = Object.keys(subjectColors);

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

  // prepare chart data: each subject = Scatter series
  const prepareChartData = () => {
    const grouped = {};
    for (let s of subjects) {
      grouped[s] = (sessions || [])
        .filter((x) => x.subject === s)
        .map((x, idx) => ({
          x: x.target_minutes,
          y: x.actual_minutes,
          date: x.session_date,
          idx,
        }));
    }
    return grouped;
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
              {subjects.map((s) => (
                <option key={s}>{s}</option>
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
            Each dot = one study session. X = Target minutes (ideal), Y = Actual
            minutes (real).
          </p>

          <div style={{ height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Target"
                  stroke="#93c5fd"
                  label={{ value: "Target (min)", position: "insideBottom" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Actual"
                  stroke="#93c5fd"
                  label={{
                    value: "Actual (min)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <ZAxis range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(val, name) =>
                    name === "x"
                      ? `${val} min target`
                      : name === "y"
                      ? `${val} min actual`
                      : val
                  }
                  labelFormatter={(l) => `Session`}
                />
                <Legend />
                {subjects.map(
                  (s) =>
                    chartData[s]?.length > 0 && (
                      <Scatter
                        key={s}
                        name={s}
                        data={chartData[s]}
                        fill={subjectColors[s]}
                      />
                    )
                )}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
