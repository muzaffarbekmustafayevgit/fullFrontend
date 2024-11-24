import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import qs from "qs";  // Install this package to encode data

function ModuleCreating() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titleUz: "",
    titleEn: "",
    titleRu: "",
    moduleOrder: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dark/light mode state
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Check localStorage for theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to the body element
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    // Save the theme preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const courseId = localStorage.getItem("createdCoursesId");

      if (!accessToken || !courseId) {
        throw new Error("Token yoki kurs ID mavjud emas. Iltimos, tizimga kiring.");
      }

      // Prepare the form data as URL-encoded string using qs
      const dataToSend = qs.stringify({
        title_uz: formData.titleUz,
        title_en: formData.titleEn,
        title_ru: formData.titleRu,
        course: courseId,
        module_order: formData.moduleOrder,
      });

      // Log the request data for debugging
      console.log("Sending data to the server:", dataToSend);

      const response = await fetch("http://api.eagledev.uz/api/Modules/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: dataToSend
      });

      // Read the response as text
      const responseText = await response.text();
      console.log("Received response as text:", responseText);

      // Parse the response body as JSON
      const responseData = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(`Modul yaratishda xatolik: ${responseData.message || "Noma'lum xato"}`);
      }

      console.log("Modul muvaffaqiyatli yaratildi:", responseData);
      localStorage.setItem("createdModulesId", responseData.id);
      alert("Modul muvaffaqiyatli yaratildi!");
      if (response.status === 201) {
        return navigate('/course/course-creating/module-creating/lesson-creating');
      }

    } catch (error) {
      setError(error.message);
      console.error("Modul yaratishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Yuklanmoqda...</p>;
  if (error) return <p className="text-red-500">Xatolik: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a className="text-xl font-semibold text-black dark:text-white" href="#">
          Academy
        </a>
        
        
        <button onClick={handleThemeToggle} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
      </header>

      <main className="flex flex-1 flex-col sm:flex-row">
        <section className="flex-1 bg-white dark:bg-gray-950 p-4 text-black dark:text-white">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Modul yaratish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Modul nomi (Uzbekcha)</label>
              <input
                type="text"
                name="titleUz"
                value={formData.titleUz}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Modul nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Modul nomi (English)</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Enter the module title in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Modul nomi (Русский)</label>
              <input
                type="text"
                name="titleRu"
                value={formData.titleRu}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Введите название модуля на русском"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Modul tartibi</label>
              <input
                type="number"
                name="moduleOrder"
                value={formData.moduleOrder}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                min={0}
                placeholder="Modul tartibini kiriting"
              />
            </div>
            <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
              Modul yaratish
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default ModuleCreating;
