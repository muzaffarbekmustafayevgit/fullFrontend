import React, { useState, useEffect } from "react";

const ProgressBar = ({ courseId, courseName }) => {
  const [progress, setProgress] = useState(0);
  const [courseTitle, setCourseTitle] = useState(courseName || "Course Title");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token"); // Retrieve the access token

  useEffect(() => {
    if (!courseId || !token) {
      setError("Course ID or access token is missing");
      setLoading(false);
      return;
    }

    // Fetch course progress data with authentication
    const fetchCourseProgress = async () => {
      try {
        const response = await fetch(
          `http://api.eagledev.uz/api/Course-progress/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,  // Include the token in the Authorization header
            },
          }
        );
       
        if (!response.ok) throw new Error("Failed to fetch course progress");

        const data = await response.json();
        setProgress(data.progress || 0); // Set progress
        setCourseTitle(data.title || courseName); // Set course title
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourseProgress();
  }, [courseId, token, courseName]); // Re-run the effect if courseId or courseName changes

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="w-1/3 bg-gray-800 p-4 rounded-lg text-white">
      {/* Course Title */}
      <p className="font-semibold text-xl mb-1">{courseTitle}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-600 rounded h-3">
        <div  
          style={{ width: `${progress}%` }}
          className="bg-blue-600 h-3 rounded"
        ></div>
      </div>

      {/* Percentage and Status */}
      <p className="mt-2 text-sm">{progress}% Completed</p>
    </div>
  );
};

export default ProgressBar;
