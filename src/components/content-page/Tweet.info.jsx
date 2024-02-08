import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoCreate } from "react-icons/io5";
import { Loader } from "./Content";
import InfiniteScroll from "react-infinite-scroll-component";
// import { AiOutlineRetweet } from "react-icons/ai";
import { FaThumbsUp } from "react-icons/fa";
import axiosInstance from "../../helper/axios.instance";

function TweetInfo() {
  const param = useParams();
  const [retweet, setretweet] = useState([]);
  const [tweet, setTweet] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [index, setIndex] = useState(2);
  const [noRetweet, setNoRetweet] = useState(false);

  useEffect(() => {
    const fetchRetweet = async () => {
      try {
        const response = await axiosInstance.get(
          `/tweet/${param.tweet}?page=1&limit=5`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        const tweetInfo = {
          content: response?.data?.Data?.content,
          user: {
            userName: response?.data?.Data?.user?.userName,
            coverPhoto: response?.data?.Data?.user?.coverPhoto,
          },
          createdAt: response?.data?.Data?.createdAt,
          likes: response?.data?.Data?.likes,
          retweets: response?.data?.Data?.retweets,
          _id: response?.data?.Data?._id,
          image: response?.data?.Data?.image,
        };
        // console.log(tweetInfo);
        setTimeout(() => {
          setTweet(tweetInfo);
        }, 1100);
        if (response?.data?.Data?.retweets?.length === 0) {
          setNoRetweet(true);
        }

        setTimeout(() => {
          setretweet(response?.data?.Data?.retweets);
        }, 1500);
      } catch (error) {
        setNoRetweet(true);
        return;
      }
    };
    fetchRetweet();
  }, []);
  const fetchMoreData = async () => {
    try {
      const res = await axiosInstance.get(
        `/tweet/${param.tweet}?page=${index}&limit=5`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setTimeout(() => {
        setretweet((prevItems) => [...prevItems, ...res?.data?.Data?.retweets]);
        if (res?.data?.Data?.retweets > 0) {
          setHasMore(true);
          setIndex((prevIndex) => prevIndex + 1);
        } else {
          setHasMore(false);
        }
      }, 1200);
    } catch (err) {
      return;
    }
  };
  return (
    <div className="w-7/12 border-[0.5px]        border-slate-500  h-full    flex flex-col ">
      <InfiniteScroll
        dataLength={retweet.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loader />}
        scrollThreshold={0.9}
        endMessage={
          <p className="text-center pt-3 text-purple-300 font-semibold">
            <b>. . . .</b>
          </p>
        }
        height={750}
        style={{
          overflow: "auto",
          paddingBottom: "20px",
        }}
      >
        {/* <TweetCard tweet={tweet} /> */}
        {/* {<ShimmerCard />} */}
        {tweet?._id ? <TweetCardLite tweet={tweet} /> : <ShimmerCard />}

        {noRetweet && (
          <div className=" flex flex-col items-center h-2/5 justify-center text-slate-300 text-xl tracking-tight font-semibold   ">
            {" "}
            No Retweets To Show, be the first to Retweet
          </div>
        )}
        {!noRetweet && retweet.length === 0 && <Loader />}
        {!noRetweet &&
          retweet.map((retweet) => {
            return <RetweetCard key={retweet._id} retweet={retweet} />;
          })}
      </InfiniteScroll>
    </div>
  );
}

function RetweetCard({ retweet }) {
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
  const renderContent = () => {
    const contentArray = retweet?.content?.split(" ");
    return contentArray?.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span key={index} className="text-violet-400 mx-1 font-bold">
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
  return (
    <div className="w-10/12  mt-5 mx-auto bg-gradient-to-r  opacity-95 from-indigo-900 via-violet-900 to-indigo-900 rounded-lg  border-[0.1px] border-slate-700 flex flex-col py-3">
      <div className="flex items-center justify-start gap-x-4 pb-2">
        <img
          src={retweet?.user?.coverPhoto}
          alt="no image"
          className="w-12 h-12 rounded-full bg-slate-500 ml-4"
        />
        <Link
          to={`/user/${retweet?.user?.userName}`}
          className="text-slate-200 text-lg font-medium"
        >
          @{retweet?.user?.userName}
        </Link>
        <div className="text-gray-400 text-sm tracking-wide">
          {modifyDate(retweet?.createdAt)}
        </div>
      </div>
      <div className=" w-9/12 min-h-16 pl-3 pr-1 pt-4 bg-slate-900  mx-auto  text-slate-300 rounded-lg pb-4 tracking-tight font-semibold ">
        {renderContent()}
      </div>
    </div>
  );
}
function TweetCardLite({ tweet }) {
  const [likeClicked, setlikeClicked] = useState(false);
  const [buttonConfig, setbuttonConfig] = useState({
    color: "white",
    size: 20,
  });
  const [likeCount, setlikeCount] = useState(0);
  const [CreateRetweetClicked, setCreateRetweetClicked] = useState(false);
  // const [retweetCount, setretweetCount] = useState(0);
  const renderContent = () => {
    const contentArray = tweet?.content?.split(" ");
    return contentArray?.map((word, index) => {
      if (word.startsWith("#")) {
        return (
          <span key={index} className="text-violet-300 mx-1 font-bold">
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
    // console.log(tweet?.likes?.users);
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
    // tweet?.retweets?.length > 0
    //   ? setretweetCount(tweet?.retweets?.length)
    //   : setretweetCount(0);
  }, []);
  useEffect(() => {
    if (likeClicked) {
      setbuttonConfig({
        color: "rgb(139 92 246 / var(--tw-text-opacity))",
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
    <div className="w-full border mt-2  border-slate-600">
      <div className="w-11/12 mb-5    mt-5 mx-auto bg-gradient-to-r  opacity-95 from-gray-900 via-slate-950 to-gray-950 rounded-lg  border-[0.1px] border-slate-700 flex flex-col py-3">
        <div className="flex items-center justify-start gap-x-4 pb-2">
          <img
            src={tweet?.user?.coverPhoto}
            alt="no image"
            className="w-12 h-12 rounded-full bg-slate-500 ml-4"
          />
          <Link
            to={`/user/${tweet?.user?.userName}`}
            className="text-slate-300 text-lg font-medium"
          >
            @{tweet?.user?.userName}
          </Link>
          <div className="text-gray-400 text-sm tracking-wide">
            {modifyDate(tweet?.createdAt)}
          </div>
        </div>
        <div
          className={
            tweet?.image
              ? "w-9/12 text-lg min-h-16 pl-4 pr-1 pt-4  mb-2  mx-auto  text-slate-100 rounded-lg pb-4 tracking-tight font-semibold"
              : " w-9/12 text-lg min-h-16 pl-4 pr-1 pt-4 bg-gray-700 mb-2  mx-auto  text-slate-100 rounded-lg pb-4 tracking-tight font-semibold"
          }
        >
          {renderContent()}
        </div>
        {tweet?.image && (
          <img
            src={tweet?.image}
            alt="failed"
            className="mx-auto   bg-white   min-h-52 w-9/12 rounded-lg  mb-3  "
          ></img>
        )}
        <div className="flex items-center mt-1  justify-between h-1/5">
          <div className="flex  w-full    justify-around pt-3   items-center  border-t-[0.1px] border-slate-700">
            {/* <div className="text-gray-400 text-sm tracking-wide">
              {tweet.createdAt}
            </div> */}
            <div className="flex justify-between items-center text-white gap-3">
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
                  className="opacity-80"
                  size={buttonConfig.size}
                  color={`${buttonConfig.color}`}
                />{" "}
              </button>
              {likeCount}
            </div>
            <button
              onClick={() => {
                setCreateRetweetClicked(!CreateRetweetClicked);
              }}
              className="flex text-white justify-between items-center gap-3"
            >
              <IoCreate
                className="scale-110  text-violet-300 hover:text-violet-600"
                size={20}
              />
            </button>
          </div>
        </div>
      </div>
      {CreateRetweetClicked && (
        <CreateRetweet setClicked={setCreateRetweetClicked} />
      )}
    </div>
  );
}
function ShimmerCard() {
  return (
    <div className="w-full border mt-2 border-slate-600 animate-pulse">
      <div className="w-11/12 mb-5 mt-5 mx-auto bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 rounded-lg border-[0.1px] border-slate-700 flex flex-col py-3">
        <div className="flex items-center justify-start gap-x-4 pb-2">
          <div className="w-12 h-12 rounded-full bg-slate-500 ml-4"></div>
        </div>

        <div className="mx-auto bg-slate-600 min-h-16 w-9/12 rounded-lg mb-3"></div>
        <div className="flex items-center mt-1 justify-between h-1/5">
          <div className="flex w-full justify-around pt-3 items-center border-t-[0.1px] border-slate-700">
            <div className="flex justify-between items-center gap-3">
              <div className="w-6 h-6 bg-slate-300"></div>
            </div>
            <div className="flex justify-between items-center gap-3">
              <div className="w-6 h-6 bg-slate-900"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function CreateRetweet({ setClicked }) {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(true);
  const [wordcount, setWordcount] = useState(0);
  const [tweetText, setTweetText] = useState("");
  const param = useParams();

  const handleTextareaChange = (e) => {
    setWordcount(e.target.value.length);
    if (e.target.value.length > 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }

    setTweetText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    try {
      formData.append("content", tweetText);

      const response = await axiosInstance.post(
        `/retweet/${param?.tweet}`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setTimeout(() => {
        setTweetText("");
        setWordcount(0);
        setClicked(false);
        window.location.reload();
      }, 2000);
      toast.success("Retweet created", {
        autoClose: 2000,
        theme: "colored",
      });
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
    <div className=" w-full h-1/5 min-h-[27%] mt-3 mb-3 flex flex-col justify-center items-center">
      <div className="rounded-lg bg-gray-800 pt-5 pb-3   h-5/6 w-9/12 flex flex-col justify-between">
        <textarea
          maxLength={140}
          spellCheck={false}
          onChange={handleTextareaChange}
          className="ml-6 bg-slate-900 font-medium h-3/5 w-11/12 rounded-lg px-4 py-2 m-2 text-white flex resize-none"
          placeholder="What's Your Opinion?"
          value={tweetText}
        />
        <div className="flex items-center w-11/12 py-1 ml-6 justify-between h-1/5">
          <div className="text-gray-400 text-sm tracking-wide">
            {wordcount}/140 words
          </div>
          <button
            disabled={disabled}
            type="submit"
            className={
              disabled
                ? "bg-violet-300   cursor-not-allowed  text-violet-700  tracking-tight p-1  w-2/12 font-medium text-sm  rounded-md"
                : "bg-violet-600   text-white tracking-tight p-1  w-2/12 font-medium text-sm hover:scale-110 rounded-md"
            }
            onClick={handleSubmit}
          >
            Retweet
          </button>
        </div>
      </div>
    </div>
  );
}
export default TweetInfo;
