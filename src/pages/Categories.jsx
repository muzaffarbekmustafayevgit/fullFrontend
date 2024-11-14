import React, { useState, useEffect } from "react";
import {
  FaTelegramPlane,
  FaYoutube,
  FaInstagram,
  FaFacebook,
  FaHome,
} from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Loading from "../components/Loading";
import { Link, useNavigate } from "react-router-dom";
import Languages from "../components/Languages";
// import Date from "../components/Date";
import { useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
const Categories = () => {
  const [theme, setTheme] = useState("dark");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const nameParam = queryParams.get("name");
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handlenavigate = () => {
    navigate("/");
  };

  const handleCategoryClick = (category, index) => {
    navigate("/categories/courses", { state: { category, index } });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://api.eagledev.uz/api/Categories/");
        if (!response.ok) throw new Error("Failed to fetch");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      // `data` mavjud bo'lsa, kategoriyalarni olish
      const newCategories = data.map((e) => e.name);
      setCategories(newCategories);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-around  bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
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
          <p className="text-black dark:text-white" href="#"></p>
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
                to={"/categories"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-700 "
              >
                <MdOutlineOndemandVideo className="dark:text-white" />
                Categories
                <FaChevronRight className="text-white right-0" />
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
              Kategoriyalar:
            </h3>
            <div className="max-h-[550px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category, index)}
                  className="border rounded px-2 py-3 dark:text-white  dark:bg-gray-700 cursor-pointer hover:bg-gray-600"
                >
                  {category}
                  <br />
                  {index}
                  <p>Query parametr (name): {category}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Categories;
