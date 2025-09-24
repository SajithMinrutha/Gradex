import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data for each subject
const subjectData = {
  Maths: [
    { exam: "Jan", MCQ: 20, Essay: 15, Total: 35 },
    { exam: "Feb", MCQ: 25, Essay: 18, Total: 43 },
    { exam: "Mar", MCQ: 30, Essay: 20, Total: 50 },
    { exam: "Apr", MCQ: 28, Essay: 22, Total: 50 },
  ],
  Physics: [
    { exam: "Jan", MCQ: 18, Essay: 20, Total: 38 },
    { exam: "Feb", MCQ: 22, Essay: 18, Total: 40 },
    { exam: "Mar", MCQ: 26, Essay: 22, Total: 48 },
    { exam: "Apr", MCQ: 30, Essay: 25, Total: 55 },
  ],
  Chemistry: [
    { exam: "Jan", MCQ: 25, Essay: 15, Total: 40 },
    { exam: "Feb", MCQ: 20, Essay: 18, Total: 38 },
    { exam: "Mar", MCQ: 30, Essay: 20, Total: 50 },
    { exam: "Apr", MCQ: 28, Essay: 22, Total: 50 },
  ],
};

// Color palettes that go well with purple
const colorPalettes = {
  Maths: {
    MCQ: "#8b5cf6", // purple
    Essay: "#c084fc", // light purple
    Total: "#a78bfa", // lavender
  },
  Physics: {
    MCQ: "#14b8a6", // teal
    Essay: "#2dd4bf", // turquoise
    Total: "#5eead4", // mint
  },
  Chemistry: {
    MCQ: "#f472b6", // pink
    Essay: "#f9a8d4", // soft pink
    Total: "#fbcfe8", // pastel pink
  },
};

function SubjectGraph({ title, data, colors }) {
  return (
    <div className="p-4 rounded-xl m-4 flex-1 shadow-2xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="exam" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend verticalAlign="top" />
          <Area
            type="monotone"
            dataKey="MCQ"
            stroke={colors.MCQ}
            fill={colors.MCQ + "33"}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Essay"
            stroke={colors.Essay}
            fill={colors.Essay + "33"}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="Total"
            stroke={colors.Total}
            fill={colors.Total + "33"}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CenterArea() {
  return (
    <div className="flex flex-col md:flex-row flex-wrap">
      <SubjectGraph
        title="Maths"
        data={subjectData.Maths}
        colors={colorPalettes.Maths}
      />
      <SubjectGraph
        title="Physics"
        data={subjectData.Physics}
        colors={colorPalettes.Physics}
      />
      <SubjectGraph
        title="Chemistry"
        data={subjectData.Chemistry}
        colors={colorPalettes.Chemistry}
      />
    </div>
  );
}

export default CenterArea;
