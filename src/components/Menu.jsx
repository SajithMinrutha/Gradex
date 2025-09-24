import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import AdjustIcon from "@mui/icons-material/Adjust";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
function Menu() {
  {
    /* optimizatin required*/
  }
  return (
    <div className="flex flex-col w-20 sm:w-48 md:w-56 shadow-md min-h-screen">
      <a
        href=""
        className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 py-4 px-2"
      >
        <div>
          <AdjustIcon className="text-white" fontSize="large" />
        </div>
        <span className="hidden sm:inline text-3xl font-bold">GRADEXA</span>
      </a>

      <nav className="flex flex-col space-y-2 mt-4">
        <a
          href=""
          className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
        >
          <div className="p-1 rounded-md bg-blue-500">
            <HomeIcon className="text-white" fontSize="small" />
          </div>
          <span className="hidden sm:inline text-base">Dashboard</span>
        </a>

        <a
          href=""
          className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
        >
          <div className="p-1 rounded-md bg-blue-500">
            <BarChartIcon className="text-white" fontSize="small" />
          </div>
          <span className="hidden sm:inline text-base">Maths</span>
        </a>

        <a
          href=""
          className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
        >
          <div className="p-1 rounded-md bg-blue-500">
            <BarChartIcon className="text-white" fontSize="small" />
          </div>
          <span className="hidden sm:inline text-base">Physics</span>
        </a>

        <a
          href=""
          className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
        >
          <div className="p-1 rounded-md bg-blue-500">
            <BarChartIcon className="text-white" fontSize="small" />
          </div>
          <span className="hidden sm:inline text-base">Chemistry</span>
        </a>

        <a
          href=""
          className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-3 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
        >
          <div className="p-1 rounded-md bg-blue-500">
            <TaskAltIcon className="text-white" fontSize="medium" />
          </div>
          <span className="hidden sm:inline text-base">ToDo</span>
        </a>
      </nav>
    </div>
  );
}

export default Menu;
