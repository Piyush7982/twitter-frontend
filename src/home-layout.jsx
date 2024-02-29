import { Outlet, useLocation, Navigate } from "react-router-dom";
import NavigationButtons from "./components/content-page/NavagationButtons";
import Profile from "./components/content-page/Profile";
import { cookiePresentState, userAuthState } from "./states/atoms";

function HomeLayout() {
  const location = useLocation();
  const { cookie } = cookiePresentState();
  const { auth, setauth } = userAuthState();

  return (
    <div className=" overflow-hidden  bg-[#121212] h-screen w-screen flex justify-between ">
      {localStorage.getItem("status") == "true" ? (
        <>
          <NavigationButtons />
          <Outlet />
          <Profile />
        </>
      ) : (
        <Navigate to="/signin" state={{ from: location }} replace />
      )}
    </div>
  );
}

export default HomeLayout;
