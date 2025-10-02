// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

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

// Protected Route
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!session) return <Navigate to="/login" replace />;

  return children;
}

function AppLayout() {
  return (
    <div className="relative min-h-screen w-full bg-[#030416] text-white">
      <div className="flex w-full min-h-screen">
        <Menu />
        <div className="flex flex-col flex-1">
          <TopBar />
          <div className="flex-1 overflow-auto p-4">
            <Routes>
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="maths"
                element={
                  <ProtectedRoute>
                    <Maths />
                  </ProtectedRoute>
                }
              />
              <Route
                path="physics"
                element={
                  <ProtectedRoute>
                    <Physics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="chemistry"
                element={
                  <ProtectedRoute>
                    <Chemistry />
                  </ProtectedRoute>
                }
              />
              <Route
                path="add-marks"
                element={
                  <ProtectedRoute>
                    <AddMarks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="todo"
                element={
                  <ProtectedRoute>
                    <ToDo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="plan-studying"
                element={
                  <ProtectedRoute>
                    <PlanStudying />
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected app routes */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
