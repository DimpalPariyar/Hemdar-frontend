import Navbar from "./navbar/Navbar";
import Fotter from "./fotter/Fotter";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] ">
      <Navbar />

      <main className="mt-20">
        <Outlet />
      </main>

      <Fotter />
    </div>
  );
}

export default AppLayout;
