import React, { useState } from "react";
import { useLocation } from "react-router-dom";  // Import useLocation from react-router-dom

const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();  // Get the current route

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isLoginPage = location.pathname === '/';
  const isSignupPage = location.pathname === '/teachersignup' || location.pathname === '/studentsignup';
  

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-purple-600">Markaz e Ilm</div>
        {/* Explore Text hidden on mobile */}
        <div className="hidden md:block mx-5 text-lg text-gray-600">Explore</div>

        {/* Search Bar (hidden on mobile) */}
        <div className="hidden md:flex flex-1 ml-[-40px]">
          <input
            type="text"
            placeholder="Search for courses"
            className="w-full px-4 py-2 border rounded-3xl focus:outline-none focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Links and Right-Side Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="/categories" className="text-gray-600 hover:text-purple-600 mx-4 no-underline">
            Bussiness Technik Nest
          </a>
          <a
            href="/cart"
            className="text-gray-600 hover:text-purple-600 flex items-center mx-4 no-underline"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 3h18l-2 13H5L3 3zm3 16a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4z"
              ></path>
            </svg>
          </a>
          {/* Login Link */}
          <a
            href="/"
            className={`px-4 py-2 rounded-lg transition duration-200 no-underline
              ${isLoginPage ? 'bg-purple-700 text-white' : 'bg-transparent border border-black text-black'}`}
          >
            Login
          </a>
          {/* Signup Link */}
          <a
            href="/choose"
            className={`px-4 py-2 rounded-lg transition duration-200 no-underline
              ${isSignupPage ? 'bg-purple-700 text-white' : 'bg-transparent border border-black text-black'}`}
          >
            Signup
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 py-2 space-y-2">
          <input
            type="text"
            placeholder="Search for courses"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />
          <a
            href="/categories"
            className="block text-gray-600 hover:text-purple-600 no-underline"
          >
            Categories
          </a>
          <a href="https://techniknest.tech" className="block text-gray-600 hover:text-purple-600 no-underline">
            Bussiness Technik Nest
          </a>
          <a href="/cart" className="block text-gray-600 hover:text-purple-600 no-underline">
            Cart
          </a>
          {/* Add Login and Signup for mobile */}
          <div className="flex justify-between space-x-4">
            <a
              href="/"
              className={`px-4 py-2 rounded-lg transition duration-200 no-underline
                ${isLoginPage ? 'bg-purple-700 text-white' : 'bg-transparent border border-black text-black'}`}
            >
              Login
            </a>
            <a
              href="/signup"
              className={`px-4 py-2 rounded-lg transition duration-200 no-underline
                ${isSignupPage ? 'bg-purple-700 text-white' : 'bg-transparent border border-black text-black'}`}
            >
              Signup
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
