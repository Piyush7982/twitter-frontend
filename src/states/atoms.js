import { atom, useRecoilState } from "recoil";
import axiosInstance from "../helper/axios.instance";

export const loggedUser = atom({
  key: "loggedUser",
  default: localStorage.getItem("user"),
});
const cookiePresent = atom({
  key: "cookiePresent",
  default: document.cookie.split("=")[0] == "access_token" ? true : false,
});
const userBio = atom({
  key: "userBio",
  default: "",
});

const userAuth = atom({
  key: "userAuth",
  default: false,
});

const userProfilePhoto = atom({
  key: "userProfilePhoto",
  default: "",
});

export const userAuthState = () => {
  const [auth, setauth] = useRecoilState(userAuth);

  const status = async () => {
    try {
      const res = await axiosInstance.get("/user/checkAuth", {
        headers: { "Content-Type": "application/json" },
      });

      const authotrised = res ? true : false;
      setauth(authotrised);
      window.localStorage.setItem("status", authotrised);
      //implement axios instance
    } catch (error) {
      localStorage.setItem("status", false);
      setauth(false);

      return;
    }
  };
  status();

  return { auth, setauth };
};

export const userBioState = () => {
  const [bio, setbio] = useRecoilState(userBio);
  return { bio, setbio };
};
export const cookiePresentState = () => {
  const [cookie, setcookie] = useRecoilState(cookiePresent);
  return { cookie, setcookie };
};

export const userInfo = () => {
  const [userlog, setuserlog] = useRecoilState(loggedUser);
  return { userlog, setuserlog };
};

export const userPhotoState = () => {
  const [userPhoto, setuserPhoto] = useRecoilState(userProfilePhoto);
  return { userPhoto, setuserPhoto };
};
