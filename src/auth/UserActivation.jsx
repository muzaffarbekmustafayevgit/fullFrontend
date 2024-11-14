import React from "react";
import { useState } from "react";
function UserActivation() {
  const savedEmail = localStorage.getItem("email");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const url = "http://api.eagledev.uz/api/user/activation/";

  const handleActivate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed. Please try again.");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      setSuccess("Signup successful!");
      setError(""); // clear any previous error message
    } catch (err) {
      console.error("Signup failed:", err);
      setError("Signup failed. Please try again.");
      setSuccess(""); // clear any previous success message
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">
          Sign Up
        </h2>
        <form className="space-y-6" onSubmit={handleActivate}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={savedEmail}
              onChange={(e) => setEmail(savedEmail)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        </form>
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        {success && (
          <p className="text-sm text-center text-green-500">{success}</p>
        )}
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:text-blue-500">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

export default UserActivation;
