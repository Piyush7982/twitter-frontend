import { useEffect, useState } from "react";
import { IoIosStats } from "react-icons/io";
import { MdAccessTimeFilled } from "react-icons/md";
import axios from "axios";
import { Loader } from "./Content";
import axiosInstance from "../../helper/axios.instance";
function Trending() {
  return (
    <div className="h-screen  w-7/12 overflow-auto bg-slate-950 flex flex-col justify-evenly  border-[0.1px] border-slate-300">
      <h1 className="text-3xl text-center font-semibold tracking-wide text-white p-6 ">
        Trending
      </h1>
      <div className="h-[95%] space-y-14  w-full">
        <TrendingDiv name="# Hashtags (UnderDevelopment)" />
        <TrendingDiv name="Tweet (UnderDevelopment)" />
      </div>
    </div>
  );
}

function TrendingDiv({ name }) {
  const [Hashtags, setHashtags] = useState([]);
  const [Loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/hashtag/top?limit=8&page=1`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setHashtags(response.data.Data);
        setTimeout(() => {
          setLoading(false);
        }, 900);
      } catch (error) {
        setLoading(false);
        return;
      }
    };
    fetchHashtags();
  }, []);

  return (
    <div className="  h-5/6 bg-black border-t-[0.1px] border-b-[1px] border-slate-500  flex flex-col  justify-evenly overflow-auto">
      <h1 className="text-2xl text-white font-bold tracking-tight ml-5 ">
        {name}
      </h1>
      <div className="w-11/12 h-4/5 overflow-auto py-2   border  border-slate-500 bg-black rounded-xl       flex-col items-center mx-auto mb-5">
        {Loading ? (
          <Loader />
        ) : (
          Hashtags.map((hashtag, index) => (
            <TrendingHashtagCard
              key={hashtag?._id}
              content={hashtag?.content}
              count={hashtag?.count}
              date={hashtag?.latestTweetDate}
              ranking={index + 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TrendingHashtagCard({ content, count, ranking, date }) {
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
    <div className="w-11/12 flex hover:scale-105 hover:bg-slate-800 hover:text-slate-300 hover:cursor-pointer transition-all delay-100  justify-between my-2 mx-auto px-10 items-center h-[20%]">
      <h1 className="text-cyan-400  text-2xl font-bold">#{ranking}</h1>
      <div className="flex   w-[33rem] justify-around">
        <h1 className=" text-white tracking-wide w-[22rem] text-2xl font-bold">
          {content}
        </h1>
        <h1 className="text-white flex items-center space-x-10  text-md tracking-tighter font-semibold">
          <div className="flex gap-1 items-center">
            <IoIosStats size={20} />
            {count}
          </div>{" "}
          <div className=" ml-auto gap-1 font-sm flex items-center">
            {" "}
            <MdAccessTimeFilled />
            <span className="text-slate-400">{modifyDate(date)}</span>
          </div>
        </h1>
      </div>
      {/* <div className="flex flex-col"> */}

      {/* <h1 className="text-slate-200 text-sm font-semibold">{category}</h1> */}
      {/* </div> */}
    </div>
  );
}

export default Trending;
