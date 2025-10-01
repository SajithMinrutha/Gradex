// src/pages/Physics.jsx
import CenterArea from "../components/CenterArea";
import Card from "../components/Card";

export default function Physics() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">Physics</h1>
      <p className="text-gray-300 mb-6">
        Your Physics marks and progress (full view).
      </p>
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">
          Physics Progress
        </h2>
        <CenterArea subject="Physics" showStats={true} chartHeight={350} />
      </Card>
    </div>
  );
}
