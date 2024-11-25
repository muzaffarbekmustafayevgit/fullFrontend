import React, { useState, useEffect, useCallback, useMemo, useContext, createContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Loading from "../components/Loading";
import {
  FaChevronRight,
  FaHome,
  FaTelegramPlane,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

// Theme Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const Courses = () => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "uz");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Har bir sahifada nechta element ko‘rsatiladi
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const userName = localStorage.getItem("userName");

  const fetchCourses = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://api.eagledev.uz/api/Courses/", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Accept-Language": language,
        },
      });

      if (!response.ok) throw new Error(response.statusText);

      const result = await response.json();
      setCourses(result);
    } catch {
      setError("Error fetching courses. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [language, navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return courses.slice(startIndex, startIndex + itemsPerPage);
  }, [courses, currentPage]);

  const totalPages = Math.ceil(courses.length / itemsPerPage);

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-around bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a className="text-xl font-semibold w-7/12 text-black dark:text-white" href="#">
          Academy
        </a>
        <div className="flex items-center space-x-5">
          <p className="text-black dark:text-white">{userName}</p>
          <select
            id="language"
            value={language}
            onChange={(e) => {
              const lang = e.target.value;
              setLanguage(lang);
              localStorage.setItem("language", lang);
            }}
            className="language-select dark:text-white dark:bg-gray-800"
          >
            <option value="uz">O'zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="flex flex-1">
        <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between space-y-4">
          <nav>
            <ul className="space-y-4 w-full flex flex-col items-start">
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
                  <FaChevronRight className="dark:text-white right-0" />
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
          </nav>
          <div className="flex justify-around mt-auto pt-4 border-t dark:border-gray-700">
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
          <h3 className="text-lg dark:text-white font-semibold mb-4">Kurslar:</h3>
          <div className="max-h-[550px] overflow-auto scrollbar-hide grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedCourses.map((course) => (
              <div
                key={course.id}
                onClick={() => {
                  localStorage.setItem("courseId", course.id);
                  localStorage.setItem("course", course.title);
                  navigate("/courses/aboutCourse");
                }}
                className="border rounded px-2 py-3 dark:text-white dark:bg-gray-700 cursor-pointer hover:bg-gray-200"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded"
                />
                <h4 className="mt-2">{course.title}</h4>
                <p className="text-sm text-gray-500">
                  Price: {course.price} {course.is_free ? "(Free)" : ""}
                </p>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 mx-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 mx-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <Courses />
  </ThemeProvider>
);

export default App;
