import "./App.css";
import Menu from "./components/Menu";
import CenterArea from "./components/CenterArea";
import TopBar from "./components/TopBar";
import LightRays from "./LightRays";

function App() {
  return (
    <div className="relative min-h-screen w-full bg-gray-900">
      {/* LightRays background */}
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="bottom-center"
          raysColor="#FF00FF"
          raysSpeed={0}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      {/* Main dashboard content */}
      <div className="relative z-10 flex w-full min-h-screen">
        <Menu />

        <div className="flex flex-col flex-1">
          <TopBar />
          <CenterArea />
        </div>
      </div>
    </div>
  );
}

export default App;
