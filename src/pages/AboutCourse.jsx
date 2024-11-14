import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import Languages from "../components/Languages";
import { Link } from "react-router-dom";

import {
  FaTelegramPlane,
  FaYoutube,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";
import { FaHome, FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
function AboutCourse() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, index } = location.state || {};
  const [theme, setTheme] = useState("dark");
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);

  const handleNavigate = () => {
    navigate("/lessons");
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Agar token bo'lmasa, foydalanuvchini login sahifasiga yo'naltirish
      navigate("/login");
    } else {
      // Token mavjud bo'lsa, ma'lumotlarni yuklash
      const fetchData = async () => {
        try {
          const response = await fetch(
            `http://api.eagledev.uz/api/Courses/${index + 1}`
          );
          if (!response.ok)
            throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");

          const result = await response.json();
          {
            localStorage.setItem("selectedCourse", category);
          }
          {
            localStorage.setItem("selectedCoursesIndex", index + 1);
            // localStorage.removeItem('selectedCourseIndex')
          }
          {
            localStorage.removeItem("selectedCategory");
          }

          // console.log(result.modules); // Ma'lumotni tahlil qilish uchun log
          setCourseData(result);
          // console.log(result.json());
          // `modules` massivini olish
          // if (result.modules && Array.isArray(result.modules)) {
          //   setModules(result.modules);
          // } else {
          //   throw new Error("Modullar topilmadi");
          // }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [navigate, index]);

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

  if (loading) return <Loading />;
  // if (error) return <p className="text-red-500">Xatolik: {error}</p>;

  return (
    <>
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
              <pre className="text-lg dark:text-white font-semibold mb-4">
                Kurslar{" "}
                <FaChevronRight className="dark:text-white right-0 inline-block " />{" "}
                {category}
              </pre>

              <div className="h-full border-gray-100 overflow-y-scroll  grid  sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* {module.modules.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded px-2 py-3 dark:text-white dark:bg-gray-700 cursor-pointer hover:bg-gray-200"
                  >
                    <h3>{item.title}</h3>
                    <p>Order: {item.order}</p>
                  </div>
                ))} */}
                {/* {console.log(module)} */}
                <div>
                  <img
                    src={courseData.thumbnail}
                    alt={`${courseData.title} thumbnail`}
                  />
                  <p>{courseData.description}</p>
                  <p>
                    <strong>Umumiy davomiylik:</strong>{" "}
                    {courseData.total_duration} soat
                  </p>
                  <p>
                    <strong>Narxi:</strong>{" "}
                    {courseData.is_free ? "Bepul" : `${courseData.price} USD`}
                  </p>

                  <h2>Modullar</h2>
                  <ul>
                    {courseData.modules.map((module, moduleIndex) => (
                      <li key={module.id}>
                        <button
                          onClick={() =>
                            setSelectedModule(
                              moduleIndex === selectedModule
                                ? null
                                : moduleIndex
                            )
                          }
                        >
                          {module.title}
                        </button>
                        {selectedModule === moduleIndex && (
                          <ul>
                            {module.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex}>{lesson}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleNavigate}
                    className="border rounded p-3 bg-green-700"
                  >
                    kirish
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default AboutCourse;
