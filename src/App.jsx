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
import AddMarks from "./pages/AddMarks";
import ToDo from "./pages/ToDo";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PlanStudying from "./pages/PlanStudying";
import Settings from "./pages/Settings";
import SubjectPage from "./pages/SubjectPage";
import AuthCallback from "./pages/AuthCallback"; // new

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!session || !session.user?.email_confirmed_at) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Auto-refresh wrapper HOC
function withAutoRefresh(PageComponent, interval = 5000) {
  return function Wrapper(props) {
    const [, setTick] = useState(0);

    useEffect(() => {
      const timer = setInterval(() => {
        setTick((tick) => tick + 1);
      }, interval);
      return () => clearInterval(timer);
    }, []);

    return <PageComponent {...props} />;
  };
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
                    {withAutoRefresh(Dashboard)()}
                  </ProtectedRoute>
                }
              />
              <Route
                path="add-marks"
                element={
                  <ProtectedRoute>{withAutoRefresh(AddMarks)()}</ProtectedRoute>
                }
              />
              <Route
                path="todo"
                element={
                  <ProtectedRoute>{withAutoRefresh(ToDo)()}</ProtectedRoute>
                }
              />
              <Route
                path="plan-studying"
                element={
                  <ProtectedRoute>
                    {withAutoRefresh(PlanStudying)()}
                  </ProtectedRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <ProtectedRoute>{withAutoRefresh(Settings)()}</ProtectedRoute>
                }
              />
              {/* Dynamic subject pages */}
              <Route
                path=":subject"
                element={
                  <ProtectedRoute>
                    {withAutoRefresh(SubjectPage)()}
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
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Landing page always accessible via Menu logo */}
        <Route path="/" element={<Landing isLoggedIn={!!session} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Email verification callback page */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected app routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
