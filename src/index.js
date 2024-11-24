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
import AboutCourse from "./pages/AboutCourse";
import UserActivation from "./auth/UserActivation";
import Lessons from "./pages/Lessons";
import ModeratorPage from "./pages/Moderator/ModeratorPage";
import AdminPanel from "./pages/admin/AdminPanel";
import CourseCreating from "./pages/Moderator/CourseCreating";
import ModuleCreating from "./pages/Moderator/ModuleCreating";
import Loading from "./components/Loading";
import LessonCreating from "./pages/Moderator/LessonCreating";
// import Loading from "./components/Loading";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={<Login />} />
      <Route path="*" element={<NotFound />} />
      
      <Route path="/home" element={<Home/>} />
      {/* <Route path="/login" element={<Login />} />  */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/admin" element={<AdminPanel/>}/>
      <Route path="/contact" element={<Contact />} />
      <Route path="/courses/login" element={<Login />} />
      <Route path="/profile/" element={<Profile />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/languages" element={<Languages />} />
      <Route path="/courses/aboutCourse" element={<AboutCourse />} />
      <Route path="/course/course-creating" element={<CourseCreating/>}/>
      <Route path="/course/course-creating/module-creating" element={<ModuleCreating/>} loader={<Loading/>}/>
      <Route path="/course/course-creating/module-creating/lesson-creating" element={<LessonCreating/>}/>
      <Route path="/activation" element={<UserActivation/>}/>
      <Route path="/lessons" element={<Lessons/>}/>
      <Route path="/moderator" element={<ModeratorPage/>}/>
    </Routes>
  </BrowserRouter>
);
