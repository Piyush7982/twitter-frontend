import { useState, useEffect, useRef, useCallback } from "react";
import { GrImage } from "react-icons/gr";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineRetweet } from "react-icons/ai";
import { FaThumbsUp } from "react-icons/fa";

import InfiniteScroll from "react-infinite-scroll-component";
import "react-toastify/dist/ReactToastify.css";
import { cookiePresentState, userPhotoState } from "../../states/atoms";
import axiosInstance from "../../helper/axios.instance";

function CreateTweet() {
  const navigate = useNavigate();
  const [userName, setuserName] = useState(localStorage.getItem("user"));
  const [wordcount, setWordcount] = useState(0);
  const [tweetText, setTweetText] = useState("");
  const [image, setImage] = useState(null);
  const { cookie, setcookie } = cookiePresentState();
  const { userPhoto } = userPhotoState();

  const handleTextareaChange = (e) => {
    setWordcount(e.target.value.length);
    setTweetText(e.target.value);
  };
  const handleImage = (e) => {
    if (!e.target.files[0]) return;
    // console.log(e.target.files[0].type !== "image/png");
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      formData.append("content", tweetText);
      formData.append("image", image);

      toast.promise(
        async () => {
          const response = await axiosInstance.post("/tweet/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        },
        {
          pending: "Creating Tweet...",
          success: {
            render() {
              return "Tweet Created";
            },
            theme: "colored",
          },
          error: {
            render() {
              return "Failed to  Create Tweet";
            },
            theme: "colored",
          },
        }
      );
      setTweetText("");
      setWordcount(0);
      setImage(null);
    } catch (error) {
      if (error.message.includes("Network Error")) {
        navigate("/oops", { state: { from: "/" }, replace: true });
      } else if (error.response.status === 408) {
        toast.error("Request Timeout", {
          autoClose: 2000,
          theme: "colored",
        });
        setcookie(false);
        document.cookie = "";
      }
      // console.error(error);
      return;
    }
  };

  return (
    <div className=" border-slate-500 border-t-[0.1px] border-b-[0.1px] w-full h-2/5 min-h-[40%] mt-3 flex flex-col justify-center items-center">
      <div className="rounded-lg bg-gray-800 h-5/6 w-11/12 flex flex-col justify-between">
        <div className="flex gap-4 items-center h-2/5 pl-5">
          <img
            src={userPhoto}
            className="bg-white mt-4 w-[60px] h-[60px] rounded-full"
          />
          <div className="text-slate-300 text-xl font-semibold tracking-wide">
            @{userName}
          </div>
        </div>
        <textarea
          maxLength={280}
          spellCheck={false}
          onChange={handleTextareaChange}
          className="ml-6 bg-slate-900 font-medium h-2/5 w-11/12 rounded-lg px-4 py-2 m-2 text-white flex resize-none"
          placeholder="What's happening?"
          value={tweetText}
        />

        <div className="flex items-center ml-6 justify-between h-1/5">
          <div className="flex flex-auto space-x-3   items-center">
            <GrImage
              size={30}
              onClick={() => {
                document.querySelector("input[type=file]").click();
              }}
              className="rounded-full hover:scale-110 hover:bg-slate-100 hover:text-black p-1 h-5/5 w-16"
            />
            <input
              type="file"
              onChange={handleImage}
              className="hidden"
              name="file"
            />

            <div className="text-gray-400 text-sm tracking-wide">
              {wordcount}/280 words
            </div>
            {setImage && (
              <div className="text-gray-400 text-sm tracking-wide">
                {image?.name}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={tweetText.length === 0}
            className={
              tweetText.length === 0
                ? "bg-blue-300 text-blue-50 tracking-tight p-1 m-2 w-1/12 font-medium hover:scale-110 rounded-md"
                : "bg-blue-600 text-white tracking-tight p-1 m-2 w-1/12 font-medium hover:scale-110 rounded-md"
            }
            onClick={handleSubmit}
          >
            Tweet
          </button>
        </div>
      </div>
    </div>
  );
}

export function FeedTweet({ children, link }) {
  const [tweet, settweet] = useState([]);
  let url = "tweet/";
  if (link) {
    url = link;
  }

  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(2);
  const [noTweet, setnoTweet] = useState(false);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axiosInstance.get(`/${url}?page=1&limit=5`, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.data.Data.length === 0) {
          setnoTweet(true);
        }

        setTimeout(() => {
          settweet(response.data.Data);
        }, 1500);
      } catch (error) {
        return;
      }
    };
    fetchTweet();
  }, []);
  const fetchMoreData = async () => {
    try {
      const res = await axiosInstance.get(`/${url}?page=${index}&limit=5`, {
        headers: { "Content-Type": "application/json" },
      });

      setTimeout(() => {
        settweet((prevItems) => [...prevItems, ...res.data.Data]);
      }, 1500);

      if (res?.data?.Data?.length > 0) {
        setHasMore(true);
        setIndex((prevIndex) => prevIndex + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      return;
    }
  };

  return (
    <div className=" w-7/12  border-[0.5px]  border-slate-500  h-full   text-white flex flex-col  ">
      <InfiniteScroll
        dataLength={tweet?.length}
        // next={setTimeout(() => {
        //   fetchMoreData();
        // }, 2000)}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader />}
        scrollThreshold={0.9}
        height={750}
        // endMessage={"end"}
        style={{ overflow: "auto", paddingBottom: "20px" }}

        // onScroll={fetchMoreData}
      >
        {children ? children : <CreateTweet />}
        {/* {noTweet?(<div></div>):(tweet.length === 0 && <Loader />
        {tweet.map((tweet) => {
          return <TweetCard key={tweet._id} tweet={tweet} />;
        })})}
         */}
        {noTweet && (
          <div className=" flex flex-col items-center h-2/5 justify-center text-slate-300 text-xl tracking-tight font-semibold   ">
            {" "}
            No Tweets To Show
          </div>
        )}
        {!noTweet && tweet?.length === 0 && <ShimmerUi />}
        {!noTweet &&
          tweet.map((tweet) => {
            return <TweetCard key={tweet._id} tweet={tweet} />;
          })}
      </InfiniteScroll>
    </div>
  );
}

export function TweetCard({ tweet }) {
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
          <span key={index} className="text-blue-600 mx-1  font-bold">
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
        `/tweet/like/${id}/`,
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
    <div className="border-slate-700 border-t-[0.1px] border-b-[0.1px] w-full py-3  flex flex-col justify-center items-center">
      <div className="  rounded-lg  border-[0.01px] border-gray-700 shadow-lg shadow-black   my-2 pb-3   w-11/12 flex flex-col justify-between">
        <div className="flex gap-4 items-center h-2/5 pl-4">
          <img
            src={tweet?.user?.coverPhoto}
            className="bg-white mt-4 w-[60px] h-[60px] rounded-full"
          ></img>
          <Link
            to={
              tweet?.user?.userName === localStorage.getItem("user")
                ? `userProfile`
                : `user/${tweet?.user?.userName}`
            }
            // to={`/home/user/${tweet?.user?.userName}`}
            className="text-white text-xl font-bold tracking-wide"
          >
            @{tweet?.user?.userName}
          </Link>
          <div className="text-gray-400 text-sm tracking-wide">
            {modifyDate(tweet?.createdAt)}
          </div>
        </div>
        <div className="mx-auto   font-semibold tracking-tight  min-h-16 w-9/12 rounded-lg   pb-2  text-slate-300   ">
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
              to={`tweet/${tweet._id}`}
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
export function Loader() {
  return (
    <div className=" mt-4 text-center ">
      <div role="status">
        <svg
          aria-hidden="true"
          className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <div className="text-blue-500 mt-3 font-medium ">Loading...</div>
      </div>
    </div>
  );
}
function ShimmerCard() {
  return (
    <div className="w-full border mt-2 border-slate-600 animate-pulse">
      <div className="w-11/12 mb-5 mt-5 mx-auto bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 rounded-lg border-[0.1px] border-slate-700 flex flex-col py-3">
        <div className="flex items-center justify-start gap-x-4 pb-2">
          <div className="w-12 h-12 rounded-full bg-slate-500 ml-4"></div>
        </div>

        <div className="mx-auto bg-slate-600 min-h-16 w-9/12 rounded-lg mb-3"></div>
        <div className="flex items-center mt-1 justify-between h-1/5">
          <div className="flex w-full justify-around py-3 items-center "></div>
        </div>
      </div>
    </div>
  );
}
function ShimmerUi() {
  return (
    <>
      <ShimmerCard />
      <ShimmerCard />
      <ShimmerCard />
    </>
  );
}

export default FeedTweet;
