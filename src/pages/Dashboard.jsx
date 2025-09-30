import CenterArea from "../components/CenterArea";

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6">Welcome to Gradexa</h1>
      <p className="text-gray-300 mb-6">
        Track your marks and monitor your progress efficiently.
      </p>
      <CenterArea showStats={true} />
    </div>
  );
}
