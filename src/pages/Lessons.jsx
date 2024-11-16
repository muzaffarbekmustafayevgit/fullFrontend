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
  const [openModuleId, setOpenModuleId] = useState(null); // State to track open module
  const [selectedLessonData, setSelectedLessonData] = useState(null); // State for selected lesson data
  const navigate = useNavigate();
  const selectedCourse = localStorage.getItem("selectedCoursesIndex") || 1;
  const selectedModule = localStorage.getItem("selectedModulesIndex") || 1;

  const selectedLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`http://api.eagledev.uz/api/Lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Error fetching lesson details");
      }

      const lessonDetails = await response.json();
      console.log("Selected Lesson Details:", lessonDetails);
      setSelectedLessonData(lessonDetails); // Store the lesson details in the state
      localStorage.setItem("selectedLessonsIndex", lessonId);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleSelectModule = (moduleId) => {
    if (openModuleId === moduleId) {
      setOpenModuleId(null); // Close the module if it's already open
    } else {
      setOpenModuleId(moduleId); // Open the selected module
    }
    localStorage.setItem("selectedModulesIndex", moduleId);
  };

  const fetchModulesAndLessons = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const modulesResponse = await fetch(
        `http://api.eagledev.uz/api/Modules/?course=${selectedCourse}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!modulesResponse.ok) throw new Error("Error fetching modules data");

      const modulesResult = await modulesResponse.json();
      setModulesData(modulesResult);

      const lessonsResponse = await fetch(
        `http://api.eagledev.uz/api/Lessons/?id=${1}&is_open=&module=${1}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!lessonsResponse.ok) throw new Error("Error fetching lessons data");

      const lessonsResult = await lessonsResponse.json();
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
        <a className="text-xl font-semibold w-7/12 text-black dark:text-white" href="#">
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
                className="p-2 bg-white dark:bg-gray-700 rounded shadow"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleSelectModule(module.id)}
                >
                  <h3 className="text-lg font-medium text-black dark:text-white">
                    {module.title}
                  </h3>
                  <span className="text-black dark:text-white">
                    {openModuleId === module.id ? "▲" : "▼"}
                  </span>
                </div>
                {openModuleId === module.id && module.lessons && (
                  <div className="mt-2 space-y-2">
                    {module.lessons.map((lesson) => (
                      <p
                        key={lesson.id}
                        onClick={() => selectedLesson(lesson.id)}
                        className="text-sm text-black dark:text-white cursor-pointer"
                      >
                        {lesson.title}
                      </p>
                    ))}
                  </div>
                )}
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
          {selectedLessonData ? (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {selectedLessonData.title}
                {/* {console.log(selectedLessonData)} */}
                <video controls src={selectedLessonData.video}></video>
              </h3>
              <p className="text-black dark:text-white">{selectedLessonData.content}</p>
              {/* Add more details as needed */}
            </div>
          ) : (
            <p className="text-black dark:text-white">Darslikni tanlang</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Lessons;
