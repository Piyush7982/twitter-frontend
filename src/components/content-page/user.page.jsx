import { useState, useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FaThumbsUp } from "react-icons/fa";
import { AiOutlineRetweet } from "react-icons/ai";
import { IoMdRemoveCircle } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader } from "./Content";
import axios from "axios";
import { FaPencil } from "react-icons/fa6";
import { userBioState } from "../../states/atoms";
import axiosInstance from "../../helper/axios.instance";

function UserPage() {
  const navigate = useNavigate();
  const [user, setuser] = useState({});
  const username = localStorage.getItem("user");
  const [isPencilClicked, setisPencilClicked] = useState(false);
  const { bio, setbio } = userBioState();
  const [changeBio, setchangeBio] = useState("");
  // const [bio, setbio] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axiosInstance.get(`/user/${username}`, {
          headers: { "Content-Type": "application/json" },
        });

        setuser(data?.data?.Data);

        if (data?.data?.Data === null) {
          throw error;
        }
      } catch (error) {
        return;
        // navigate(" ", { replace: true });
        // navigate("../", { replace: true });
      }
    };
    fetchUser();
  }, []);
  async function handleBioChange() {
    try {
      const res = await axiosInstance.patch(
        `/user/updateBio`,
        { bio: changeBio },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setbio(changeBio);
      // console.log(res);
    } catch (err) {
      return;
    }
  }
  return (
    // <div className=" hidden">
    <div className=" min-h-[62%]  w-11/12 mx-auto  pt-3 flex flex-col justify-around  border-slate-500 border-b-[0.1px] border-t-[0.1px] ">
      {user ? (
        <>
          <img
            src={user?.coverPhoto}
            className="bg-white mt-2 mb-2  w-full h-52 rounded-lg"
          ></img>
          <div className="flex items-center my-1 justify-between text-2xl font-bold text-white tracking-tight">
            @{user?.userName}{" "}
            <span className="mx-3">
              {" "}
              <FaPencil
                size={20}
                onClick={() => setisPencilClicked((prev) => !prev)}
                className="text-slate-300 hover:text-white hover:cursor-pointer "
              />{" "}
              {/* <button className="text-green-500 bg-green-900 py-1  px-2 text-lg font-semibold rounded-3xl">
                following
              </button> */}
              {/* <button className="bg-blue-500 py-1 px-2 text-lg font-semibold rounded-3xl">
                follow
              </button> */}
            </span>
          </div>
          {!isPencilClicked && (
            <div className=" w-11/12 pl-2 capitalize  mx-auto  font-semibold my-2 text-sm min-h-[40%] text-slate-300">
              {" "}
              {bio?.length > 0
                ? bio
                : "Click on the pencil icon to update your bio"}
            </div>
          )}
          {isPencilClicked && (
            <div className=" w-11/12 pl-2  mx-auto  font-semibold my-2 text-sm min-h-[40%] text-slate-300">
              <textarea
                spellCheck={false}
                maxLength={300}
                className="w-full resize-none  px-3 h-14 pt-1 bg-gray-800 text-white rounded-lg"
                placeholder="Update Bio upto 300 characters"
                value={changeBio}
                onChange={(e) => setchangeBio(e.target.value)}
              ></textarea>
              <div className="flex justify-end">
                <button
                  disabled={changeBio.length === 0}
                  className="bg-green-500 text-white px-2  rounded-lg"
                  onClick={() => {
                    handleBioChange();
                    setisPencilClicked(false);
                  }}
                >
                  Save
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-lg ml-2"
                  onClick={() => setisPencilClicked(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
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
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}

function UserFeed() {
  const [tweets, settweets] = useState([]);
  const [page, setpage] = useState(1);
  const [hasMore, sethasMore] = useState(true);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  // const param = useParams();
  const userId = localStorage.getItem("id");
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setloading(true);

        const data = await axiosInstance.get(
          `/tweet/user/${userId}?page=${page}&limit=5`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setTimeout(() => {
          settweets((prev) => [...prev, ...data?.data?.Data]);
          setloading(false);
        }, 1500);

        if (data?.data?.Data?.length === 0) {
          setloading(false);
          sethasMore(false);
        }
        if (data?.data?.Data === null) {
          throw error;
        }
      } catch (error) {
        seterror(true);
        sethasMore(false);
        setloading(false);
      }
    };
    fetchTweets();
  }, [page]);
  return (
    <div className=" w-7/12  border-[0.5px]  border-slate-500  h-full   text-white flex flex-col">
      {/* {tweets?.length > 0 ? ( */}
      <InfiniteScroll
        dataLength={tweets?.length}
        next={() => setpage((prev) => prev + 1)}
        hasMore={hasMore}
        loader={<Loader />}
        scrollThreshold={0.9}
        height={750}
        endMessage={
          <p className="text-center text-slate-300">No More Tweets</p>
        }
      >
        {/* <ProfileBlock user={}/> */}
        <UserPage />

        {loading && <Loader />}

        {tweets?.map((tweet) => {
          return <TweetCardUser key={tweet._id} tweet={tweet} />;
        })}
      </InfiniteScroll>
      {/* ) : (
         <div className="text-center text-slate-300">No Tweets</div>
       )} */}
    </div>
  );
}

// function ProfileBlock({ user }) {
//     const [follow, setfollow] = useState(false);
//     // console.log(user);
//     return (
//       // <div className=" hidden">
//       <div className=" min-h-[62%]  w-11/12 mx-auto  pt-3 flex flex-col justify-around  border-slate-500 border-b-[0.1px] border-t-[0.1px] ">
//         <img
//           src={user?.coverPhoto}
//           className="bg-white mt-2 mb-2  w-full h-52 rounded-lg"
//         ></img>
//         <div className="flex items-center my-1 justify-between text-2xl font-bold text-white tracking-tight">
//           @{user?.userName}{" "}
//           <span className="mx-3">
//             {" "}
//             {/* <button className="text-green-500 bg-green-900 py-1  px-2 text-lg font-semibold rounded-3xl">
//               following
//             </button> */}
//             {/* <button className="bg-blue-500 py-1 px-2 text-lg font-semibold rounded-3xl">
//               follow
//             </button> */}
//           </span>
//         </div>
//         <div className=" w-11/12 pl-2  mx-auto  font-semibold my-2 text-sm min-h-[40%] text-slate-300">
//           {" "}
//           Lorem lorem-50 lorem-50 lorem-100 lorem-100 ipsum dolor sit, amet
//           consectetur adipisicing elit. Eveniet, Lorem ipsum dolor sit amet
//           consectetur adipisicing elit. Corrupti eveniet officia sint sunt nihil
//           saepe quia molestias, animi eligendi explicabo nesciunt, eos laudantium
//           corporis sequi nam quasi ad, voluptas itaque! architecto molestias
//           possimus quia iure a culpa recusandae natus doloremque aperiam quo
//           impedit corporis vel beatae error doloribus odio earum eaque! Lorem,
//           ipsum dolor sit amet consectetur
//         </div>
//         <div className="flex justify-around items-center my-2 pb-1">
//           <div className="font-semibold text-lg tracking-tight text-slate-400 ">
//             Following :{" "}
//             <span className="font-bold text-white ml-2">
//               {user?.following?.length}
//             </span>
//           </div>
//           <div className="font-semibold text-lg tracking-tight text-slate-400 ">
//             Followers :
//             <span className="font-bold text-white ml-2">
//               {user?.followers?.length}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }
export function TweetCardUser({ tweet }) {
  const [likeClicked, setlikeClicked] = useState(false);
  const [buttonConfig, setbuttonConfig] = useState({
    color: "white",
    size: 20,
  });
  const [likeCount, setlikeCount] = useState(0);
  const [retweetCount, setretweetCount] = useState(0);
  const renderContent = () => {
    const contentArray = tweet?.content?.split(" ");
    return contentArray?.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span key={index} className="text-blue-600 mx-1 font-bold">
            {`${word} `}
          </span>
        );
      } else {
        return word + " ";
      }
    });
  };
  function modifyDate(current) {
    const date = new Date() - new Date(current);
    const days = Math.floor(date / (1000 * 60 * 60 * 24));
    const hours = Math.floor(date / (1000 * 60 * 60));
    const minutes = Math.floor(date / (1000 * 60));
    const seconds = Math.floor(date / 1000);
    const month = new Date(current)?.toLocaleString("default", {
      month: "short",
      day: "numeric",
    });

    return days > 1
      ? `${month}`
      : days === 1
      ? "Yesterday"
      : hours >= 1
      ? `${hours}h`
      : minutes >= 1
      ? `${minutes}m`
      : `${seconds}s`;
  }
  const likeTweetHandler = async (id) => {
    try {
      const res = await axiosInstance.put(
        `/tweet/like/${id}`,
        {},
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      return;
    }
  };
  useEffect(() => {
    if (tweet?.likes?.users?.includes(localStorage.getItem("id"))) {
      setbuttonConfig({
        color: "pink",
        size: 24,
      });
      setlikeClicked(true);
    }
    tweet?.likes?.users?.length > 0
      ? setlikeCount(tweet?.likes?.users?.length)
      : setlikeCount(0);
    tweet?.retweets?.length > 0
      ? setretweetCount(tweet?.retweets?.length)
      : setretweetCount(0);
  }, []);
  useEffect(() => {
    if (likeClicked) {
      setbuttonConfig({
        color: "#007FFF",
        size: 23,
      });
    } else {
      setbuttonConfig({
        color: "white",
        size: 20,
      });
    }
  }, [likeClicked]);

  return (
    <div className="border-slate-700  border-t-[0.1px] border-b-[0.1px] w-full py-3  flex flex-col justify-center items-center">
      <div className="   rounded-lg  border-[0.01px] border-gray-700 shadow-lg shadow-black   my-2 py-3 w-11/12 flex flex-col justify-between">
        <div className="flex gap-4 items-center h-2/5 pl-5">
          <img
            src={tweet?.user?.coverPhoto}
            className="bg-white mt-4 w-[60px] h-[60px] rounded-full"
          ></img>
          <div
            // to={`/user/${tweet?.user?.userName}`}
            // to={`/home/user/${tweet?.user?.userName}`}
            className="text-slate-100 text-xl font-bold tracking-wide"
          >
            @{tweet?.user?.userName}
          </div>
          <div className="text-gray-400 ml-2 text-sm tracking-wide">
            {modifyDate(tweet?.createdAt)}
          </div>
          {/* <MdDelete
            className="flex justify-end ml-auto mr-5 mb-auto  hover:scale-150 transition delay-75 "
            color="white"
          /> */}
          <ConfirmationAlert
            message="Are you sure you want to delete this tweet?"
            // onConfirm={() => console.log("Content deleted")}
            // onCancel={() => console.log("Deletion cancelled")}
            id={`${tweet?._id}`}
          />
        </div>
        <div className="mx-auto   font-semibold   min-h-16 w-9/12 rounded-lg  pb-2  text-slate-300   ">
          {renderContent()}
        </div>
        {tweet?.image && (
          <img
            src={tweet?.image}
            alt="failed"
            className="mx-auto   bg-white   min-h-72 w-9/12 rounded-lg  mb-3  "
          ></img>
        )}
        <div className="flex items-center mt-1  justify-between h-1/5">
          <div className="flex  w-full    justify-around pt-3   items-center  border-t-[0.1px] border-slate-700">
            {/* <div className="text-gray-400 text-sm tracking-wide">
                {tweet.createdAt}
              </div> */}
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => {
                  setTimeout(() => {
                    likeTweetHandler(tweet._id);
                    setlikeClicked(!likeClicked);

                    !likeClicked
                      ? setlikeCount((prev) => prev + 1)
                      : setlikeCount((prev) => prev - 1);
                  }, 400);
                }}
                className="hover:scale-125 transition delay-75 "
              >
                <FaThumbsUp
                  size={buttonConfig.size}
                  color={`${buttonConfig.color}`}
                />{" "}
              </button>
              {likeCount}
            </div>
            <Link
              to={`/tweet/${tweet?._id}`}
              className="flex justify-between items-center gap-3"
            >
              <AiOutlineRetweet size={20} /> {retweetCount}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const ConfirmationAlert = ({ message, onConfirm, onCancel, id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 1000);
    // onConfirm();
    async function deleteTweet() {
      try {
        const res = await axiosInstance.delete(`/tweet/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
      } catch (err) {
        return;
      }
    }
    deleteTweet().then(() => {
      window.location.reload();
    });
  };

  const handleCancel = () => {
    setIsOpen(false);
    // onCancel();
  };

  return (
    <>
      {/* <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Delete
      </button> */}
      <IoMdRemoveCircle
        className=" text-red-700 text-lg  hover:text-red-500 flex justify-end ml-auto mr-6 mb-auto mt-2  hover:scale-125 transition delay-100"
        onClick={() => setIsOpen(true)}
      />

      {isOpen && (
        <div className="fixed flex top-72 flex-col inset-0  z-10   ">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Confirmation
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserFeed;
