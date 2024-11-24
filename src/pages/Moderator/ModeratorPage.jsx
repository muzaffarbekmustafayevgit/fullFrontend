import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { FaTelegramPlane, FaYoutube, FaInstagram, FaFacebook, FaHome, FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function ModeratorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState("dark");
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "uz"
  );


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      
    }
  }, [navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  
  const userName = localStorage.getItem("userName");
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // if (loading) return <Loading />;
  if (error) return <p className="text-red-500">Xatolik: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-around bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a className="text-xl font-semibold w-7/12 text-black dark:text-white" href="#">
          Academy
        </a>
        <div className="flex items-center space-x-5">
          <p className="text-black dark:text-white" >
            {userName}
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
                Kurslarni ko'rish  <FaChevronRight className="dark:text-white right-0" />
              </a>
            </li>
            <li className="w-11/12">
              <Link
                to={"/course/course-creating"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <MdOutlineOndemandVideo className="dark:text-white" />
                Kurs yaratish
               
              </Link>
            </li>
            <li className="w-11/12">
              <Link
                to={"/profile"}
                className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <CgProfile />
                Profil
              </Link>
            </li>
          </ul>
          <div className="flex justify-around align-bottom mt-auto pt-4 border-t dark:border-gray-700">
            <a href="#"><FaTelegramPlane className="h-6 w-6 text-blue-500" /></a>
            <a href="#"><FaInstagram className="h-6 w-6 text-pink-600" /></a>
            <a href="#"><FaFacebook className="h-6 w-6 text-blue-800" /></a>
            <a href="#"><FaYoutube className="h-6 w-6 text-red-700" /></a>
          </div>
        </aside>

        <section className="flex-1 bg-white dark:bg-gray-950 p-4 text-white">
        

        
        </section>
      </main>
    </div>
  );
}

export default ModeratorPage;
