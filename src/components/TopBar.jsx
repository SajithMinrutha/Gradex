import { supabase } from "../supabaseClient";
import { useState, useEffect } from "react";

function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="flex flex-row justify-between items-center py-4 px-4 border-b border-gray-700">
      <h1 className="font-bold text-white">Dashboard</h1>

      <div className="flex space-x-6 text-white">
        {user ? (
          <>
            <span>{user.email}</span>
            <button
              onClick={handleLogout}
              className="font-bold hover:text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <a href="/login" className="font-bold hover:text-blue-400">
            Sign In
          </a>
        )}
        <a href="/settings" className="font-bold hover:text-blue-400">
          Settings
        </a>
      </div>
    </div>
  );
}

export default TopBar;
