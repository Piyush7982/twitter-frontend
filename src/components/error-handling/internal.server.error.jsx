import background from "../../assets/server-error.png";
import { useNavigate, useLocation } from "react-router-dom";
function ServerError() {
  const navigate = useNavigate();
  const location = useLocation();
  const to = location.state?.from ? location.state.from : -1;
  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-screen w-screen flex flex-col items-center justify-center space-y-5 text-white font-bold text-2xl tracking-tight">
      <p>OOPSIE!! Looks Like An Internal Server Error Happened.</p>
      <p>Don't Worry We Will Fix It Soon....</p>
      <button
        onClick={() => {
          navigate(to, { replace: true });
        }}
        className="text-blue-500 font-normal text-xl hover:underline"
      >
        Go Back
      </button>
      <img className="size-16 absolute bottom-9 " src={background} alt="img" />
    </div>
  );
}

export default ServerError;
