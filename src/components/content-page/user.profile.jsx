import { useState, useEffect } from "react";
import { GrImage } from "react-icons/gr";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineRetweet } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import { FeedTweet, Loader } from "./Content";
import { FaPencil } from "react-icons/fa6";
import axiosInstance from "../../helper/axios.instance";
function UserProfile() {
  const param = useParams();
  const navigate = useNavigate();
  const [userInfo, setuserInfo] = useState({});
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axiosInstance.get(`/user/${param?.username}`, {
          headers: { "Content-Type": "application/json" },
        });

        setuserInfo(data?.data?.Data);
        // console.log(userInfo);
        if (data?.data?.Data === null) {
          throw error;
        }
      } catch (error) {
        // navigate(" ", { replace: true });
        navigate("../", { replace: true });
      }
    };
    fetchUser();
  }, []);
  return (
    //bg-inherit border-slate-400 h-screen border-[0.1px] w-6/12 items-center   flex flex-col
    // <div className="h-screen bg-white w-7/12 items-center   flex flex-col">
    <>
      {userInfo?.userName ? (
        <FeedTweet link={`tweet/user/${userInfo._id}`}>
          <ProfileBlock user={userInfo} />
        </FeedTweet>
      ) : (
        <Loader />
      )}
    </>
    // </div>
  );
}

function ProfileBlock({ user }) {
  const [follow, setfollow] = useState(false);

  return (
    // <div className=" hidden">
    <div className=" min-h-[62%]  w-11/12 mx-auto  pt-3 flex flex-col justify-around  border-slate-500 border-b-[0.1px] border-t-[0.1px] ">
      <img
        src={user?.coverPhoto}
        className="bg-white mt-2 mb-2  w-full h-52 rounded-lg"
      ></img>
      <div className="flex items-center my-1 justify-between text-2xl font-bold text-white tracking-tight">
        @{user?.userName}{" "}
        <span className="mx-3">
          <button className="text-green-500 bg-green-900 py-1  px-2 text-lg font-semibold rounded-3xl">
            following
          </button>
          {/* <button className="bg-blue-500 py-1 px-2 text-lg font-semibold rounded-3xl">
            follow
          </button> */}
        </span>
      </div>
      <div className=" w-11/12 pl-2  mx-auto  font-semibold my-2 text-sm min-h-[40%] text-slate-300">
        {" "}
        {user?.bio ? (
          user?.bio
        ) : (
          <div className="  font-bold text-md ">
            {" "}
            User has not added any bio yet !!!
          </div>
        )}
      </div>
      <div className="flex justify-around items-center my-2 pb-1">
        <div className="font-semibold text-lg tracking-tight text-slate-400 ">
          Following :{" "}
          <span className="font-bold text-white ml-2">
            {user?.following?.length}
          </span>
        </div>
        <div className="font-semibold text-lg tracking-tight text-slate-400 ">
          Followers :
          <span className="font-bold text-white ml-2">
            {user?.followers?.length}
          </span>
        </div>
      </div>
    </div>
  );
}
export default UserProfile;
