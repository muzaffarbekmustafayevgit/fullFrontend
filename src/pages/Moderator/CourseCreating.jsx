import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTelegramPlane, FaYoutube, FaInstagram, FaFacebook, FaHome, FaChevronRight } from "react-icons/fa";
import { MdOutlineOndemandVideo } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import Loading from "../../components/Loading";

function CourseCreating() {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [theme, setTheme] = useState("dark");
  const [formData, setFormData] = useState({
    titleUz: "",
    titleEn: "",
    titleRu: "",
    descriptionUz: "",
    descriptionEn: "",
    descriptionRu: "",
    moderator: "",
    image: null,
    isPublished: false,
    price: 0,
    isFree: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0]
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // FormData obyektini yaratish
    const formDataToSend = new FormData();

    // Oddiy maydonlarni qo'shish
    formDataToSend.append("title_uz", formData.titleUz || '');
    formDataToSend.append("title_en", formData.titleEn || '');
    formDataToSend.append("title_ru", formData.titleRu || '');
    formDataToSend.append("description_uz", formData.descriptionUz || '');
    formDataToSend.append("description_en", formData.descriptionEn || '');
    formDataToSend.append("description_ru", formData.descriptionRu || '');
    formDataToSend.append("is_published", formData.isPublished);
    formDataToSend.append("price", formData.price.toString() || '0');
    formDataToSend.append("is_free", formData.isFree);
    formDataToSend.append("moderator", userName || ''); // Moderatorni localStorage'dan olish

    // Faylni qo'shish (agar mavjud bo'lsa)
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Token mavjud emas. Iltimos, tizimga kiring.");
      }

      // API'ga POST so'rovini yuborish
      const response = await fetch("http://api.eagledev.uz/api/Courses/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`, // Bearer token
        },
        body: formDataToSend, // FormData obyektini yuboramiz
      });

      // Agar serverdan muvaffaqiyatli javob olmasak
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Kurs yaratishda xatolik: ${errorData.message || "Noma'lum xato"}`);
      }

      const result = await response.json();
      console.log("Kurs muvaffaqiyatli yaratildi:", result);
      localStorage.setItem("createdCoursesId",result.id)
        // Konsolga javobni chiqarish
      alert("Kurs muvaffaqiyatli yaratildi!");
     if(response.status===201){
      return navigate('/course/course-creating/module-creating')
     }
    } catch (error) {
      setError(error.message); // Xatolikni ko'rsatish
      console.error("Kurs yaratishda xatolik:", error);
    } finally {
      setLoading(false); // Yuklanish holatini tugatish
    }
  };

  if (loading) return      <Loading/>
  if (error) return <p className="text-red-500">Xatolik: {error}</p>;

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
        <a className="text-xl font-semibold text-black dark:text-white" href="#">
          Academy
        </a>
        <div className="flex items-center space-x-5">
          <p className="text-black dark:text-white">{userName}</p>
          <button onClick={toggleTheme} className="text-xl">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col sm:flex-row">
        <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col justify-between space-y-4">
          <ul className="space-y-4 w-full">
            <li className="flex items-center w-full">
              <Link to={'/moderator'} className="w-11/12 flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <FaHome className="dark:text-white" />
                Yaratilgan kurslar
              </Link>
            </li>
            <li className="w-11/12">
              <a href="#" className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <MdOutlineOndemandVideo className="dark:text-white" />
                Kurs yaratish <FaChevronRight className="dark:text-white right-0" />
              </a>
            </li>
            <li className="w-11/12">
              <a href="#" className="flex items-center gap-2 p-2 rounded dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                <CgProfile className="dark:text-white" />
                Profil
              </a>
            </li>
          </ul>
        </aside>

        <section className="flex-1 bg-white dark:bg-gray-950 p-4 text-black dark:text-white">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">Kurs yaratish</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-black dark:text-white">Title [uz] *</label>
              <input
                type="text"
                name="titleUz"
                value={formData.titleUz}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">Title [en]</label>
              <input
                type="text"
                name="titleEn"
                value={formData.titleEn}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">Title [ru]</label>
              <input
                type="text"
                name="titleRu"
                value={formData.titleRu}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Description [uz] *</label>
              <textarea
                name="descriptionUz"
                value={formData.descriptionUz}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">Description [en]</label>
              <textarea
                name="descriptionEn"
                value={formData.descriptionEn}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="text-black dark:text-white">Description [ru]</label>
              <textarea
                name="descriptionRu"
                value={formData.descriptionRu}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Is Published?</label>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Is Free?</label>
              <input
                type="checkbox"
                name="isFree"
                checked={formData.isFree}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
            </div>

            <div>
              <label className="text-black dark:text-white">Image</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white"
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Kursni yaratish
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default CourseCreating;
