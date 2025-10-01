// src/pages/Maths.jsx
import CenterArea from "../components/CenterArea";
import Card from "../components/Card";

export default function Maths() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">Maths</h1>
      <p className="text-gray-300 mb-6">
        Your Maths marks and progress (full view).
      </p>
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">
          Maths Progress
        </h2>
        <CenterArea subject="Maths" showStats={true} chartHeight={350} />
      </Card>
    </div>
  );
}
