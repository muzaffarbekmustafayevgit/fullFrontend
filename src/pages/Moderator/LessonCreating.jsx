import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import qs from "qs"; // Install this package to encode data

function LessonCreating() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titleUz: "",
    titleEn: "",
    titleRu: "",
    descriptionUz: "",
    descriptionEn: "",
    descriptionRu: "",
    duration: 0,
    lessonOrder: 0,
    isOpen: false,
    video: null, // For file upload
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
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        video: e.target.files[0], // Store the uploaded file
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");
      const moduleId = localStorage.getItem("createdModulesId");

      if (!accessToken || !moduleId) {
        throw new Error("Token yoki modul ID mavjud emas. Iltimos, tizimga kiring.");
      }

      // Prepare the form data to send
      const dataToSend = new FormData();
      dataToSend.append("module", moduleId);
      dataToSend.append("title_uz", formData.titleUz);
      dataToSend.append("title_en", formData.titleEn);
      dataToSend.append("title_ru", formData.titleRu);
      dataToSend.append("description_uz", formData.descriptionUz);
      dataToSend.append("description_en", formData.descriptionEn);
      dataToSend.append("description_ru", formData.descriptionRu);
      dataToSend.append("duration", formData.duration);
      dataToSend.append("lesson_order", formData.lessonOrder);
      dataToSend.append("is_open", formData.isOpen);
      
      // Add the video file if present
      if (formData.video) {
        dataToSend.append("video", formData.video);
      }

      const response = await fetch("http://api.eagledev.uz/api/Lessons/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: dataToSend,
      });

      // Check for the response status
      const responseText = await response.text();
      const responseData = JSON.parse(responseText);

      if (!response.ok) {
        throw new Error(`Dars yaratishda xatolik: ${responseData.message || "Noma'lum xato"}`);
      }

      console.log("Dars muvaffaqiyatli yaratildi:", responseData);
      alert("Dars muvaffaqiyatli yaratildi!");
      // navigate("/lessons"); // Redirect to lessons page

    } catch (error) {
      setError(error.message);
      console.error("Dars yaratishda xatolik:", error);
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
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Dars yaratish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars nomi (Uzbekcha)</label>
              <input
                type="text"
                name="titleUz"
                value={formData.titleUz}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Dars nomini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars nomi (English)</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Enter the lesson title in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars nomi (Русский)</label>
              <input
                type="text"
                name="titleRu"
                value={formData.titleRu}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                maxLength={255}
                placeholder="Введите название урока на русском"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars tavsifi (Uzbekcha)</label>
              <textarea
                name="descriptionUz"
                value={formData.descriptionUz}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Dars tavsifini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars tavsifi (English)</label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Enter the lesson description in English"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars tavsifi (Русский)</label>
              <textarea
                name="descriptionRu"
                value={formData.descriptionRu}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                placeholder="Введите описание урока на русском"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Davomiyligi (minutlarda)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                min={0}
                placeholder="Dars davomiyligini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars tartibi</label>
              <input
                type="number"
                name="lessonOrder"
                value={formData.lessonOrder}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                min={0}
                placeholder="Dars tartibini kiriting"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white">Dars video fayli</label>
              <input
                type="file"
                name="video"
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border rounded"
                accept="video/mp4"
              />
            </div>
            <div>
              <label className="inline-flex items-center mt-2">
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={formData.isOpen}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                <span className="ml-2">Dars ochiqmi?</span>
              </label>
            </div>
            <button type="submit" className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
              Dars yaratish
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default LessonCreating;
