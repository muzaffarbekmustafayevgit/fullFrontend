import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Languages from "../components/Languages";

const Lessons = () => {
  const [theme, setTheme] = useState("dark");
  const [modulesData, setModulesData] = useState([]);
  const [lessonsData, setLessonsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const selectedCourse = localStorage.getItem("selectedCoursesIndex") || 1;
  const lessonId = localStorage();
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    } else {
      const fetchModulesAndLessons = async () => {
        try {
          // Fetch Modules
          const modulesResponse = await fetch(
            `http://api.eagledev.uz/api/Modules/?course=${selectedCourse}`
          );
          if (!modulesResponse.ok)
            throw new Error("Modullar ma'lumotini olishda xatolik yuz berdi");

          const modulesResult = await modulesResponse.json();
          setModulesData(modulesResult);

          // Fetch Lessons for each module
          const lessonsPromises = modulesResult.map((module) =>
            fetch(
              `http://api.eagledev.uz/api/Lessons/?id=${lessonId}&is_open&module=${moduleId}`
            )
              .then((res) => res.json())
              .then((lessons) => ({ [module.id]: lessons }))
          );

          const lessonsResults = await Promise.all(lessonsPromises);
          const lessonsMap = lessonsResults.reduce((acc, lesson) => {
            return { ...acc, ...lesson };
          }, {});

          setLessonsData(lessonsMap);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchModulesAndLessons();
    }
  }, [navigate, selectedCourse]);

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
          <a className="text-black dark:text-white" href="#">
            {localStorage.getItem("user") ? (
              <p>{localStorage.getItem("user")}</p>
            ) : (
              <p>User</p>
            )}
          </a>
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col sm:flex-row">
        <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col space-y-4">
          {modulesData.length > 0 ? (
            modulesData.map((module) => (
              <div key={module.id} className="p-2 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-bold text-white">{module.title}</h3>
                {lessonsData[module.id] ? (
                  <ul className="mt-2">
                    {lessonsData[module.id].map((lesson) => (
                      <li
                        key={lesson.id}
                        className="text-gray-300 ml-4 list-disc"
                      >
                        {lesson.title}
                        {console.log(lesson)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Darsliklar yo'q</p>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">Modullar topilmadi.</p>
          )}
        </aside>

        <section className="flex items-center justify-center flex-col bg-gray-100 w-full dark:bg-gray-900 p-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Modul va darsliklar ma'lumotlari
          </h2>
        </section>
      </main>
    </div>
  );
};

export default Lessons;
