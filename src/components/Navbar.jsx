// src/components/NavBar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      
    sessionStorage.setItem('mode',"light")
    } else {
      document.documentElement.classList.add('dark');
      
    sessionStorage.setItem('mode',"dark")
    }
  };

  const handleLogout = () => {
    // Clear user data (e.g., tokens, user info)
    localStorage.removeItem('user'); // Example: remove user data from local storage
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            <Link to="/">Logo</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-800 dark:text-white">Home</Link>
            <Link to="/about" className="text-gray-800 dark:text-white">About</Link>
            <Link to="/contact" className="text-gray-800 dark:text-white">Contact</Link>
            <Link to="/login" className="text-gray-800 dark:text-white">Login</Link>
            <Link to="/signup" className="text-gray-800 dark:text-white">Sign Up</Link>
            <button
              onClick={toggleDarkMode}
              className="text-gray-800 dark:text-white px-2 py-1 rounded-md"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="text-red-600 dark:text-red-400 px-2 py-1 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
