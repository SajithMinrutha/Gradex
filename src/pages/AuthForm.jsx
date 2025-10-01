// src/pages/AuthForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Mail, Lock, UserPlus, LogIn } from "lucide-react";

export default function AuthForm({ mode = "signin" }) {
  const [authMode, setAuthMode] = useState(mode); // 'signin' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let res;

      if (authMode === "signin") {
        res = await supabase.auth.signInWithPassword({ email, password });
        if (res.error) throw res.error;
      } else {
        // Sign Up Mode
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        // Try to check if user already exists
        const { data: existingUser } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (existingUser?.user) {
          throw new Error("This email is already registered. Please sign in.");
        }

        // Continue with sign up
        res = await supabase.auth.signUp({ email, password });
        if (res.error) throw res.error;
      }

      navigate("/");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <div className="bg-gray-800 shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          {authMode === "signin" ? (
            <LogIn size={48} className="text-blue-400" />
          ) : (
            <UserPlus size={48} className="text-green-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">
          {authMode === "signin" ? "Sign In" : "Sign Up"}
        </h1>

        {errorMsg && (
          <div className="bg-red-500 text-white p-2 mb-4 rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <Mail className="mr-2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none text-white"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-gray-700 rounded px-3 py-2">
            <Lock className="mr-2 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-white"
              required
            />
          </div>

          {/* Confirm Password (only for signup) */}
          {authMode === "signup" && (
            <div className="flex items-center bg-gray-700 rounded px-3 py-2">
              <Lock className="mr-2 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent w-full outline-none text-white"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
          >
            {loading
              ? "Loading..."
              : authMode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>

        {/* Toggle Auth Mode */}
        <p className="mt-4 text-center text-gray-400">
          {authMode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            className="text-blue-400 hover:underline"
            onClick={() =>
              setAuthMode(authMode === "signin" ? "signup" : "signin")
            }
          >
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
