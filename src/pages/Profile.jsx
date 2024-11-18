import React, { useState, useEffect } from "react";
import {
  FaTelegramPlane,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaHome,
} from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { CiTextAlignCenter } from "react-icons/ci";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Languages from "../components/Languages";
// import DefaultUserImage from "../images/DefaultUserImage.png";
const Profile = () => {
  const [theme, setTheme] = useState("dark");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const handleUnload = () => {
      localStorage.removeItem('accessToken');
    };

    // `unload` hodisasiga tinglovchi qo'shiladi
    window.addEventListener('unload', handleUnload);

    // Tozalanish uchun tinglovchi olib tashlanadi
    return () => {
      window.removeEventListener('unload', handleUnload);
    };
  }, []);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // LocalStorage'dan access tokenni olish
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("Access token mavjud emas");
          return;
        }

        const response = await fetch(
          "http://api.eagledev.uz/api/user/profile/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Tokenni Authorization headeriga qo'shish
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile data");

        const result = await response.json();
        setData(result);

        // localStorage.setItem("user", data.user_obj.username);
        // console.log(result);
         if(result.user_obj.role==="moderator"){
          navigate(
          "/moderator"
          )
         }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;
  // if (error) return <p>Error: {error}</p>;
  // console.log(data);
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-around bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a
          className="text-xl font-semibold w-7/12 text-black dark:text-white"
          href="#"
        >
          Academy
        </a>
        <div className="flex items-center space-x-5">
          <Link className="text-black dark:text-white" to={"/"}>
            Landing
          </Link>
          <p className="text-black dark:text-white" id="profile">
            <Languages />
          </p>
          <a className="text-black dark:text-white" href="#">
            Work
          </a>
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col sm:flex-row">
        <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between space-y-4">
          <ul className="space-y-4 w-full flex flex-col items-start justify-center">
            <li className="flex items-center w-full">
              <a
                href="#"
                className="w-11/12 flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <FaHome className="dark:text-white" />
                Home
              </a>
            </li>
            <li className="w-11/12">
              <Link
                to={"/courses"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MdOutlineOndemandVideo className="dark:text-white" />
                Kurslar
              </Link>
            </li>
            <li className="w-11/12">
              <a
                href="#"
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <CiTextAlignCenter className="dark:text-white" />
                Video's text
              </a>
            </li>
            <li className="w-11/12">
              <Link
                to={"/profile"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <CgProfile />
                Profile
                <FaChevronRight className="dark:text-white right-0" />
              </Link>
            </li>
          </ul>

          <div className="flex justify-around align-bottom mt-auto pt-4 border-t dark:border-gray-700">
            <a href="#">
              <FaTelegramPlane className="h-6 w-6 text-blue-500" />
            </a>
            <a href="#">
              <FaInstagram className="h-6 w-6 text-pink-600" />
            </a>
            <a href="#">
              <FaFacebook className="h-6 w-6 text-blue-800" />
            </a>
            <a href="#">
              <FaYoutube className="h-6 w-6 text-red-700" />
            </a>
          </div>
        </aside>

        <section className="flex items-center justify-center flex-col  bg-gray-100 w-full dark:bg-gray-900 p-4">
          {data ? (
            <div
              className="space-y-4 h-full w-full flex items-center
            flex-col justify-center text-black dark:text-white"
            >
              <h2 className="text-2xl">Profile Malumoti</h2>

              {data.profile_image ? (
                <img
                  src={data.profile_image}
                  alt="User Profile"
                  style={{ width: 60, height: 60 }}
                />
              ) : (
                <CgProfile size={100} />
              )}

              <p>
                <strong >Name:</strong> {data.user_obj.username}
              </p>
              <p>
                <strong>Email:</strong> {data.user_obj.email}
              </p>
            </div>
          ) : (
            <p>No profile data available</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
