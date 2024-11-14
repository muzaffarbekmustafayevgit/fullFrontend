import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Categories from "./pages/Categories";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./auth/ForgotPassword";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Languages from "./components/Languages";
import Courses from "./pages/Courses";
import Modules from "./pages/Modules";
import UserActivation from "./auth/UserActivation";
// import Loading from "./components/Loading";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/courses/login" element={<Login />} />
      <Route path="/profile/" element={<Profile />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/languages" element={<Languages />} />
      <Route path="/modules" element={<Modules />} />
      <Route path="/activation" element={<UserActivation/>}/>
    </Routes>
  </BrowserRouter>
);
