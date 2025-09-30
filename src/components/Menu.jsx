import { NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdjustIcon from "@mui/icons-material/Adjust";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AddBoxIcon from "@mui/icons-material/AddBox";

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
    <div className="flex flex-col w-20 sm:w-48 md:w-56 shadow-md min-h-screen bg-gray-800 text-white">
      <div className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 py-4 px-2">
        <AdjustIcon fontSize="large" />
        <span className="hidden sm:inline text-3xl font-bold">GRADEXA</span>
      </div>

      <nav className="flex flex-col space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                isActive ? "bg-blue-500/40" : "hover:bg-blue-500/20"
              }`
            }
          >
            <div className="p-1 rounded-md bg-blue-500">{item.icon}</div>
            <span className="hidden sm:inline text-base">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
