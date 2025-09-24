function TopBar() {
  return (
    <div className="flex flex-row justify-between items-center py-4 px-2 ">
      <h1 className="font-bold">Dashboard</h1>

      <div className="flex space-x-6 ">
        <h1 className="font-bold">Sign In</h1>
        <h1 className="font-bold">Settings</h1>
      </div>
    </div>
  );
}

export default TopBar;
