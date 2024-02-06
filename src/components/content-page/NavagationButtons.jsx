import { NavLink, useNavigate, Link } from "react-router-dom";

import {
  FaTwitter,
  FaHome,
  FaSearch,
  FaEarlybirds,
  FaUser,
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useState } from "react";
import axios from "axios";
import axiosInstance from "../../helper/axios.instance";

function NavigationButtons() {
  async function logout() {
    try {
      localStorage.clear();
      await axiosInstance.post(
        "/user/logout",
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      return;
    }
  }

  return (
    <div className=" overflow-hidden mt-2 h-[70%]  w-3/12 flex flex-col items-center justify-between  ">
      <FaEarlybirds color="white" size={50} className="mb-10" />
      <Buttons
        navigate="/"
        name="Home"
        Icon={FaHome}
        color={"white"}
        isEnd="true"
        isReplace={true}
      />
      <Buttons
        navigate="trending"
        name="Trending"
        Icon={FaTwitter}
        color={"white"}
      />
      <Buttons
        navigate="search"
        name="Search"
        Icon={FaSearch}
        color={"white"}
      />
      <Buttons
        navigate="userProfile"
        name="profile"
        Icon={FaUser}
        color={"white"}
      />
      <Link
        to="/signin"
        replace={true}
        onClick={() => {
          logout();
        }}
        className="flex justify-evenly text-slate-100 font-semibold items-center   text-2xl rounded-2xl text-center p-2 w-3/5  hover:bg-gray-600 hover:text-white transition   hover:scale-110 ease-in-out"
      >
        <span>
          <BiLogOut />
        </span>
        Logout{" "}
      </Link>
      {/* <Buttons name="Top Tweets" Icon={} color={"white"}/> */}
    </div>
  );
}
//fixed top-0 bottom-0 left-0
const Buttons = ({ name, Icon, color, navigate, isEnd, isReplace }) => {
  // const [clicked, setclicked] = useState(false);
  // const navigator = useNavigate();
  return (
    <NavLink
      end={isEnd}
      replace={isReplace}
      className={({ isActive }) => {
        return isActive
          ? " flex justify-evenly  text-white bg-[#1F75FE] font-bold  items-center   text-2xl rounded-2xl text-center p-2 w-3/5 "
          : " flex justify-evenly text-slate-100 font-semibold items-center   text-2xl rounded-2xl text-center p-2 w-3/5  hover:bg-gray-600 hover:text-white transition   hover:scale-110 ease-in-out";
      }}
      to={navigate}
    >
      <Icon color={color} />
      {name}
    </NavLink>
  );
};
export default NavigationButtons;
