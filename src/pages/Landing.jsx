// src/pages/Landing.jsx
import { useNavigate } from "react-router-dom";
import AdjustIcon from "@mui/icons-material/Adjust";
import ScoreboardIcon from "@mui/icons-material/Scoreboard";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BuildIcon from "@mui/icons-material/Build";
import SchoolIcon from "@mui/icons-material/School";
import InsightsIcon from "@mui/icons-material/Insights";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030416] via-[#071029] to-[#071022] text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-6 py-4 border-b border-white/10 bg-[#030416]/80 backdrop-blur-lg gap-4 md:gap-0">
        <div
          className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-xl p-3 flex items-center gap-3 cursor-pointer w-full md:w-auto justify-center md:justify-start"
          onClick={() => navigate("/")}
        >
          <AdjustIcon fontSize="large" sx={{ color: "#60f0ff" }} />
          <span className="hidden sm:inline text-2xl font-bold text-white">
            GRADEXA
          </span>
        </div>
        <nav className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-300">
          <a href="#features" className="hover:text-cyan-300 cursor-pointer">
            Features
          </a>
          <a href="#about" className="hover:text-cyan-300 cursor-pointer">
            About
          </a>
          <a href="#donate" className="hover:text-cyan-300 cursor-pointer">
            Donate
          </a>
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 cursor-pointer mt-2 md:mt-0"
        >
          Try Now
        </button>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col lg:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-24 gap-10 lg:gap-0"
      >
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-cyan-300 drop-shadow-lg flex flex-col md:flex-row items-center gap-4 md:gap-2 justify-center lg:justify-start">
            <InsightsIcon sx={{ fontSize: 60, color: "#06b6d4" }} />
            <span>Track. Learn. Improve.</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto lg:mx-0">
            Gradexa helps you manage your marks, tasks, and study plans in one
            powerful dashboard. Visualize progress and stay productive with an
            AI-inspired design.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 cursor-pointer"
          >
            Get Started Free →
          </button>
        </div>
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="rounded-xl shadow-2xl border border-white/10 bg-white/5 h-[300px] md:h-[400px] w-full max-w-sm flex items-center justify-center">
            <SchoolIcon sx={{ fontSize: 100, color: "#60f0ff" }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 md:py-40 px-6 md:px-20 bg-[#071029]/70 backdrop-blur-lg border-t border-white/10"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-center text-cyan-300 mb-12">
          Features
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              icon: <ScoreboardIcon sx={{ fontSize: 52, color: "#0ff" }} />,
              title: "Marks Tracking",
              desc: "Record MCQ & Essay scores, see averages, and monitor improvements with visual graphs.",
            },
            {
              icon: <CheckCircleIcon sx={{ fontSize: 52, color: "#0ff" }} />,
              title: "To-Do Manager",
              desc: "Add tasks, prioritize with color codes, and stay on top of your learning schedule.",
            },
            {
              icon: <ScheduleIcon sx={{ fontSize: 52, color: "#0ff" }} />,
              title: "Study Planner",
              desc: "Compare target vs actual study time for each subject using interactive charts.",
            },
            {
              icon: <BuildIcon sx={{ fontSize: 52, color: "#0ff" }} />,
              title: "Customization",
              desc: "Add/remove subjects, change themes, and personalize Gradexa to your study style.",
            },
          ].map((f, idx) => (
            <div
              key={idx}
              className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center text-center cursor-pointer"
            >
              <div className="mb-4">{f.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-24 md:py-32 px-6 md:px-20 flex flex-col lg:flex-row gap-10 items-center"
      >
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <div className="rounded-xl shadow-lg bg-white/5 h-[250px] md:h-[350px] w-full max-w-md flex items-center justify-center">
            <AdjustIcon sx={{ fontSize: 80, color: "#60f0ff" }} />
          </div>
        </div>
        <div className="lg:w-1/2 text-center lg:text-left">
          <h3 className="text-3xl font-bold text-cyan-300 mb-6">
            About Gradexa
          </h3>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Gradexa is built for students who want to stay on top of their
            academic performance. With integrated marks tracking, to-do lists,
            and study planners, it’s your one-stop productivity hub for
            learning. Our vision is to empower students to learn smarter, not
            harder.
          </p>
        </div>
      </section>

      {/* Donation Section */}
      <section
        id="donate"
        className="py-24 md:py-32 px-6 md:px-20 bg-[#071029]/70 backdrop-blur-lg border-t border-white/10 text-center"
      >
        <VolunteerActivismIcon sx={{ fontSize: 60, color: "#0ff" }} />
        <h3 className="text-3xl md:text-4xl font-bold text-cyan-300 mt-4">
          Support Gradexa
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-base md:text-lg">
          We’re building Gradexa for free to help students worldwide. But to
          keep this project alive, we need your support. If you find Gradexa
          useful, please consider donating to help us cover hosting and
          development costs.
        </p>
        <button
          onClick={() => window.open("https://www.paypal.com/donate", "_blank")}
          className="mt-6 px-6 py-3 bg-cyan-500 text-black rounded-lg font-bold hover:bg-cyan-400 cursor-pointer flex items-center gap-2 mx-auto"
        >
          <FavoriteIcon /> Donate Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-20 bg-[#030416] border-t border-white/10 text-gray-400 text-center flex flex-col items-center gap-2">
        <EmojiObjectsIcon sx={{ fontSize: 28, color: "#60f0ff" }} />
        <p className="text-sm">
          © {new Date().getFullYear()} Gradexa — Empowering Students Everywhere
        </p>
      </footer>
    </div>
  );
}
