import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { FaTelegramPlane, FaYoutube, FaInstagram, FaFacebook, FaHome, FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function AboutCourse() {
  const navigate = useNavigate();
  const location = useLocation();

  const [theme, setTheme] = useState("dark");
  const [courseData, setCourseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "uz");

  const fetchData = async () => {
    const courseId = localStorage.getItem("courseId");
    const token = localStorage.getItem("access_token");

    if (!courseId) {
      navigate("/courses");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://api.eagledev.uz/api/Courses/${courseId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      if (!response.ok) throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");

      const result = await response.json();
      // // localStorage.setItem("selectedCourse", category);
      localStorage.setItem("selectedCoursesIndex", 2);
      localStorage.removeItem("selectedCategory");

      setCourseData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 const courseName=localStorage.getItem("course")
  useEffect(() => {
    fetchData();
  }, [language]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

 
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  const handleModuleClick = (index) => {
    setSelectedModule(index === selectedModule ? null : index);
  };

  const handleNavigate = () => {
    navigate("/lessons");
  };

  const userName = localStorage.getItem("userName");
  if (loading) return <Loading />;
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
          <p className="text-black dark:text-white" id="profile">
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="language-select dark:text-white dark:bg-gray-800"
            >
              <option value="uz">O'zbekcha</option>
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
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
              <a href="#" className="w-11/12 flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <FaHome className="dark:text-white" />
                Home
              </a>
            </li>
            <li className="w-11/12">
              <Link to={"/courses"} className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdOutlineOndemandVideo className="dark:text-white" />
                Kurslar
                <FaChevronRight className="dark:text-white right-0 " />
              </Link>
            </li>
            <li className="w-11/12">
              <Link to={"/profile"} className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
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

        <section className="flex-1 bg-white dark:bg-gray-950">
          <div className="flex flex-col items-center justify-center">
            <p className="mb-2 mt-2 dark:text-white font-semibold">
              Kurslar <FaChevronRight className="dark:text-white right-0 inline-block " /> {courseName}
            </p>
            <div className="h-full border-gray-100 flex">
              <div className="flex flex-wrap">
                <div className="flex justify-center w-full">
                  <div className="w-11/12 flex justify-between p-5 dark:bg-gray-800">
                    <div className="w-1/2">
                      <strong className="dark:text-white text-lg">{courseName}</strong>
                      <p className="dark:text-white">{courseData.description}</p>
                      <p className="dark:text-white">
                        <strong className="dark:text-white">Umumiy davomiylik:</strong> {courseData.total_duration} soat
                      </p>
                    </div>

                    <img
                      src={courseData.thumbnail}
                      alt={`${courseData.title} thumbnail`}
                      className="object-contain w-80"
                    />
                  </div>
                </div>

                <div className="flex justify-center w-full mt-8">
                  <div className="w-11/12 flex justify-between">
                    <div className="dark:bg-gray-800 w-7/12 p-10 flex flex-col">
                      <pre className="dark:text-white font-semibold">
                        <h3>Modullar</h3>
                        <div className="border-b dark:border-gray-500 mt-2" />
                        <ul className="space-y-4 mt-4">
                          {courseData.modules?.map((module, index) => (
                          
                            <li
                              key={module.id}
                              className="w-full border-b dark:border-gray-500"
                              onClick={() => handleModuleClick(index)}
                            >  
                              <div className="cursor-pointer dark:text-white">
                                {module.title}
                                {selectedModule === index && (
                                  <div className="pl-4 ">{module.description}</div>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </pre>
                    </div>

                    <div className="w-4/12 p-5 dark:bg-gray-800">
                      <button
                        onClick={handleNavigate}
                        className="px-5 py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Kursga o'tish
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AboutCourse;
