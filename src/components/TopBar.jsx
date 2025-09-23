function TopBar() {
  return (
    <div className="flex flex-row justify-between rounded-2xl  items-center px-6 py-3 border-1 ">
      <h1 className="font-bold">Dashboard</h1>

      <div className="flex space-x-6">
        <h1>Sign In</h1>
        <h1>Settings</h1>
      </div>
    </div>
  );
}

export default TopBar;
