import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { RecoilRoot } from "recoil";

import Layout from "./layout";
import Signin from "./components/auth/signin";
import Signup from "./components/auth/signup";
import ServerError from "./components/error-handling/internal.server.error";
import NotFound from "./components/error-handling/error.notfound";
import TweetPage from "./components/content-page/tweets-page";
import HomeLayout from "./home-layout";
import UserProfile from "./components/content-page/user.profile";
import Search from "./components/content-page/Search";
import UserFeed from "./components/content-page/user.page";
import Trending from "./components/content-page/Trending";
import TweetInfo from "./components/content-page/Tweet.info";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<HomeLayout />}>
        {/* <Route path="home" element={<HomeLayout />}> */}
        <Route path="" element={<TweetPage />} />
        <Route path="tweet/:tweet" element={<TweetInfo />} />
        <Route path="trending" element={<Trending />} />
        <Route path="userProfile" element={<UserFeed />} />
        <Route path="search" element={<Search />} />
        <Route path="user/:username" element={<UserProfile />} />
        {/* <Route path=":username" element={<UserProfile />} /> */}
      </Route>
      <Route path="signup" element={<Signup />} />
      <Route path="signin" element={<Signin />} />
      <Route path="oops" element={<ServerError />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

root.render(
  <RecoilRoot>
    <RouterProvider router={router} />
  </RecoilRoot>
);
