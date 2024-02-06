import { Outlet } from "react-router-dom";
// import Header from "./header/header.js";
import { ToastContainer } from "react-toastify";
//make header and user recoil

function Layout() {
  return (
    <div>
      <ToastContainer />

      {/* <Header /> */}
      <Outlet />
    </div>
  );
}

export default Layout;
