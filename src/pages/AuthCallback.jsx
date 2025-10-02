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
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });
        if (error) throw error;

        // Clean URL so #access_token is gone
        window.history.replaceState({}, document.title, "/auth/callback");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    handleSupabaseRedirect();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] text-white">
        <p className="text-lg sm:text-xl animate-pulse">
          Verifying your email...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] p-4">
        <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-8 text-center max-w-md w-full">
          <p className="text-red-400 font-semibold text-lg">
            Verification Error
          </p>
          <p className="mt-2 text-gray-300">{error}</p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-2 px-6 rounded transition"
          >
            Back to Sign Up
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] p-4">
      <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/10 rounded-2xl p-8 sm:p-10 text-center max-w-md w-full text-white space-y-4">
        <CheckCircle
          size={48}
          className="text-cyan-400 mx-auto mb-4 animate-bounce"
        />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Email Verified!</h1>
        <p className="text-gray-300 text-sm sm:text-base mb-6">
          Your email has been successfully verified. You can now access your
          dashboard and start using Gradexa.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition text-sm sm:text-base"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
