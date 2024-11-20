import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

// Component for each module
const ModuleItem = ({ module, openModuleId, onSelectModule, onSelectLesson }) => {
  return (
    <div key={module.id} className="p-2 bg-white dark:bg-gray-700 rounded shadow">
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
};

// Component for displaying a selected lesson
const LessonItem = ({ lessonData }) => {
  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-lg font-semibold text-black dark:text-white">{lessonData.title}</h3>
      <p className="text-black dark:text-white mt-2">{lessonData.content}</p>
    </div>
  );
};

// Main Lessons component
const Lessons = () => {
  const [theme, setTheme] = useState("dark");
  const [modulesData, setModulesData] = useState([]);
  const [selectedLessonData, setSelectedLessonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem("language") || "uz");

  const navigate = useNavigate();
  const selectedCourse = localStorage.getItem("selectedCoursesIndex") || 1;

  const messages = {
    uz: {
      selectLesson: "Darslikni tanlang",
      noModules: "Modullar mavjud emas",
      lessons: "Darsliklar",
    },
    en: {
      selectLesson: "Select a lesson",
      noModules: "No modules available",
      lessons: "Lessons",
    },
    ru: {
      selectLesson: "Выберите урок",
      noModules: "Модули недоступны",
      lessons: "Уроки",
    },
  };

  // Language change handler
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Fetch modules and lessons data with language header
  const fetchModulesAndLessons = async () => {
    const token = localStorage.getItem("access_token");
    const currentLanguage = localStorage.getItem("language") || "uz"; // Get current language

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
            "Accept-Language": currentLanguage, 
          },
        }
      );
      if (!response.ok) throw new Error("Error fetching modules data");

      const modulesResult = await response.json();
      setModulesData(modulesResult);

      if (modulesResult.length > 0 && modulesResult[0].lessons.length > 0) {
        const firstLesson = modulesResult[0].lessons[0];
        setSelectedLessonData(firstLesson); 
        localStorage.setItem("selectedLessonsIndex", firstLesson.id); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const selectedLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem("access_token");
      const currentLanguage = localStorage.getItem("language") || "uz"; 

      const response = await fetch(
        `http://api.eagledev.uz/api/Lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": currentLanguage, 
          },
        }
      );
      if (!response.ok) throw new Error("Error fetching lesson details");

      const lessonDetails = await response.json();
      setSelectedLessonData(lessonDetails);
      localStorage.setItem("selectedLessonsIndex", lessonId);
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const handleSelectModule = (moduleId) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
    localStorage.setItem("selectedModulesIndex", moduleId);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    fetchModulesAndLessons();
  }, [language]);

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-around bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a className="text-xl font-semibold w-7/12 text-black dark:text-white">Academy</a>
        <div className="flex items-center space-x-5">
          <Link className="text-black dark:text-white" to="/">Landing</Link>
          <div className="bg-transparent">
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
          </div>
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col sm:flex-row">
        <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4">
          {modulesData.length > 0 ? (
            modulesData.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                openModuleId={openModuleId}
                onSelectModule={handleSelectModule}
                onSelectLesson={selectedLesson}
              />
            ))
          ) : (
            <p className="text-black dark:text-white">{messages[language].noModules}</p>
          )}
        </aside>

        <section className="flex flex-1 items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            {messages[language].lessons}
          </h2>
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
