// src/components/CenterArea.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "./Card";

// Neon color palettes
const palettes = [
  ["#3b82f6", "#60a5fa", "#93c5fd"],
  ["#ec4899", "#f472b6", "#f9a8d4"],
  ["#10b981", "#34d399", "#6ee7b7"],
  ["#f59e0b", "#fbbf24", "#fde68a"],
  ["#6366f1", "#818cf8", "#a5b4fc"],
  ["#f87171", "#fb7185", "#fda4af"],
  ["#06b6d4", "#22d3ee", "#67e8f9"],
  ["#8b5cf6", "#a78bfa", "#c4b5fd"],
];

function getPaletteForSubject(subject) {
  const index =
    subject.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) %
    palettes.length;
  return palettes[index];
}

function calcStats(data) {
  if (!data || data.length === 0) return { avg: "-", std: "-", deltaPct: "-" };
  const totals = data.map((d) => d.Total);
  const avg = totals.reduce((a, b) => a + b, 0) / totals.length;
  const variance =
    totals.reduce((s, v) => s + Math.pow(v - avg, 2), 0) / totals.length;
  const std = Math.sqrt(variance);
  const last = totals[totals.length - 1];
  const prev = totals.length > 1 ? totals[totals.length - 2] : last;
  const deltaPct =
    prev === 0 ? "-" : (((last - prev) / prev) * 100).toFixed(1) + "%";
  return {
    avg: Math.round(avg * 10) / 10,
    std: Math.round(std * 10) / 10,
    deltaPct,
  };
}

export default function CenterArea({
  subject, // optional
  showStats = true,
  chartHeight = 160,
}) {
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setMarksData({});
        setLoading(false);
        return;
      }

      // Fetch subjects dynamically
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("name")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      const subjectsList = subjectsData?.map((s) => s.name) || [];
      if (mounted) setSubjects(subjectsList);

      // Fetch marks
      const { data: marks, error } = await supabase
        .from("marks")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error("Error fetching marks:", error);
        setMarksData({});
        setLoading(false);
        return;
      }

      // Only fetch single subject if prop is passed
      const targetSubjects = subject ? [subject] : subjectsList;

      const grouped = {};
      targetSubjects.forEach((s) => {
        // ✅ Case-insensitive match for subjects
        const list = (marks || []).filter(
          (m) => m.subject.toLowerCase() === s.toLowerCase()
        );
        grouped[s] = list.map((m, idx) => ({
          id: m.id,
          exam: `Test ${idx + 1}`,
          MCQ: m.mcq ?? 0,
          Essay: m.essay ?? 0,
          Total: (m.mcq ?? 0) + (m.essay ?? 0),
        }));
      });

      if (mounted) {
        setMarksData(grouped);
        setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
  }, [subject]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!marksData || Object.keys(marksData).length === 0)
    return <div className="p-6 text-white">No marks available yet.</div>;

  return (
    <div
      className={`grid ${
        subjects.length > 1 && !subject
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : ""
      }`}
    >
      {Object.keys(marksData).map((s) => {
        const data = marksData[s] || [];
        const stats = calcStats(data);
        const palette = getPaletteForSubject(s);

        return (
          <Card key={s}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">{s}</h3>
            </div>

            {data.length === 0 ? (
              <div className="text-gray-400 p-6 text-center">
                No marks recorded yet for {s}.
              </div>
            ) : (
              <div className="w-full" style={{ height: chartHeight }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <XAxis
                      dataKey="exam"
                      axisLine={false}
                      tickLine={false}
                      stroke="#93c5fd"
                    />
                    <YAxis axisLine={false} tickLine={false} stroke="#93c5fd" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                      }}
                    />
                    <Legend
                      verticalAlign="top"
                      wrapperStyle={{ color: "#fff" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="MCQ"
                      stroke={palette[0]}
                      fill={palette[0] + "33"}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Essay"
                      stroke={palette[1]}
                      fill={palette[1] + "33"}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="Total"
                      stroke={palette[2]}
                      fill={palette[2] + "22"}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {showStats && data.length > 0 && (
              <div className="mt-3 text-sm text-gray-200">
                <div className="flex justify-between">
                  <span>Average</span>
                  <strong>{stats.avg}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Std Dev</span>
                  <strong>{stats.std}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Δ</span>
                  <strong>{stats.deltaPct}</strong>
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
