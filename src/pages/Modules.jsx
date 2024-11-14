import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import Languages from "../components/Languages";
import { Link } from "react-router-dom";
function Modules() {
  const navigate = useNavigate();
  const location = useLocation();
  const { category, index } = location.state || {};
  const [theme, setTheme] = useState("dark");
  const [module, setModule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      // Agar token bo'lmasa, foydalanuvchini login sahifasiga yo'naltirish
      navigate("/login");
    } else {
      // Token mavjud bo'lsa, ma'lumotlarni yuklash
      const fetchData = async () => {
        try {
          const response = await fetch(`http://api.eagledev.uz/api/Courses/${index+1}`);
          if (!response.ok)
            throw new Error("Ma'lumotlarni olishda xatolik yuz berdi");

          const result = await response.json();
          // console.log(result.modules); // Ma'lumotni tahlil qilish uchun log
          setModule(result);
          // console.log(result.json());
          // `modules` massivini olish
          // if (result.modules && Array.isArray(result.modules)) {
          //   setModules(result.modules);
          // } else { 
          //   throw new Error("Modullar topilmadi");
          // }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [navigate, index]);

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

  if (loading) return <Loading />;
  // if (error) return <p className="text-red-500">Xatolik: {error}</p>;

  return (
    <>
      <div className="h-screen flex flex-col">
        <header className="flex items-center justify-around bg-white dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-500">
          <a
            className="text-xl font-semibold w-7/12 text-black dark:text-white"
            href="#"
          >
            Academy
          </a>
          <div className="flex items-center space-x-5">
            <Link className="text-black dark:text-white" to={"/"}>
              Landing
            </Link>
            <p className="text-black dark:text-white" id="profile">
              <Languages />
            </p>
            <button onClick={toggleTheme} className="text-xl">
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-col sm:flex-row">
          <aside className="w-full sm:w-1/5 bg-gray-100 dark:bg-gray-800 p-4"></aside>

          <section className="flex-1 bg-white dark:bg-gray-900 p-4">
            <div className="p-4">
              <h3 className="text-lg dark:text-white font-semibold mb-4">
                Modullar:
              </h3>
              <div className="max-h-[550px] overflow-y-scroll grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {module.modules.map(item => (
        <div key={item.id} className="border rounded px-2 py-3 dark:text-white dark:bg-gray-700 cursor-pointer hover:bg-gray-200"
        >
          <h3>{item.title}</h3>
          <p>Order: {item.order}</p>
        </div>
      ))}
                
              </div> 
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Modules;
