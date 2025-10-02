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
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 border-b border-white/10 bg-[#030416]/80 backdrop-blur-lg">
        <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-xl p-3 flex items-center gap-3 cursor-pointer">
          <AdjustIcon fontSize="large" sx={{ color: "#60f0ff" }} />
          <span className="hidden sm:inline text-2xl font-bold text-white">
            GRADEXA
          </span>
        </div>
        <nav className="hidden md:flex gap-6 text-gray-300">
          <a href="#features" className="hover:text-cyan-300 cursor-pointer">
            Features
          </a>
          <a href="#about" className="hover:text-cyan-300 cursor-pointer">
            About
          </a>
          <a href="#donate" className="hover:text-cyan-300 cursor-pointer">
            Donate
          </a>
          {/* <a href="#contact" className="hover:text-cyan-300 cursor-pointer">
            Contact
          </a> */}
        </nav>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 cursor-pointer"
        >
          Try Now
        </button>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="flex flex-col lg:flex-row items-center justify-between px-8 lg:px-20 py-30"
      >
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-bold leading-tight text-cyan-300 drop-shadow-lg flex items-center gap-4">
            <InsightsIcon sx={{ fontSize: 70, color: "#06b6d4" }} />
            Track. Learn. Improve.
          </h2>
          <p className="text-gray-300 text-lg">
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
        <div className="lg:w-1/2 mt-10 lg:mt-0">
          <div className="rounded-xl shadow-2xl border border-white/10 bg-white/5 h-[400px] flex items-center justify-center">
            <SchoolIcon sx={{ fontSize: 120, color: "#60f0ff" }} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-40 my-23 flex flex-col justify-center px-8 lg:px-20 bg-[#071029]/70 backdrop-blur-lg border-t border-white/10"
      >
        <h3 className="text-3xl font-bold text-center text-cyan-300 mb-12">
          Features
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center cursor-pointer">
            <ScoreboardIcon
              sx={{ fontSize: 52, color: "#0ff" }}
              className="mb-4"
            />
            <h4 className="text-xl font-semibold mb-2">Marks Tracking</h4>
            <p className="text-gray-400 text-sm text-center">
              Record MCQ & Essay scores, see averages, and monitor improvements
              with visual graphs.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center cursor-pointer">
            <CheckCircleIcon
              sx={{ fontSize: 52, color: "#0ff" }}
              className="mb-4"
            />
            <h4 className="text-xl font-semibold mb-2">To-Do Manager</h4>
            <p className="text-gray-400 text-sm text-center">
              Add tasks, prioritize with color codes, and stay on top of your
              learning schedule.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center cursor-pointer">
            <ScheduleIcon
              sx={{ fontSize: 52, color: "#0ff" }}
              className="mb-4"
            />
            <h4 className="text-xl font-semibold mb-2">Study Planner</h4>
            <p className="text-gray-400 text-sm text-center">
              Compare target vs actual study time for each subject using
              interactive charts.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition flex flex-col items-center cursor-pointer">
            <BuildIcon sx={{ fontSize: 52, color: "#0ff" }} className="mb-4" />
            <h4 className="text-xl font-semibold mb-2">Customization</h4>
            <p className="text-gray-400 text-sm text-center">
              Add/remove subjects, change themes, and personalize Gradexa to
              your study style.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="h-screen flex flex-col justify-center px-8 lg:px-20"
      >
        <h3 className="text-3xl font-bold text-center text-cyan-300 mb-12">
          About Gradexa
        </h3>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="rounded-xl shadow-lg bg-white/5 h-[350px] flex items-center justify-center">
              <AdjustIcon sx={{ fontSize: 100, color: "#60f0ff" }} />
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
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
        className="py-50 flex flex-col justify-center items-center px-8 lg:px-20 bg-[#071029]/70 backdrop-blur-lg border-t border-white/10 text-center"
      >
        <VolunteerActivismIcon sx={{ fontSize: 60, color: "#0ff" }} />
        <h3 className="text-3xl font-bold text-cyan-300 mt-4">
          Support Gradexa
        </h3>
        <p className="text-gray-300 max-w-2xl mx-auto mt-4 text-lg">
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
      <footer className="min-h-[30vh] flex flex-col justify-center items-center gap-2 px-6 py-8 bg-[#030416] border-t border-white/10 text-gray-400 text-center">
        <EmojiObjectsIcon sx={{ fontSize: 28, color: "#60f0ff" }} />
        <p className="text-sm">
          © {new Date().getFullYear()} Gradexa — Empowering Students Everywhere
        </p>
      </footer>
    </div>
  );
}
