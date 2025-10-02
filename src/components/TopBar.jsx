// src/components/TopBar.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchUserAndProfile = async () => {
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user || null;
      if (mounted) setUser(currentUser);

      if (currentUser) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", currentUser.id)
          .single();

        if (mounted) setProfile(profileData);
      }
    };

    fetchUserAndProfile();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        supabase
          .from("profiles")
          .select("name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => setProfile(data));
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
            <span className="text-gray-300 hidden sm:inline">
              {profile?.name ? profile.name : user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-2 bg-white/6 text-white rounded-lg hover:bg-white/10"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400"
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
