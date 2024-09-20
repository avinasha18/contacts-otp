import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      className={`${
        isDarkMode ? "bg-black text-gray-100" : "bg-white text-gray-800"
      } shadow-md z-50 px-5 h-[70px] border-b ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-[30px] font-bold animate-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 bg-clip-text text-transparent">
          <Link to="/">Contact Manager</Link>
        </h1>

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <FaTimes className={`${isDarkMode ? "text-gray-100" : "text-gray-800"}`} size={24} />
            ) : (
              <FaBars className={`${isDarkMode ? "text-gray-100" : "text-gray-800"}`} size={24} />
            )}
          </button>
        </div>

        {/* Links for desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? (
              <FaSun className="text-yellow-400" />
            ) : (
              <FaMoon className="text-gray-600" />
            )}
          </button>
          {isLoggedIn ? (
            <>
              <Link to="/" className="btn">
                Contacts
              </Link>
              <Link to="/sent-messages" className="btn">
                Sent Messages
              </Link>
              <button onClick={handleLogoutClick} className="btn">
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-5">
              <Link to="/login" className="btn">
                Login
              </Link>
              <Link to="/register" className="btn">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'} absolute top-[70px] left-0 w-full  p-4 md:hidden`}
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-600" />
                )}
              </button>
              {isLoggedIn ? (
                <>
                  <Link to="/" className="btn" onClick={toggleMobileMenu}>
                    Contacts
                  </Link>
                  <Link to="/sent-messages" className="btn" onClick={toggleMobileMenu}>
                    Sent Messages
                  </Link>
                  <button
                    onClick={() => {
                      handleLogoutClick();
                      toggleMobileMenu();
                    }}
                    className="btn"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="btn" onClick={toggleMobileMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="btn" onClick={toggleMobileMenu}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
