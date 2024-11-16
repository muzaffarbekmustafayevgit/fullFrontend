import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Languages from "../components/Languages";
import { FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import {
  FaTelegramPlane,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaHome,
} from "react-icons/fa";
const Courses = () => {
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Handle category click to navigate to a different route
  const handleCourseClick = (category, index) => {
    navigate("/modules", { state: { category, index } });
  };

  // UseEffect to check token and fetch course categories
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // If no token, redirect to login page
      navigate("/login");
    } else {
      // Fetch data if token exists
      const fetchData = async () => {
        try {
          // Fetching courses from API
          const response = await fetch("http://api.eagledev.uz/api/Courses/", {
            headers: {
              Authorization: `Bearer ${token}`, // Send token with request if needed
            },
          });

          if (!response.ok) {
            console.error(`Failed to fetch: ${response.statusText}`);
            throw new Error("Failed to fetch");
          }

          const result = await response.json();
          // console.log(result); // Check the structure of the response

          // Assuming the response is an array of course objects, we map titles
          setCategories(result.map((course) => course.title));
        } catch (err) {
          console.error("Fetch error: ", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [navigate]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

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
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 "
              >
                <MdOutlineOndemandVideo className="dark:text-white" />
                Kurslar
                <FaChevronRight className="dark:text-white right-0 " />
              </Link>
            </li>

            <li className="w-11/12">
              <Link
                to={"/profile"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <CgProfile />
                Profile
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

        <section className="flex-1 bg-white dark:bg-gray-900 p-4">
          <div className="p-4">
            <h3 className="text-lg dark:text-white font-semibold mb-4">
              Kurslar:
            </h3>
            <div className="max-h-[550px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCourseClick(category, index)}
                  className="border rounded px-2 py-3 dark:text-white dark:bg-gray-700 cursor-pointer hover:bg-gray-200"
                >
                  {category}
                  {localStorage.setItem('category',category)}

                  <br />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;
