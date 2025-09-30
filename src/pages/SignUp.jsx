// src/pages/SignUp.jsx
import { useState } from "react";
import { supabase } from "../supabaseClient.js";
import { useNavigate } from "react-router-dom";

const allSubjects = [
  { group: "Maths/Biology", options: ["Maths", "Biology"] },
  { group: "Physics", options: ["Physics"] },
  { group: "Chemistry/ICT", options: ["Chemistry", "ICT"] },
];

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  const handleSubjectChange = (e) => {
    const { value, checked } = e.target;
    if (checked) setSelectedSubjects([...selectedSubjects, value]);
    else setSelectedSubjects(selectedSubjects.filter((s) => s !== value));
  };

  const handleSignUp = async () => {
    if (selectedSubjects.length === 0) {
      alert("Please select at least one subject.");
      return;
    }

    const { data: userData, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      alert(error.message);
      return;
    }

    // Insert subjects into user_subjects table
    await supabase.from("user_subjects").insert(
      selectedSubjects.map((subject) => ({
        user_id: userData.user.id,
        subject,
      }))
    );

    alert("Sign up successful! Please check your email.");
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h2 className="text-3xl font-bold mb-6 text-white">Sign Up</h2>

      <div className="flex flex-col w-80 space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="text-white">
          <p className="mb-1 font-semibold">Select your subjects:</p>
          {allSubjects.map((group) =>
            group.options.map((sub) => (
              <label key={sub} className="flex items-center space-x-2 mb-1">
                <input
                  type="checkbox"
                  value={sub}
                  checked={selectedSubjects.includes(sub)}
                  onChange={handleSubjectChange}
                  className="accent-blue-500"
                />
                <span>{sub}</span>
              </label>
            ))
          )}
        </div>

        <button
          onClick={handleSignUp}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded font-semibold"
        >
          Sign Up
        </button>
      </div>

      <p className="mt-4 text-gray-300">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-blue-400 hover:underline cursor-pointer"
        >
          Login
        </span>
      </p>
    </div>
  );
}
