import React, { useState, useEffect, useCallback } from "react";
import { FaChevronRight } from "react-icons/fa";
import ProgressBar from "../components/ProgressBar"; // You can create this component, or use a simple div
import Loading from "../components/Loading";

const LessonItem = ({ lessonData, handleLessonToggle }) => (
  <div className="bg-white dark:bg-gray-800 rounded shadow">
    {lessonData ? (
      <>
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {lessonData.title}
        </h3>
        <video className="w-full" src={lessonData.video} controls></video>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={lessonData.completed}
            onChange={() => handleLessonToggle(lessonData.id)} // Trigger the toggle on checkbox change
          />
          <span className="text-black dark:text-white">Mark as Completed</span>
        </label>
      </>
    ) : (
      <p className="text-black dark:text-white">No lesson selected</p>
    )}
  </div>
);

const Lessons = () => {
  const courseName = localStorage.getItem("course");
  const selectedCourse = parseInt(localStorage.getItem("courseId"), 10) || 1;

  const [state, setState] = useState({
    modulesData: [],
    selectedLessonData: null,
    loading: true,
    error: null,
    selectedModuleId: null,
    language: localStorage.getItem("language") || "uz",
    completedLessons: 0,
    courseProgress: 0, // Store the course progress
  });

  // Fetch course progress
  const fetchCourseProgress = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://api.eagledev.uz/api/Course-progress/${selectedCourse}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": state.language,
          },
        }
      );
      const progressData = await response.json();
      setState((prevState) => ({
        ...prevState,
        courseProgress: progressData.progress, // Update course progress
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message }));
    }
  }, [state.language, selectedCourse]);

  // Fetch modules and lessons
  const fetchModulesAndLessons = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

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
      setState((prevState) => ({
        ...prevState,
        modulesData: modulesResult,
        loading: false,
      }));
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: err.message,
        loading: false,
      }));
    }
  }, [state.language, selectedCourse]);

  // Fetch lesson details based on lesson ID
  const fetchLessonDetails = async (lessonId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

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
        completedLessons: prevState.completedLessons + 1,
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

  // Toggle lesson completion status
  const handleLessonToggle = async (lessonId) => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    try {
      const response = await fetch(
        `http://api.eagledev.uz/api/Lessons-progress/${lessonId}/toggle_complete/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Accept-Language": state.language,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error toggling lesson completion");

      const data = await response.json();

      // Update the lesson completion status in state after successful API call
      setState((prevState) => ({
        ...prevState,
        modulesData: prevState.modulesData.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId
              ? { ...lesson, completed: data.is_completed }
              : lesson
          ),
        })),
        courseProgress: data.course_progress, // Update course progress
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, error: err.message }));
    }
  };

  useEffect(() => {
    fetchModulesAndLessons();
    fetchCourseProgress(); // Fetch the course progress when component mounts
  }, [state.language, fetchModulesAndLessons, fetchCourseProgress]);

  useEffect(() => {
    const selectedLessonId = localStorage.getItem("selectedLessonsIndex");
    if (selectedLessonId) {
      fetchLessonDetails(selectedLessonId);
    }
  }, []); // Fetch the selected lesson when the component mounts

  if (state.loading) return <Loading />;
  if (state.error) return <p>Error: {state.error}</p>;

  // Calculate progress based on completed lessons
  const totalLessons = state.modulesData.reduce((acc, module) => acc + module.lessons?.length, 0);
  const progress = state.courseProgress || 0; // Use course progress from API

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3">
        <div className="flex items-center space-x-4">
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

        <div className="relative w-48">
          <div className="bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="absolute top-0 left-0 w-full text-center text-xs text-black dark:text-white">
            {progress}% Completed
          </div>
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
                          type="checkbox"
                          name="lesson"
                          id={lesson.id}
                          checked={lesson.completed} // Ensure the checkbox reflects the completed state
                          onChange={() => handleLessonToggle(lesson.id)} // Toggle lesson completion
                        />
                        <label
                          className="text-sm text-black dark:text-white cursor-pointer"
                          onClick={() => handleLessonSelect(lesson.id)}
                        >
                          {lesson.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No modules available</p>
          )}
        </aside>

        <section className="flex-1 p-4">
          <LessonItem
            lessonData={state.selectedLessonData}
            handleLessonToggle={handleLessonToggle}
          />
        </section>
      </main>
    </div>
  );
};

export default Lessons;
