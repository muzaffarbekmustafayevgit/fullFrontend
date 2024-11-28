import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { FaChevronRight } from "react-icons/fa";

const LessonItem = ({ lessonData }) => (
  <div className="bg-white dark:bg-gray-800 rounded shadow">
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
    selectedModuleId: null, // Track the selected module
    language: localStorage.getItem("language") || "uz",
  });

  const navigate = useNavigate();
  const selectedCourse = parseInt(localStorage.getItem("courseId"), 10) || 1;
  const messages = {
    uz: {
      selectLesson: "Darslikni tanlang",
      noModules: "Modullar mavjud emas",
    },
    en: {
      selectLesson: "Select a lesson",
      noModules: "No modules available",
    },
    ru: {
      selectLesson: "Выберите урок",
      noModules: "Модули недоступны",
    },
  };

  // Fetch modules and lessons
  const fetchModulesAndLessons = useCallback(async () => {
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
            "Accept-Language": state.language,
          },
        }
      );
      if (!response.ok) throw new Error("Error fetching modules data");
      const modulesResult = await response.json();
      setState((prevState) => {
        return { ...prevState, modulesData: modulesResult, loading: false };
      });
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message, loading: false }));
    }
  }, [state.language, selectedCourse]);

  // Fetch lesson details based on lesson ID
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

  // Handle module selection change
  const handleModuleSelect = (moduleId) => {
    setState((prevState) => ({
      ...prevState,
      selectedModuleId: moduleId,
      selectedLessonData: null, // Reset selected lesson when module changes
    }));
  };

  // Handle lesson selection
  const handleLessonSelect = (lessonId) => {
    fetchLessonDetails(lessonId);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme === "dark");
    fetchModulesAndLessons();
  }, [state.theme, state.language, fetchModulesAndLessons]);

  useEffect(() => {
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
            onChange={(e) => {
              setState((prevState) => ({
                ...prevState,
                language: e.target.value,
              }));
              localStorage.setItem("language", e.target.value);
            }}
            className="dark:text-white dark:bg-gray-800"
          >
            <option value="uz">O'zbekcha</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </header>
      <main className="flex flex-1">
        <aside className="w-1/4 overflow-auto p-4 bg-gray-100 dark:bg-gray-800">
          {state.modulesData.length > 0 ? (
            state.modulesData.map((module) => (
              <div
                key={module.id}
                className={`p-2 mt-4 bg-white dark:bg-gray-700 rounded shadow ${
                  module.id === state.selectedModuleId ? "bg-blue-100" : ""
                }`}
              >
                <h3
                  className="text-lg font-medium text-black dark:text-white cursor-pointer"
                  onClick={() => handleModuleSelect(module.id)}
                >
                  {module.title}
                </h3>
                {module.id === state.selectedModuleId && (
                  <div>
                    {module.lessons?.map((lesson) => (
                      <div key={lesson.id}>
                        <input
                          type="radio"
                          name="lesson"
                          id={lesson.id}
                          onChange={() => handleLessonSelect(lesson.id)}
                        />
                        <label className="text-sm text-black dark:text-white cursor-pointer" onClick={() => handleLessonSelect(lesson.id)}>
                          {lesson.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-black dark:text-white">
              {messages[state.language].noModules}
            </p>
          )}
        </aside>
        <section className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
          <p className="dark:text-white font-semibold">
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
