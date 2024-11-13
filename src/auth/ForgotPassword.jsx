// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Add password reset logic here
    console.log('Password reset email sent to:', email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Forgot Password</h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Enter your email to reset your password.
        </p>
        <form className="space-y-6" onSubmit={handleForgotPassword}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-300">
          Remembered your password? <a href="/login" className="text-blue-600 hover:text-blue-500">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
