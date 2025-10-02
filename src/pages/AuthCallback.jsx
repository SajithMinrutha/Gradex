import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying email...");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true,
        });
        if (error) throw error;

        if (data?.session?.user?.email_confirmed_at) {
          setMessage("Email verified! Redirecting to dashboard...");
          navigate("/dashboard");
        } else {
          setMessage("Email verification failed. Please try again.");
        }
      } catch (err) {
        setMessage(err.message);
      }
    };
    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#071029] text-white">
      <div className="p-6 rounded-lg text-center bg-[#0b1226]/80 border border-white/10">
        <h1 className="text-xl font-bold mb-4">Gradexa</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}
