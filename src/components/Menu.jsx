// src/components/Menu.jsx
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// Icons
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AddBoxIcon from "@mui/icons-material/AddBox";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import AdjustIcon from "@mui/icons-material/Adjust";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SettingsIcon from "@mui/icons-material/Settings";

function MenuItem({ item }) {
  return (
    <NavLink
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
  );
}

export default function Menu() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const fetchSubjects = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      if (!user) {
        if (mounted) {
          setSubjects([]);
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .eq("user_id", user.id)
        .order("id", { ascending: true });

      if (mounted) {
        setSubjects(error ? [] : data || []);
        setLoading(false);
      }
    };

    fetchSubjects();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchSubjects();
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const staticItems = [
    { name: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    { name: "Add Marks", icon: <AddBoxIcon />, path: "/add-marks" },
    { name: "ToDo", icon: <TaskAltIcon />, path: "/todo" },
    { name: "Study Planner", icon: <ScheduleIcon />, path: "/plan-studying" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  return (
    <aside className="flex flex-col w-20 sm:w-48 md:w-56 min-h-screen p-4 gap-4 bg-transparent">
      {/* Logo */}
      <div
        className="bg-[#071029]/70 backdrop-blur-lg border border-white/6 rounded-xl p-3 flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <AdjustIcon fontSize="large" sx={{ color: "#60f0ff" }} />
        <span className="hidden sm:inline text-2xl font-bold text-white">
          GRADEXA
        </span>
      </div>

      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <MenuItem item={staticItems[0]} />

        {/* Dynamic Subjects */}
        {!loading &&
          subjects.map((s) => (
            <MenuItem
              key={s.id}
              item={{
                name: s.name,
                icon: <BarChartIcon />,
                path: `/${s.name.toLowerCase()}`,
              }}
            />
          ))}

        {/* Remaining static items */}
        {staticItems.slice(1).map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </nav>
    </aside>
  );
}
