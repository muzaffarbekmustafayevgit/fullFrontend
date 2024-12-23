import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Mouse from "../components/Mouse";

const Login = () => {
  const [theme, setTheme] = useState("light");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  
  const validateForm = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailPattern)) {
      setError("Invalid email format.");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await fetch("http://api.eagledev.uz/api/user/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.access && data.refresh) {
       
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);

      
          const profileResponse = await fetch(
            "http://api.eagledev.uz/api/user/profile/",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${data.access}`,
              },
            }
          );

          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            const role = profileData?.user_obj?.role;
            localStorage.setItem("userName", profileData.user_obj.username);
            
            const roleRoutes = {
              moderator: "/moderator",
              student: "/courses",
              admin: "/admin",
            };

            navigate(roleRoutes[role] || "/home");
          } else {
            throw new Error("Failed to fetch profile data.");
          }
        } else {
          setError("Login failed. Incorrect credentials.");
        }
      } else {
        const errorMessage = await response.text();
        setError(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Mouse />

      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Sign In
        </h2>
        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            ></label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            ></label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-white"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign in"}
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
