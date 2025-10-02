// src/pages/AuthForm.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Mail,
  Lock,
  UserPlus,
  LogIn,
  CheckCircle,
  Calendar,
  Book,
} from "lucide-react";

export default function AuthForm({ mode = "signin" }) {
  const [authMode, setAuthMode] = useState(mode); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [subjects, setSubjects] = useState([""]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) navigate("/dashboard");
    };
    check();
  }, [navigate]);

  const handleAddSubject = () => setSubjects([...subjects, ""]);
  const handleRemoveSubject = (idx) =>
    setSubjects(subjects.filter((_, i) => i !== idx));
  const handleChangeSubject = (idx, val) => {
    const newArr = [...subjects];
    newArr[idx] = val;
    setSubjects(newArr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (authMode === "signin") {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        navigate("/dashboard"); // Login works now
      } else {
        // Sign up
        if (password !== confirmPassword)
          throw new Error("Passwords do not match.");
        if (!email || !password || !name || !birthday)
          throw new Error("Fill all fields");

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/login` },
        });

        if (error) throw error;

        // ⚡ Insert into names table (id, name, birthday)
        if (data?.user) {
          await supabase
            .from("names")
            .insert([{ id: data.user.id, name: name, birthday: birthday }]);

          // ✅ Insert subjects into subjects table
          const subjectsToInsert = subjects
            .map((s) => s.trim())
            .filter((s) => s);
          if (subjectsToInsert.length > 0) {
            await supabase.from("subjects").insert(
              subjectsToInsert.map((s) => ({
                user_id: data.user.id,
                name: s,
              }))
            );
          }
        }

        // Show message immediately
        setSuccessMsg(
          "Account created. Please verify your email before signing in."
        );

        // Reset form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setBirthday("");
        setSubjects([""]);
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] p-4">
      <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-2xl p-8 w-full max-w-md text-white space-y-4">
        <div className="flex justify-center mb-2">
          {authMode === "signin" ? (
            <LogIn size={48} className="text-cyan-400" />
          ) : (
            <UserPlus size={48} className="text-cyan-400" />
          )}
        </div>

        <h1 className="text-2xl font-bold text-center">
          {authMode === "signin" ? "Sign In" : "Create Account"}
        </h1>

        {errorMsg && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-600/20 text-green-200 p-2 rounded flex items-center">
            <CheckCircle size={18} className="mr-2" />
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent flex-1 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Name & Birthday for signup */}
          {authMode === "signup" && (
            <>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                <UserPlus size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="bg-transparent flex-1 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
                <Calendar size={18} />
                <input
                  type="date"
                  className="bg-transparent flex-1 outline-none"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="font-semibold">Subjects</label>
                {subjects.map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 mt-2 bg-white/10 p-2 rounded"
                  >
                    <Book size={18} />
                    <input
                      type="text"
                      placeholder="Subject"
                      className="bg-transparent flex-1 outline-none"
                      value={s}
                      onChange={(e) => handleChangeSubject(idx, e.target.value)}
                    />
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        className="text-red-400"
                        onClick={() => handleRemoveSubject(idx)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="mt-2 text-cyan-400 cursor-pointer"
                  onClick={handleAddSubject}
                >
                  + Add Subject
                </button>
              </div>
            </>
          )}

          {/* Password */}
          <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
            <Lock size={18} />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent flex-1 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authMode === "signup" && (
            <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
              <Lock size={18} />
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-transparent flex-1 outline-none"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-cyan-500 text-black rounded font-semibold cursor-pointer hover:bg-cyan-400 transition"
          >
            {loading
              ? "Please wait..."
              : authMode === "signin"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-300 cursor-pointer">
          {authMode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <button
            onClick={() =>
              setAuthMode(authMode === "signin" ? "signup" : "signin")
            }
            className="text-cyan-400 ml-1 font-semibold cursor-pointer"
          >
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
