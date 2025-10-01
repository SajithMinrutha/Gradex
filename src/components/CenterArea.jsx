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

// neon colors
const neonColors = {
  Maths: { MCQ: "#3b82f6", Essay: "#7c3aed", Total: "#60a5fa" },
  Physics: { MCQ: "#06b6d4", Essay: "#0891b2", Total: "#22d3ee" },
  Chemistry: { MCQ: "#f472b6", Essay: "#ec4899", Total: "#fb7185" },
};

const defaultSubjects = ["Maths", "Physics", "Chemistry"];

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
  subject,
  showStats = true,
  chartHeight = 160,
}) {
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);
  const subjects = subject ? [subject] : defaultSubjects;

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setMarksData({});
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("marks")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const grouped = {};
      for (const s of subjects) {
        const list = (data || []).filter((r) => r.subject === s);
        grouped[s] = list.map((m, idx) => ({
          id: m.id,
          exam: `Test ${idx + 1}`,
          MCQ: m.mcq ?? 0,
          Essay: m.essay ?? 0,
          Total: (m.mcq ?? 0) + (m.essay ?? 0),
        }));
      }
      if (mounted) {
        setMarksData(grouped);
        setLoading(false);
      }
    };
    fetchAll();
    return () => {
      mounted = false;
    };
  }, [subject]);

  if (loading) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div
      className={`grid ${
        subjects.length > 1 ? "grid-cols-1 md:grid-cols-3 gap-6" : ""
      }`}
    >
      {subjects.map((s) => {
        const data = marksData[s] || [];
        const stats = calcStats(data);
        return (
          <Card key={s}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{s}</h3>
            </div>

            {/* dynamic height for graphs */}
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
                    stroke={neonColors[s].MCQ}
                    fill={neonColors[s].MCQ + "22"}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Essay"
                    stroke={neonColors[s].Essay}
                    fill={neonColors[s].Essay + "22"}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Total"
                    stroke={neonColors[s].Total}
                    fill={neonColors[s].Total + "18"}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {showStats && (
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
