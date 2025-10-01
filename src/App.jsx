import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./components/Menu";
import TopBar from "./components/TopBar";

// pages
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
      <div className="relative min-h-screen w-full bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] text-white overflow-hidden">
        <div className="relative z-10 flex w-full min-h-screen">
          <Menu />
          <div className="flex flex-col flex-1">
            <TopBar />
            <main className="flex-1 overflow-auto">
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
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
