import { useNavigate } from "react-router-dom";
import background from "../../assets/notfound.png";
import { useEffect } from "react";

function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate(-1, { replace: true });
    }, 3000);
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 h-screen w-screen flex flex-col items-center justify-center  text-white font-bold text-2xl tracking-tight">
      <img className=" h-1/3" src={background} alt="img" />
      <p>404 Not Found</p>
      <p> Redirecting To Home..... </p>
      <span className="text-lg font-medium mt-10 ">
        If Not Redirected in 3 Seconds Try Manually
        <button
          className="text-blue-500 ml-3"
          onClick={() => {
            navigate(-1, { replace: true });
          }}
        >
          {" "}
          Click Me
        </button>
      </span>
    </div>
  );
}

export default NotFound;
