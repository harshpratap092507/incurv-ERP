import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export function AppLayout() {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar />
        <Outlet />
      </div>
    </div>
  );
}
