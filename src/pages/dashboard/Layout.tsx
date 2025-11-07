import { Outlet } from "react-router";

const DashboardLayout = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <Outlet />
    </div>
  );
};

export default DashboardLayout;
