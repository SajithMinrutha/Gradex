// src/pages/AuthForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Mail, Lock, UserPlus, LogIn, CheckCircle } from "lucide-react";

export default function AuthForm({ mode = "signin" }) {
  const [authMode, setAuthMode] = useState(mode); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) navigate("/");
    };
    check();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (authMode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Note: Supabase doesn't always return email_confirmed_at in client; do a user fetch to check
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        if (user && !user.email_confirmed_at) {
          // sign out the session (avoid partially logged in state)
          await supabase.auth.signOut();
          throw new Error(
            "Please verify your email first. Check your inbox for the verification link."
          );
        }

        navigate("/");
      } else {
        // signup
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        setSuccessMsg(
          "Account created. Please verify your email before signing in."
        );
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022]">
      <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-2xl p-8 w-full max-w-md text-white">
        <div className="flex justify-center mb-6">
          {authMode === "signin" ? (
            <LogIn size={48} className="text-cyan-400" />
          ) : (
            <UserPlus size={48} className="text-green-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          {authMode === "signin" ? "Sign In" : "Create account"}
        </h1>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-300 p-2 mb-3 rounded">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-600/20 text-green-200 p-2 mb-3 rounded flex items-center">
            <CheckCircle size={18} className="mr-2" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 bg-white/5 rounded px-3 py-2">
            <Mail size={18} className="text-cyan-300" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-3 bg-white/5 rounded px-3 py-2">
            <Lock size={18} className="text-cyan-300" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full"
            />
          </div>

          {authMode === "signup" && (
            <div className="flex items-center gap-3 bg-white/5 rounded px-3 py-2">
              <Lock size={18} className="text-cyan-300" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-transparent outline-none w-full"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 text-black rounded font-semibold"
          >
            {loading
              ? "Please wait..."
              : authMode === "signin"
              ? "Sign in"
              : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300">
          {authMode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setAuthMode(authMode === "signin" ? "signup" : "signin");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-cyan-400 ml-1"
          >
            {authMode === "signin" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
