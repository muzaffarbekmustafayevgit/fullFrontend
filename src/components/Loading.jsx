import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <span className="ml-4 text-blue-600 text-lg font-semibold">Yuklanmoqda...</span>
    </div>
  );
};

export default Loading;
