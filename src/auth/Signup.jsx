import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [fullname, setFullname] = useState("");
  const [militaryUnit, setMilitaryUnit] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [step, setStep] = useState("signup"); // "signup" yoki "activation"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signupUrl = "http://api.eagledev.uz/api/user/register/";
  const activationUrl = "http://api.eagledev.uz/api/user/activation/";

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(signupUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          email: email,
          password: password,
          full_name: fullname,
          military_unit: militaryUnit,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Roʻyxatdan oʻtishda xatolik yuz berdi.");

      setSuccess("Roʻyxatdan oʻtish muvaffaqiyatli! Hisobni faollashtiring.");
      setStep("activation");
      localStorage.setItem("email", email);
      setError("");
    } catch (err) {
      setError(err.message || "Roʻyxatdan oʻtishda xatolik yuz berdi.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const handleActivation = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(activationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          activation_code: activationCode,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Hisobni faollashtirish muvaffaqiyatsiz bo'ldi.");

      localStorage.setItem("access_token", data.access_token);
      navigateToRole(data.user_obj ? data.user_obj.role : ""); // Foydalanuvchi roliga ko'ra yo'naltirish
      setError("");
    } catch (err) {
      setError(err.message || "Faollashtirishda xatolik yuz berdi.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  const navigateToRole = (role) => {
    const roleRoutes = {
      moderator: "/moderator",
      student: "/courses",
      admin: "/admin",
    };

    // Agar ro'l mavjud bo'lmasa yoki tanilgan ro'llardan bo'lmasa, /home ga yo'naltirish
    navigate(roleRoutes[role] || "/home");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {step === "signup" ? (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Roʻyxatdan oʻtish
            </h2>
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Ism
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Familya
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Harbiy qism raqami
                </label>
                <input
                  type="number"
                  value={militaryUnit}
                  onChange={(e) => setMilitaryUnit(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  autoComplete="true"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Parol
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Kutilmoqda..." : "Roʻyxatdan oʻtish"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
              Hisobni Faollashtirish
            </h2>
            <form className="space-y-6" onSubmit={handleActivation}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faollashtirish kodi
                </label>
                <input
                  type="text"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  required
                  className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Kutilmoqda..." : "Faollashtirish"}
              </button>
            </form>
          </>
        )}
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {success && <p className="text-sm text-center text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default Signup;
