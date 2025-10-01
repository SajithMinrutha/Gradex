// src/pages/Maths.jsx
import CenterArea from "../components/CenterArea";

export default function Maths() {
  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-2">Maths</h1>
      <p className="text-gray-300 mb-6">Your Maths marks and progress.</p>
      <CenterArea subject="Maths" showStats={true} />
    </div>
  );
}
