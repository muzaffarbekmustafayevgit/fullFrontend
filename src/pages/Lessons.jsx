import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

// Modul elementi
const ModuleItem = ({ module, openModuleId, onSelectModule, onSelectLesson }) => (
  <div className="p-2 mt-4 bg-white dark:bg-gray-700 rounded shadow">
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={() => onSelectModule(module.id)}
    >
      <h3 className="text-lg font-medium text-black dark:text-white">{module.title}</h3>
      <span className="text-black dark:text-white">
        {openModuleId === module.id ? "▲" : "▼"}
      </span>
    </div>
    {openModuleId === module.id && module.lessons && (
      <div className="mt-2">
        {module.lessons.map((lesson) => (
          <p
            key={lesson.id}
            onClick={() => onSelectLesson(lesson.id)}
            className="text-sm text-black dark:text-white cursor-pointer"
          >
            {lesson.title}
          </p>
        ))}
      </div>
    )}
  </div>
);

// Dars tafsilotlari komponenti
const LessonItem = ({ lessonData }) => (
  <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
    {lessonData ? (
      <>
        <h3 className="text-lg font-semibold text-black dark:text-white">{lessonData.title}</h3>
        <p className="text-black dark:text-white">{lessonData.module || "Dars maʼlumoti yoʻq"}</p>
      </>
    ) : (
      <p className="text-black dark:text-white">No lesson selected</p>
    )}
  </div>
);

const Lessons = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const [modulesData, setModulesData] = useState([]);
  const [selectedLessonData, setSelectedLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "uz");

  const navigate = useNavigate();
  const selectedCourse = localStorage.getItem("selectedCoursesIndex") || 1;

  const messages = {
    uz: { selectLesson: "Darslikni tanlang", noModules: "Modullar mavjud emas", lessons: "Darsliklar" },
    en: { selectLesson: "Select a lesson", noModules: "No modules available", lessons: "Lessons" },
    ru: { selectLesson: "Выберите урок", noModules: "Модули недоступны", lessons: "Уроки" },
  };

  // Mavzuni o'zgartirish
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Tilni o'zgartirish
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  // Modullarni olish
  const fetchModulesAndLessons = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://api.eagledev.uz/api/Modules/?course=${selectedCourse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": language,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching modules data");

      const modulesResult = await response.json();
      setModulesData(modulesResult);
      if (modulesResult.length > 0) {
        const firstModule = modulesResult[0];
        const firstLesson = firstModule.lessons?.[0]; // Birinchi modul va darsni tanlash
        if (firstLesson) {
          setSelectedLessonData(firstLesson);
          setOpenModuleId(firstModule.id); // Default modulni ochiq qilish
          localStorage.setItem("selectedLessonsIndex", firstLesson.id);
          localStorage.setItem("selectedModulesIndex", firstModule.id);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Darsni tanlash
  const fetchLessonDetails = async (lessonId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://api.eagledev.uz/api/Lessons/${lessonId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Language": language,
        },
      });

      if (!response.ok) throw new Error("Error fetching lesson details");

      const lessonDetails = await response.json();
      setSelectedLessonData(lessonDetails);
      localStorage.setItem("selectedLessonsIndex", lessonId);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectModule = (moduleId) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    fetchModulesAndLessons();
  }, [theme, language]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3">
        <span className="text-xl font-semibold text-black dark:text-white">Academy</span>
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-black dark:text-white">
            Landing
          </Link>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="dark:text-white dark:bg-gray-800"
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
        <aside className="w-1/4 overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
          {modulesData.length > 0 ? (
            modulesData.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                openModuleId={openModuleId}
                onSelectModule={handleSelectModule}
                onSelectLesson={fetchLessonDetails}
              />
            ))
          ) : (
            <p className="text-black dark:text-white">{messages[language].noModules}</p>
          )}
        </aside>
        <section className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          {selectedLessonData ? (
            <LessonItem lessonData={selectedLessonData} />
          ) : (
            <p className="text-black dark:text-white">{messages[language].selectLesson}</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Lessons;
