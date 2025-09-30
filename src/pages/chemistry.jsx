import CenterArea from "../components/CenterArea";

export default function Chemistry() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Chemistry</h1>
      <p className="text-gray-300 mb-6">Your Chemistry marks and progress.</p>
      <CenterArea showStats={true} subject="Chemistry" />
    </div>
  );
}
