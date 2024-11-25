import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

import { FaChevronRight } from "react-icons/fa";
const ModuleItem = ({
  module,
  openModuleId,
  onSelectModule,
  onSelectLesson,
}) => (
  <div className="p-2 mt-4 bg-white dark:bg-gray-700 rounded shadow">
    <div
      className="flex justify-between items-center cursor-pointer"
      onClick={() => onSelectModule(module.id)}
    >
      <h3 className="text-lg font-medium text-black dark:text-white">
        {module.title}
      </h3>
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

const LessonItem = ({ lessonData }) => (
  <div className=" bg-white dark:bg-gray-800 rounded shadow">
    {lessonData ? (
      <>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {lessonData.title}
        </h3>
        <video className="w-4/5" src={lessonData.video} controls></video>
      </>
    ) : (
      <p className="text-black dark:text-white">No lesson selected</p>
    )}
  </div>
);

const Lessons = () => {
  const courseName = localStorage.getItem("course");
  const [state, setState] = useState({
    theme: localStorage.getItem("theme") || "dark",
    modulesData: [],
    selectedLessonData: null,
    loading: true,
    error: null,
    openModuleId: null,
    language: localStorage.getItem("language") || "uz",
  });

  const navigate = useNavigate();
  const selectedCourse = parseInt(
    localStorage.getItem("courseId"),
    10
  ); // Ensure it's a number
  // Default to 1 if selectedCourse is invalid
  const validCourse = isNaN(selectedCourse) ? 1 : selectedCourse;

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

  // Mavzuni o'zgartirish
  const toggleTheme = () => {
    const newTheme = state.theme === "light" ? "dark" : "light";
    setState((prevState) => ({
      ...prevState,
      theme: newTheme,
    }));
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Tilni o'zgartirish
  const handleLanguageChange = (event) => {
    const selectedLanguage = event.target.value;
    setState((prevState) => ({
      ...prevState,
      language: selectedLanguage,
    }));
    localStorage.setItem("language", selectedLanguage);
  };

  // Modullarni olish
  const fetchModulesAndLessons = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://api.eagledev.uz/api/Modules/?course=${validCourse}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": state.language,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching modules data");

      const modulesResult = await response.json();
      setState((prevState) => {
        if (modulesResult.length > 0) {
          const firstModule = modulesResult[0];
          const firstLesson = firstModule.lessons?.[0]; // Select the first lesson by default
          if (firstLesson) {
            localStorage.setItem("selectedLessonsIndex", firstLesson.id);
            localStorage.setItem("selectedModulesIndex", firstModule.id);
          }
        }
        return { ...prevState, modulesData: modulesResult, loading: false };
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        loading: false,
      }));
    }
  }, [state.language, validCourse]);

  // Darsni tanlash
  const fetchLessonDetails = async (lessonId) => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://api.eagledev.uz/api/Lessons/${lessonId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": state.language,
          },
        }
      );

      if (!response.ok) throw new Error("Error fetching lesson details");

      const lessonDetails = await response.json();
      setState((prevState) => ({
        ...prevState,
        selectedLessonData: lessonDetails,
      }));
      localStorage.setItem("selectedLessonsIndex", lessonId);
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message }));
    }
  };

  const handleSelectModule = (moduleId) => {
    setState((prevState) => ({
      ...prevState,
      openModuleId: prevState.openModuleId === moduleId ? null : moduleId,
    }));
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    fetchModulesAndLessons();
  }, [state.theme, state.language, fetchModulesAndLessons]);

  useEffect(() => {
    // If there is a selected lesson in localStorage, fetch its details
    const selectedLessonId = localStorage.getItem("selectedLessonsIndex");
    if (selectedLessonId) {
      fetchLessonDetails(selectedLessonId);
    }
  }, []); // Fetch the selected lesson when the component mounts

  if (state.loading) return <Loading />;
  if (state.error) return <p>Error: {state.error}</p>;

  const userName = localStorage.getItem("userName");
  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3">
        <span className="text-xl font-semibold text-black dark:text-white">
          Academy
        </span>
        <div className="flex items-center space-x-4">
          <p className="text-black dark:text-white">{userName}</p>
          <select
            value={state.language}
            onChange={handleLanguageChange}
            className="dark:text-white dark:bg-gray-800"
          >
            <option value="uz">O'zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
          <button onClick={toggleTheme} className="text-xl">
            {state.theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>
      <main className="flex flex-1">
        <aside className="w-1/4 overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
          {state.modulesData.length > 0 ? (
            state.modulesData.map((module) => (
              <ModuleItem
                key={module.id}
                module={module}
                openModuleId={state.openModuleId}
                onSelectModule={handleSelectModule}
                onSelectLesson={fetchLessonDetails}
              />
            ))
          ) : (
            <p className="text-black dark:text-white">
              {messages[state.language].noModules}
            </p>
          )}
        </aside>
        <section className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className=" dark:text-white font-semibold">
            Kurslar{" "}
            <FaChevronRight className="dark:text-white right-0 inline-block " />{" "}
            {courseName}
          </p>
          {state.selectedLessonData ? (
            <LessonItem lessonData={state.selectedLessonData} />
          ) : (
            <p className="text-black dark:text-white">
              {messages[state.language].selectLesson}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Lessons;
