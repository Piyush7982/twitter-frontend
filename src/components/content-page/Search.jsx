import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { Loader } from "./Content";
import axiosInstance from "../../helper/axios.instance";
function Search() {
  const [search, setsearch] = useState([]);
  const [inputString, setinputString] = useState("");
  const [loading, setloading] = useState(false);
  useEffect(() => {
    if (inputString.length >= 3) {
      setloading(true);
      const fetchUser = async () => {
        try {
          const response = await axiosInstance.get(
            `/user/search/${inputString}?page=1&limit=6`,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.Data.length === 0) {
            setsearch([]);
            setloading(false);
          } else {
            setTimeout(() => {
              setsearch(response.data.Data);
              setloading(false);
            }, 500);
          }
        } catch (error) {
          return;
        }
      };
      fetchUser();
    } else {
      setsearch([]);
    }
  }, [inputString]);

  return (
    <div className="flex border-[0.1px] gap-1   border-slate-300 flex-col items-center overflow-auto h-screen  w-7/12   pt-2 ">
      <Searchbar setinputString={setinputString} />
      <>
        {loading ? (
          <Loader />
        ) : (
          <>
            {search.map((user) => (
              <ProfileCard key={user.id} user={user} />
            ))}
          </>
        )}
      </>
    </div>
  );
}

function Searchbar({ setinputString }) {
  return (
    <div className="flex  border-white justify-around min-h-[12%]  w-10/12 items-center pt-2  ">
      <FaSearch size={25} color="white" className="" />
      <input
        onChange={(e) => setinputString(e.target.value)}
        className="w-10/12  h-1/2 rounded-xl bg-gray-200 py-2 px-4 text-gray-700 leading-tight focus:outline-none"
        placeholder="Search Username on Twitter"
      />
    </div>
  );
}

function ProfileCard({ user }) {
  const navigate = useNavigate();
  return (
    <div className="border-[0.1px] border-slate-700 text-slate-200 items-center  my-2 hover:scale-105 w-9/12 rounded-sm flex justify-around  min-h-[15%] hover:rounded-lg hover:text-slate-100 hover:cursor-pointer hover:bg-slate-700 transition delay-[50ms] ">
      <img
        src={user?.coverPhoto}
        alt="no image"
        className="w-[75px] h-[75px] rounded-full bg-white"
      ></img>
      <button
        onClick={() => {
          navigate(`/user/${user?.userName}`);
          // navigate(`/home/user/${user?.userName}`);
        }}
        className="font-semibold  w-8/12 flex justify-start text-2xl  tracking-tight "
      >
        {user.userName}
      </button>
    </div>
  );
}

export default Search;
