import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Loading from "../components/Loading";

import { FaChevronRight } from "react-icons/fa";
// import Loading from "../components/Loading";
import Languages from "../components/Languages";

function Courses() {
  const location = useLocation();
  const { category, index } = location.state || {};
  const [theme, setTheme] = useState("dark");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
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
      const newCategories = data.map((e) => e.name);
      setCategories(newCategories);
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* <div>
      <h1>Courses Page</h1>
      {category ? (
        <>
          <p>Selected Category: {category}</p>
          <p>Index: {index}</p>
        </> 
      ) : (
        <p>No data received</p>
      )}
    </div> */}
      <div className="h-screen flex flex-col">
        <header className="flex items-center justify-around  bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
          <a
            className="text-xl font-semibold w-7/12 text-black dark:text-white"
            href="#"
          >
            Academy
          </a>
          <div className="flex items-center space-x-5">
            <a className="text-black dark:text-white" to={"/"}>
              Landing
            </a>
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
          <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between space-y-4"></aside>

          <section className="flex-1 bg-white dark:bg-gray-900 p-4">
            <div className="p -4">
              <pre className="text-lg dark:text-white   font-semibold mb-4 ">
                Kategoriyalar{" "}
                <FaChevronRight className="text-white inline-block" />{" "}
                {category}
              </pre>
              <div className="max-h-[550px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"></div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Courses;
