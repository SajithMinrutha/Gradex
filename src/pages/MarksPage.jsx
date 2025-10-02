import React, { useEffect, useState } from "react";
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

const defaultSubjects = ["Maths", "Physics", "Chemistry"];
const colors = {
  Maths: { MCQ: "#8b5cf6", Essay: "#c084fc", Total: "#a78bfa" },
  Physics: { MCQ: "#14b8a6", Essay: "#2dd4bf", Total: "#5eead4" },
  Chemistry: { MCQ: "#f472b6", Essay: "#f9a8d4", Total: "#fbcfe8" },
};

export default function CenterArea({ showStats = false, subject }) {
  const [marksData, setMarksData] = useState({});

  const subjects = subject ? [subject] : defaultSubjects;

  const fetchMarks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const newData = {};
    for (let sub of subjects) {
      const { data } = await supabase
        .from("marks")
        .select("*")
        .eq("subject", sub)
        .eq("user_id", user.id)
        .order("id", { ascending: true });
      newData[sub] = data.map((m, idx) => ({
        exam: `Test ${idx + 1}`,
        MCQ: m.mcq,
        Essay: m.essay,
        Total: m.mcq + m.essay,
      }));
    }
    setMarksData(newData);
  };

  useEffect(() => {
    fetchMarks();
  }, [subject]);

  const calculateStats = (data) => {
    if (!data || data.length === 0)
      return { highest: "-", recent: "-", trend: "-" };
    const totalMarks = data.map((d) => d.Total);
    const highest = Math.max(...totalMarks);
    const recent = totalMarks[totalMarks.length - 1];
    const trend =
      totalMarks.length > 1
        ? totalMarks[totalMarks.length - 1] > totalMarks[totalMarks.length - 2]
          ? "Improving ⬆️"
          : totalMarks[totalMarks.length - 1] <
            totalMarks[totalMarks.length - 2]
          ? "Declining ⬇️"
          : "Steady ➡️"
        : "-";
    return { highest, recent, trend };
  };

  return (
    <div
      className={`grid ${
        subjects.length > 1
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid-cols-1"
      }`}
    >
      {subjects.map((sub) => {
        const data = marksData[sub] || [];
        const stats = calculateStats(data);
        return (
          <div
            key={sub}
            className="bg-gray-800 p-4 rounded-xl shadow-xl flex flex-col w-full"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">
              {sub}
            </h2>
            <div className="w-full h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <XAxis dataKey="exam" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend verticalAlign="top" />
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
            </div>
            {showStats && (
              <div className="mt-4 text-white space-y-1 text-sm sm:text-base">
                <p>
                  <span className="font-semibold">Highest Mark:</span>{" "}
                  {stats.highest}
                </p>
                <p>
                  <span className="font-semibold">Recent Mark:</span>{" "}
                  {stats.recent}
                </p>
                <p>
                  <span className="font-semibold">Trend:</span> {stats.trend}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
