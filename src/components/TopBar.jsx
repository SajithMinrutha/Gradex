// src/components/TopBar.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [user, setUser] = useState(null);
  const [profileName, setProfileName] = useState("");
  const navigate = useNavigate();

  const fetchName = async (currentUser) => {
    if (!currentUser) return "User";

    const { data: nameData, error } = await supabase
      .from("names")
      .select("name")
      .eq("id", currentUser.id)
      .single();

    if (error) {
      console.error("Error fetching name:", error.message);
      return "User";
    }

    return nameData?.name || "User";
  };

  // Initialize user on mount
  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const name = await fetchName(currentUser);
        setProfileName(name);
      }
    };

    init();

    // Listen to auth state changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const name = await fetchName(currentUser);
          setProfileName(name);
        } else {
          setProfileName("");
        }
      }
    );

    return () => {
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Immediately update state
      setUser(null);
      setProfileName("");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.message);
      alert("Failed to logout. Try again.");
    }
  };

  return (
    <header className="flex items-center justify-between py-4 px-4 border-b border-white/10">
      <div>
        <h1 className="text-2xl font-bold text-cyan-300 drop-shadow-lg cursor-pointer">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-gray-300 hidden sm:inline">
              {profileName}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-2 bg-white/6 text-white rounded-lg hover:bg-white/10 cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 cursor-pointer"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
