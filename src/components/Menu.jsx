import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AdjustIcon from "@mui/icons-material/Adjust";

export default function Menu() {
  const menuItems = [
    { name: "Dashboard", icon: <HomeIcon />, path: "/" },
    { name: "Maths", icon: <BarChartIcon />, path: "/maths" },
    { name: "Physics", icon: <BarChartIcon />, path: "/physics" },
    { name: "Chemistry", icon: <BarChartIcon />, path: "/chemistry" },
    { name: "Add Marks", icon: <AddBoxIcon />, path: "/add-marks" },
    { name: "ToDo", icon: <TaskAltIcon />, path: "/todo" },
  ];

  return (
    <aside className="flex flex-col w-20 sm:w-48 md:w-56 min-h-screen p-4 gap-4 bg-transparent">
      <div className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-xl p-3 flex items-center gap-3">
        <AdjustIcon fontSize="large" sx={{ color: "#60f0ff" }} />
        <span className="hidden sm:inline text-2xl font-bold text-white">
          GRADEXA
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg transition ${
                isActive
                  ? "bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-200"
                  : "hover:bg-white/5 text-gray-200"
              }`
            }
          >
            <div className="text-cyan-400">{item.icon}</div>
            <span className="hidden sm:inline">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
