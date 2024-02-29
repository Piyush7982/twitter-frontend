import { useState, useEffect } from "react";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

import { useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/defaultProfile.jpg";
import { toast } from "react-toastify";
import axiosInstance from "../../helper/axios.instance";

function Signup() {
  const navigate = useNavigate();
  const username_regex = "^[A-Za-z][A-Za-z0-9_]{5,15}$";
  const email_regex =
    /^(?=.*[a-zA-Z])[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z]+\.[a-zA-Z]+$/;

  const [validForm, setvalidForm] = useState(false);

  const [username, setUsername] = useState("");
  const [isValidUsername, setisValidUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  const [email, setEmail] = useState("");
  const [isValidEmail, setisValidEmail] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [isValidPassword, setisValidPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(defaultProfile);
  const [useDefaultImage, setUseDefaultImage] = useState(true);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
  }
  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  const handleImage = (e) => {
    if (!e.target.files[0]) return;

    if (e.target.files[0].size > 1000000) {
      toast.error("File size should be less than 1MB", {
        autoClose: 2000,
        theme: "colored",
      });

      return;
    }
    if (
      e.target.files[0].type !== "image/jpeg" &&
      e.target.files[0].type !== "image/png"
    ) {
      toast.error("Only jpeg and png files are allowed", {
        autoClose: 2000,
        theme: "colored",
      });

      return;
    }
    setImage(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0]));
    setUseDefaultImage((value) => (value === true ? !value : value));
  };

  function validateUsername() {
    if (username.length < 5 || !username.match(username_regex)) {
      setUsernameError("Username must be at least 5 characters long and valid");
      setisValidUsername(false);
    } else {
      setUsernameError("");
      setisValidUsername(true);
    }
  }
  function validateEmail() {
    if (email.length < 5 || !email.match(email_regex)) {
      setEmailError(
        "Email must be at least 5 characters long and should be valid"
      );
      setisValidEmail(false);
    } else {
      setEmailError("");
      setisValidEmail(true);
    }
  }
  function validatePassword() {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setisValidPassword(false);
    } else {
      setPasswordError("");
      setisValidPassword(true);
    }
  }

  useEffect(() => {
    validateUsername();
  }, [username]);
  useEffect(() => {
    validateEmail();
  }, [email]);
  useEffect(() => {
    validatePassword();
  }, [password]);

  useEffect(() => {
    if (isValidEmail && isValidUsername && isValidPassword) {
      setvalidForm(true);
    } else {
      setvalidForm(false);
    }
  }, [isValidEmail, isValidUsername, isValidPassword]);

  useEffect(() => {
    setEmailError("");
    setUsernameError("");
    setPasswordError("");
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();

    const signupPromise = new Promise((resolve, reject) => {
      formData.append("userName", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      axiosInstance
        .post("/user/signup", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          navigate("/signin", { replace: true });
          setEmail("");
          setPassword("");
          setUsername("");
          resolve("Signup successful 👌");
        })
        .catch((error) => {
          if (error.message.includes("Network Error")) {
            navigate("/oops", { state: { from: "/signup" }, replace: true });
          } else if (
            error.response.data.Error.error.includes("username already exists")
          ) {
            setUsernameError("Username already exists, Try another one");
            setisValidUsername(false);
          } else if (
            error.response.data.Error.error.includes("email already exists")
          ) {
            setEmailError("Email already exists, Try another one");
            setisValidEmail(false);
          }
          reject("Signup failed 🤯");
        });
    });

    toast.promise(signupPromise, {
      pending: "Signup is in progress...",
      success: "Signup successful 👌",
      error: "Signup failed 🤯",
    });
  }
  return (
    <div className=" bg-gradient-to-t from-gray-800 via-black to-blue-950 text-slate-50   h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col py-2  w-2/5 h-[85vh]  justify-around items-center bg-neutral-900 shadow-blue-500 shadow-md   rounded-lg ">
        {/* <div className="flex flex-col py-2  w-2/5 h-[70vh]  justify-around items-center bg-neutral-900 shadow-blue-300 shadow-2xl   rounded-lg "> */}
        <h1 className="font-bold text-3xl ">Create Account</h1>
        <form
          className="flex flex-col gap-2 h-[72%] justify-center   w-3/5 p-4  "
          onSubmit={handleSubmit}
        >
          <div className="flex  items-center justify-center mb-1  ">
            <img
              alt="coverPhoto"
              src={preview}
              onClick={() => {
                document.querySelector("input[type=file]").click();
              }}
              style={{ objectFit: "cover" }}
              className="bg-white hover:cursor-pointer hover:opacity-85 rounded-full w-24 h-24  ring-4 ring-blue-600"
            />
            <MdOutlineAddPhotoAlternate
              className=" mt-20 -ml-2 text-blue-200"
              size={20}
            />
            <input
              type="file"
              onChange={handleImage}
              className="hidden"
              name="file"
            />
            <button
              className="text-center ml-10  text-md font-medium hover:bg-red-500 hover:text-red-100 transition-all delay-75 p-1 rounded-md"
              hidden={useDefaultImage}
              type="button"
              // for="checkbox"
              onClick={() => {
                if (!useDefaultImage) {
                  setImage(null);
                  setPreview(defaultProfile);
                }
                setUseDefaultImage((value) => !value);
              }}
            >
              Remove
            </button>
            {/* <input
              type="checkbox"
              id="checkbox"
              className="text-center ml-2 bg-white"
              disabled={useDefaultImage}
              hidden={useDefaultImage}
              placeholder=" Use Default Image"
              checked={useDefaultImage}
              onClick={() => {
                setUseDefaultImage((value) => !value);
              }}
              onChange={() => {
                if (!useDefaultImage) {
                  setImage(null);
                  setPreview(defaultProfile);
                }
              }}
            /> */}
          </div>

          <p className={isValidUsername ? "hidden h-0 w-0" : "text-red-500"}>
            {usernameError}
          </p>
          {/* <label for="username" className="text-white font-bold">Username</label> */}

          <input
            type="text"
            required
            id="username"
            value={username}
            maxLength={15}
            placeholder="Enter Unique Username upto 15 Chars"
            onChange={handleUsernameChange}
            className="border-2 font-extrabold resize-none border-gray-300 rounded-md p-2 text-black"
          />

          <p className={isValidEmail ? "hidden h-0 w-0" : "text-red-500"}>
            {emailError}
          </p>
          {/* <label for="email">Email</label> */}
          <input
            type="text"
            required
            id="email"
            value={email}
            maxLength={30}
            placeholder="Enter Unique Email upto 30 Chars"
            onChange={handleEmailChange}
            className="border-2 font-extrabold resize-none border-gray-300 rounded-md p-2 text-black"
          />
          <p className={isValidPassword ? "hidden h-0 w-0" : "text-red-500"}>
            {passwordError}
          </p>
          {/* <label for="password">Password</label> */}
          <input
            type="password"
            required
            id="password"
            value={password}
            maxLength={20}
            placeholder="Enter Password upto 20 Chars"
            onChange={handlePasswordChange}
            className="border-2 font-extrabold resize-none border-gray-300 rounded-md p-2 text-black"
          />
          <button
            disabled={!validForm}
            type="submit"
            className={
              validForm
                ? "p-1  bg-blue-500 mt-1 text-xl text-white w-1/3 font-semibold rounded-md hover:cursor-pointer "
                : "bg-slate-500 mt-1  p-1 text-xl text-slate-300  w-1/3 rounded-md hover:cursor-not-allowed"
            }
          >
            Sign Up
          </button>
        </form>

        <span className="flex justify-between ">
          Already a user?
          <button
            onClick={() => {
              navigate("/signin", { replace: true });
              // window.history.back();
            }}
            className="px-2 text-blue-500"
          >
            Sign In
          </button>
        </span>
      </div>
    </div>
  );
}

export default Signup;
