// src/pages/SubjectPage.jsx
import { useParams } from "react-router-dom";
import CenterArea from "../components/CenterArea";
import Card from "../components/Card";

export default function SubjectPage() {
  const { name } = useParams();

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold text-cyan-300 mb-4">{name}</h1>
      <p className="text-gray-300 mb-6">Your {name} marks and progress.</p>
      <Card>
        <h2 className="text-xl font-semibold text-white mb-4">
          {name} Progress
        </h2>
        <CenterArea subject={name} showStats={true} chartHeight={500} />
      </Card>
    </div>
  );
}
