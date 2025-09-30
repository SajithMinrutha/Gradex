// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import TopBar from "./components/TopBar";
import LightRays from "./components/LightRays";

// Pages
import Dashboard from "./pages/Dashboard";
import Maths from "./pages/Maths";
import Physics from "./pages/Physics";
import Chemistry from "./pages/Chemistry";
import AddMarks from "./pages/AddMarks";
import ToDo from "./pages/ToDo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  return (
    <Router>
      <div className="relative min-h-screen w-full bg-transparent">
        <div className="absolute inset-0 z-0">
          <LightRays
            raysOrigin="bottom-center"
            raysColor="#00ffff"
            raysSpeed={1.5}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
            className="custom-rays"
          />
        </div>

        <div className="relative z-10 flex w-full min-h-screen">
          <Menu />
          <div className="flex flex-col flex-1">
            <TopBar />
            <div className="flex-1 overflow-auto p-4">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/maths" element={<Maths />} />
                <Route path="/physics" element={<Physics />} />
                <Route path="/chemistry" element={<Chemistry />} />
                <Route path="/add-marks" element={<AddMarks />} />
                <Route path="/todo" element={<ToDo />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
