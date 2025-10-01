import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 border-b border-white/10">
      <div>
        <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-lg">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-2 bg-white/6 text-white rounded-lg hover:bg-white/10"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
