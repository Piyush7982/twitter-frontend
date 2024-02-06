import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import background2 from "../../assets/background2.png";
import {
  userInfo,
  cookiePresentState,
  userAuthState,
} from "../../states/atoms";
import axiosInstance from "../../helper/axios.instance";

function Signin() {
  const navigate = useNavigate();
  const location = useLocation();
  const to = location.state?.from ? location.state.from : "/";
  // const to = location.state?.from ? location.state.from : "/home";
  // const [userInfo, setuserInfo] = useRecoilState(loggedUser);
  // const { userlog, setuserlog } = userInfo();
  // console.log(userlog);
  const { setcookie } = cookiePresentState();

  const [validForm, setvalidForm] = useState(false);
  const [error, seterror] = useState(false);
  const [errorMessage, seterrorMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  useEffect(() => {
    if (username.length > 0 && password.length > 0) {
      setvalidForm(true);
    } else {
      setvalidForm(false);
    }
  }, [username, password]);

  async function handleSubmit(event) {
    event.preventDefault();

    let user = {
      userName: username,
      password: password,
    };
    user = JSON.stringify(user);
    try {
      const data = await axiosInstance.post("/user/login", user, {
        headers: { "Content-Type": "application/json" },
      });

      setPassword("");
      setUsername("");
      seterror(false);
      seterrorMessage("");
      setvalidForm(true);

      localStorage.setItem("user", data?.data?.Data?.username);
      localStorage.setItem("id", data?.data?.Data?.id);
      localStorage.setItem("status", true);
      // setcookie(document.cookie.split("=")[0] == "access_token" ? true : false);

      navigate(to, { replace: true });
    } catch (error) {
      seterror(true);
      if (error.message.includes("Network Error")) {
        navigate("/oops", { state: { from: "/signin" }, replace: true });
      } else if (
        error.response.data.Error.error.includes("username doesnot exists")
      ) {
        seterrorMessage("Not a valid username");
        setvalidForm(false);
      } else if (
        error.response.data.Error.error.includes("Incorrect Password")
      ) {
        seterrorMessage("Wrong credentials");
        setvalidForm(false);
      }
      return;
    }
  }
  return (
    // <div className="bg-black text-slate-50   h-screen w-screen flex justify-center items-center">
    <div className="bg-gradient-to-t from-gray-800 via-black to-blue-950 text-slate-50   h-screen w-screen flex justify-center items-center">
      <img
        src={background2}
        alt="background"
        className="hidden h-2/4 -rotate-6   fixed bottom-0 left-0 opacity-60 "
      />
      <div className="flex flex-col py-2  w-2/5 h-[70vh]  justify-around items-center bg-neutral-900 shadow-blue-500 shadow-md   rounded-lg ">
        <h1 className="font-bold text-3xl ">Login</h1>
        <p className={!error ? "hidden" : "text-red-500"}>{errorMessage}</p>
        <form
          className="flex flex-col  w-3/5 p-4  space-y-2 "
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            required
            id="username"
            value={username}
            placeholder="Enter Unique Username"
            onChange={handleUsernameChange}
            className="border-2 font-extrabold border-gray-300 rounded-md p-2 text-black"
          />

          <input
            type="password"
            required
            id="password"
            value={password}
            placeholder="Enter Password"
            onChange={handlePasswordChange}
            className="border-2 font-extrabold border-gray-300 rounded-md p-2 text-black"
          />
          <button
            disabled={!validForm}
            type="submit"
            className={
              validForm
                ? "p-1 bg-blue-500 text-xl text-white w-1/3 font-semibold rounded-md hover:cursor-pointer "
                : "bg-slate-500 p-1 text-xl text-slate-300  w-1/3 rounded-md hover:cursor-not-allowed"
            }
          >
            Sign In
          </button>
        </form>

        <span className="flex justify-between ">
          Don't have any account?
          <button
            onClick={() => {
              //   window.history.back();
              navigate("/signup", { replace: true });
            }}
            className="px-2 text-blue-500"
          >
            Sign Up Now
          </button>
        </span>
      </div>
    </div>
  );
}

export default Signin;
