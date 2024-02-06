import { Outlet, useLocation, Navigate } from "react-router-dom";
import NavigationButtons from "./components/content-page/NavagationButtons";
import Profile from "./components/content-page/Profile";
import { cookiePresentState, userAuthState } from "./states/atoms";

function HomeLayout() {
  const location = useLocation();
  const { cookie } = cookiePresentState();
  const { auth, setauth } = userAuthState();

  // setauth(localStorage.getItem("status"));
  // useEffect(() => {
  //   const status = async () => {
  //     try {
  //       const res = await axios.get(
  //         "http://localhost:4000/api/v1/user/checkAuth",
  //         {
  //           withCredentials: true,
  //           headers: { "Content-Type": "application/json" },
  //         }
  //       );
  //       console.log(res?.data?.Data?.isAuthenticated);
  //       setauth(res?.data?.Data?.isAuthenticated);
  //     } catch (error) {
  //       setauth(false);
  //       console.log(error);
  //       return;
  //     }
  //   };
  //   status();
  // }, []);

  //<Navigate to="/login" state={{ from: location }} replace />
  return (
    //bg-gradient-to-r from-slate-900  via-black to-slate-900
    //bg-[#121212]
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
