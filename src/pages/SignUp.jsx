import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Lock,
  Mail,
  Calendar,
  Book,
  CheckCircle,
} from "lucide-react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [subjects, setSubjects] = useState([""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddSubject = () => setSubjects([...subjects, ""]);
  const handleRemoveSubject = (idx) =>
    setSubjects(subjects.filter((_, i) => i !== idx));

  const handleChangeSubject = (idx, val) => {
    const newArr = [...subjects];
    newArr[idx] = val;
    setSubjects(newArr);
  };

  const handleSignUp = async () => {
    setError("");
    setSuccess("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!email || !password || !name || !birthday) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/login` },
      });

      if (error) throw error;

      const user = data.user;
      if (user) {
        // Insert into profiles
        await supabase.from("profiles").insert([
          {
            id: user.id,
            name,
            birthday,
            theme: "dark",
          },
        ]);

        // Insert subjects
        const cleaned = subjects.filter((s) => s.trim() !== "");
        if (cleaned.length > 0) {
          const rows = cleaned.map((s) => ({
            user_id: user.id,
            name: s,
          }));
          await supabase.from("subjects").insert(rows);
        }
      }

      setSuccess(
        "✅ Account created. Check your email to verify your account."
      );
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] p-4">
      <div className="bg-[#071029]/80 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-white space-y-4">
        <div className="flex justify-center mb-2">
          <UserPlus size={48} className="text-cyan-300" />
        </div>
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-2 rounded">{error}</div>
        )}
        {success && (
          <div className="bg-green-600/20 text-green-200 p-2 rounded flex items-center">
            <CheckCircle size={18} className="mr-2" />
            {success}
          </div>
        )}

        <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent flex-1 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
          <UserPlus size={18} />
          <input
            type="text"
            placeholder="Full Name"
            className="bg-transparent flex-1 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
          <Calendar size={18} />
          <input
            type="date"
            className="bg-transparent flex-1 outline-none"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent flex-1 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-2 rounded">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-transparent flex-1 outline-none"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
                  className="text-red-400"
                  onClick={() => handleRemoveSubject(idx)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button className="mt-2 text-cyan-400" onClick={handleAddSubject}>
            + Add Subject
          </button>
        </div>

        <button
          onClick={handleSignUp}
          disabled={loading}
          className="w-full py-2 bg-cyan-500 text-black rounded font-bold"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-gray-300 text-center">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-cyan-400 ml-1"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
