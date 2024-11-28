import React from "react";

const ProgressBar = ({ courseName="js", progress=23 }) => {
  return (
    <div className= "w-1/3  bg-gray-800 p-4 rounded-lg text-white ">
      {/* Kurs nomi */}
      <p className="font-semibold text-xl mb-2">{courseName}</p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-600 rounded h-3">
        <div
          style={{ width: `${progress}%` }}
          className="bg-blue-600 h-3 rounded"
        ></div>
      </div>

      {/* Foiz va holat */}
      <p className="mt-2 text-sm">{progress}% Tugatildi</p>
    </div>
  );
};

export default ProgressBar;
