import { FaAddressCard } from "react-icons/fa";
import axios from "axios";

import { RiUserFollowFill } from "react-icons/ri";
import { IoMdPersonAdd } from "react-icons/io";
import { useEffect, useState } from "react";

import { userBioState, userInfo } from "../../states/atoms";
import { Link } from "react-router-dom";
import axiosInstance from "../../helper/axios.instance";

function Profile() {
  return (
    <div className=" overflow-hidden text-white    h-screen w-3/12 flex flex-col justify-around items-center">
      <UserProfile />
      {/* <div className=" h-1/6  w-4/5  flex flex-col justify-around items-center  ">
        <div className="text-lg tracking-wide font-medium flex flex-col justify-center items-center py-2rounded-lg w-full mb-1  h-4/6">
          <h1>Total Tweets</h1>
          <h1>Total Tweets</h1>
        </div>
        <button className=" mt-1  p-2 border hover:border-0 text-white rounded-md hover:text-black font-semibold  hover:bg-slate-100 text-xl w-3/6 hover:scale-110 transition delay-75 ease-in-out ">
          visit Profile
        </button>
  
      </div> */}
      <Suggestions />
    </div>
  );
}
function UserProfile() {
  const { userlog, setuserlog } = userInfo();
  const { bio, setbio } = userBioState();
  const [user, setuser] = useState({});

  // const [userInfo, setuserInfo] = useRecoilState(loggedUser);

  useEffect(() => {
    async function fetchUser() {
      if (localStorage.getItem("user")) {
        setuserlog(localStorage.getItem("user"));
        const data = await axiosInstance.get(
          `/user/${localStorage.getItem("user")}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setbio(data?.data?.Data?.bio);
        setuser(data?.data?.Data);
      }
    }
    fetchUser();
  }, [userlog]);
  return (
    <div className=" flex flex-col gap-y-1 justify-between  items-center py-1  h-1/4 w-4/5 rounded-xl">
      <div className="flex hover:bg-gray-800 hover:scale-105   bg-gray-700 rounded-2xl  gap-2 items-center  h-3/5 w-11/12 px-2 transition-all delay-100 ">
        <img
          src={user?.coverPhoto}
          alt="no img"
          className="bg-white  w-[70px] h-[70px] rounded-full "
        ></img>
        <Link
          to={"/userProfile"}
          // onClick={(e) => {
          //   e.target.addEventListener("click", (e) => {
          //     e.target.classList.remove("text-ellipsis");
          //     e.target.classList.add("overflow-auto");
          //   });
          //   className = "bg-white";
          // }}
          className="text-lg  font-bold flex flex-col justify-center items-center  overflow-auto h-20 w-32"
        >
          {user?.userName}
        </Link>
      </div>

      <div className=" bg-slate-700 text-slate-200    rounded-lg  p-2 h-3/5 w-11/12 overflow-auto text-sm items-center">
        {user?.bio?.length > 0 && (
          <FaAddressCard size={25} className="text-slate-400" />
        )}
        {bio.length > 0 ? (
          <div className="w-11/12 items-center pt-1  capitalize  mx-auto">
            {" "}
            {bio}
          </div>
        ) : (
          <div className="text-center ">No Bio present , go to profile</div>
        )}
      </div>
    </div>
  );
}
function Suggestions() {
  const [users, setusers] = useState([
    { id: 1, name: "jcnzjnd" },
    { id: 2, name: "jcnzj" },
    { id: 3, name: "jcnzjn" },
    { id: 4, name: "jcnz" },
    { id: 5, name: "jcnzjkjk" },
    { id: 6, name: "jcnzjndhg" },
  ]);
  function handleFollow(id) {
    setusers((prev) => {
      return prev.filter((user) => user.id !== id);
    });
  }

  return (
    <div className="overflow-y-scroll   bg-gray-800 h-2/6 w-4/5 rounded-xl  items-center mt-10 mb-1 relative">
      {users?.length === 0 && (
        <div className="text-white text-xl font-semibold  justify-center items-center  ">
          No Suggestions
        </div>
      )}
      {/* fixed top-0 left-0 right-0 */}

      {users?.length > 0 && (
        <div>
          <div className=" rounded-lg opacity-95 h-2/12 font-bold tracking-tight text-2xl bg-slate-800   sticky top-0 right-0 pl-4  ">
            Suggestions
          </div>
          {users.map((user) => {
            return (
              <SuggestionCard
                key={user.id}
                id={user.id}
                username={user.name}
                handleFollow={handleFollow}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function SuggestionCard({ id, username, handleFollow }) {
  const [followed, setfollowed] = useState(false);
  return (
    <div className="bg-inherit border-slate-700   text-white h-20 w-50 flex items-center justify-evenly  m-1 rounded-2xl  ">
      <div className="bg-white   w-[70px] h-[70px] rounded-full hover:scale-105 transition delay-75 "></div>
      <div className=" font-medium flex flex-col justify-around items-center  overflow-clip h-20 w-32">
        {username}
        {/* <button className="bg-blue-400 p-1 rounded-md">Follow</button> */}
      </div>
      <div
        onClick={() => {
          setfollowed(!followed);
          setTimeout(() => {
            if (!followed) {
              handleFollow(id);
            }
          }, 1000);
        }}
        className={
          followed
            ? ""
            : "hover:bg-blue-900  h-4/6 w-1/6 rounded-md px-1 flex flex-col justify-center items-center transition delay-100"
        }
      >
        {!followed && <IoMdPersonAdd size={20} color="#0096FF" />}
        {followed && <RiUserFollowFill size={20} color="#00FF7F" />}
      </div>
      {/* <FaTwitter />
      nameeeeeeeeeeeeeee
      <FaEarlybirds /> */}
    </div>
  );
}
//fixed top-0 right-0 bottom-0
export default Profile;
