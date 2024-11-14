import { useState, useEffect } from "react";

const Loading = () => {
  // Dark/light theme'ni boshqarish uchun useState va useEffect
  const [theme, setTheme] = useState("light");

  // Mavjud theme'ni o'zgartirish uchun toggleTheme funksiyasi
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Komponent ishga tushganida, foydalanuvchi tanlagan tema saqlanadi
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-16 h-16 border-4 border-blue-500 dark:border-white border-t-transparent dark:border-t-gray-900 border-solid rounded-full animate-spin"></div>
      <span className="ml-4 text-blue-600 text-lg dark:text-white font-semibold">
        Yuklanmoqda...
      </span>
      {/* Tema almashtirish tugmasi */}
      {/* <button 
        onClick={toggleTheme} 
        className="absolute top-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        {theme === "light" ? "Dark" : "Light"} Rejim
      </button> */}
    </div>
  );
};

export default Loading;
