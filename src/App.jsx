import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import TopBar from "./components/TopBar";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Maths from "./pages/Maths";
import Physics from "./pages/Physics";
import Chemistry from "./pages/Chemistry";
import AddMarks from "./pages/AddMarks";
import ToDo from "./pages/ToDo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PlanStudying from "./pages/PlanStudying";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page (public) */}
        <Route path="/" element={<Landing />} />

        {/* App routes */}
        <Route
          path="/*"
          element={
            <div className="relative min-h-screen w-full bg-[#030416] text-white">
              <div className="flex w-full min-h-screen">
                <Menu />
                <div className="flex flex-col flex-1">
                  <TopBar />
                  <div className="flex-1 overflow-auto p-4">
                    <Routes>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="maths" element={<Maths />} />
                      <Route path="physics" element={<Physics />} />
                      <Route path="chemistry" element={<Chemistry />} />
                      <Route path="add-marks" element={<AddMarks />} />
                      <Route path="todo" element={<ToDo />} />
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<SignUp />} />
                      <Route path="plan-studying" element={<PlanStudying />} />
                      <Route path="settings" element={<Settings />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
