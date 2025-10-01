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

const neonColors = {
  Maths: { MCQ: "#3b82f6", Essay: "#7c3aed", Total: "#60a5fa" },
  Physics: { MCQ: "#06b6d4", Essay: "#0891b2", Total: "#22d3ee" },
  Chemistry: { MCQ: "#f472b6", Essay: "#ec4899", Total: "#fb7185" },
};

const defaultSubjects = ["Maths", "Physics", "Chemistry"];

export default function CenterArea({ subject, showStats = true }) {
  const [marksData, setMarksData] = useState({});
  const [loading, setLoading] = useState(true);

  const subjects = subject ? [subject] : defaultSubjects;

  useEffect(() => {
    let mounted = true;
    const fetchMarks = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) {
        setMarksData({});
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("marks")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      const grouped = {};
      subjects.forEach((s) => {
        const list = (data || []).filter((r) => r.subject === s);
        grouped[s] = list.map((m, idx) => ({
          exam: `Test ${idx + 1}`,
          MCQ: m.mcq,
          Essay: m.essay,
          Total: m.mcq + m.essay,
        }));
      });
      if (mounted) {
        setMarksData(grouped);
        setLoading(false);
      }
    };
    fetchMarks();
    return () => {
      mounted = false;
    };
  }, [subject]);

  const calculateStats = (data) => {
    if (!data?.length) return { highest: "-", recent: "-", trend: "-" };
    const totals = data.map((d) => d.Total);
    const highest = Math.max(...totals);
    const recent = totals[totals.length - 1];
    const prev = totals[totals.length - 2];
    const trend =
      totals.length > 1
        ? recent > prev
          ? "⬆️ Improving"
          : recent < prev
          ? "⬇️ Declining"
          : "➡️ Steady"
        : "-";
    return { highest, recent, trend };
  };

  if (loading) return <div className="text-white p-6">Loading…</div>;

  return (
    <div
      className={`grid ${
        subjects.length > 1 ? "grid-cols-1 md:grid-cols-3 gap-6" : ""
      }`}
    >
      {subjects.map((s) => {
        const data = marksData[s] || [];
        const stats = calculateStats(data);
        return (
          <Card key={s}>
            <h2 className="text-lg font-semibold text-white mb-2">{s}</h2>
            <div className="w-full h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis
                    dataKey="exam"
                    stroke="#93c5fd"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis stroke="#93c5fd" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(0,0,0,0.7)",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="MCQ"
                    stroke={neonColors[s].MCQ}
                    fill={neonColors[s].MCQ + "33"}
                  />
                  <Area
                    type="monotone"
                    dataKey="Essay"
                    stroke={neonColors[s].Essay}
                    fill={neonColors[s].Essay + "33"}
                  />
                  <Area
                    type="monotone"
                    dataKey="Total"
                    stroke={neonColors[s].Total}
                    fill={neonColors[s].Total + "33"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {showStats && (
              <div className="mt-2 text-gray-200 text-sm">
                <div>Highest: {stats.highest}</div>
                <div>Recent: {stats.recent}</div>
                <div>Trend: {stats.trend}</div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
