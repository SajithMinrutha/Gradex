import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { CheckCircle } from "lucide-react";

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleSupabaseRedirect = async () => {
      try {
        // Get session from URL hash and store in Supabase client
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });
        if (error) throw error;

        // Clean the URL (remove access_token hash)
        window.history.replaceState({}, document.title, "/auth/callback");

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleSupabaseRedirect();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1226] text-white">
        <p className="text-lg">Verifying your email...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0b1226] text-white p-4">
        <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center">
          <p className="text-red-400 font-semibold text-lg">Error</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] p-4">
      <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center max-w-md w-full text-white">
        <CheckCircle size={48} className="text-cyan-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
        <p className="text-gray-300 mb-6">
          Your email has been successfully verified. You can now access your
          dashboard and start using Gradexa.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-6 rounded transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
