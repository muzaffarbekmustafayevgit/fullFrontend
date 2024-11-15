import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import Languages from "../components/Languages";

const Lessons = () => {
  const [theme, setTheme] = useState("dark");
  const [modulesData, setModulesData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const selectedCourse = localStorage.getItem("selectedCoursesIndex") || 1;
  const selectedModule = localStorage.getItem("selectedModulesIndex") || 1;

  const handleSelectModule = (moduleId) => {
    localStorage.setItem("selectedModulesIndex", moduleId);
  };

  const fetchModulesAndLessons = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const [lessonsResponse, modulesResponse] = await Promise.all([
        fetch(`http://api.eagledev.uz/api/Lessons`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://api.eagledev.uz/api/Modules/?course=${selectedCourse}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!modulesResponse.ok) {
        throw new Error("Modullar ma'lumotini olishda xatolik yuz berdi");
      }
      if (!lessonsResponse.ok) {
        throw new Error("Darsliklar ma'lumotini olishda xatolik yuz berdi");
      }

      const modulesResult = await modulesResponse.json();
      const lessonsResult = await lessonsResponse.json();
      
      setModulesData(modulesResult);
      setLessonsData(lessonsResult);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
    fetchModulesAndLessons();
  }, [navigate, selectedCourse]);

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
              <div
                key={module.id}
                className="p-2 flex items-center gap-2 bg-white dark:bg-gray-700 rounded shadow"
                onClick={() => handleSelectModule(module.id)}
              >
                <h3 className="text-lg font-medium text-black dark:text-white">
                  {module.title}
                </h3>
                { }
                {(module.lessons).map((e)=>(console.log(e)))}
              </div>
            ))
          ) : (
            <p className="text-black dark:text-white">Modullar mavjud emas</p>
          )}
        </aside>

        <section className="flex items-center justify-center flex-col bg-gray-100 w-full dark:bg-gray-900 p-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Darslik
          </h2>
          {lessonsData.length > 0 ? (
            lessonsData.map((lesson) => (
              <div
                key={lesson.id}
                className="p-4 bg-white dark:bg-gray-700 rounded shadow w-full mb-4"
              >
                <p className="text-black dark:text-white font-bold">
                  {lesson.title}
                </p>
                <p className="text-black dark:text-white">
                  {lesson.description}
                  {console.log(lesson)}

                </p>
                <video controls src={lesson.video}></video>
              </div>
            ))
          ) : (
            <p className="text-black dark:text-white">Darsliklar mavjud emas</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Lessons;
