import React from "react";
import { Link } from "react-router-dom";
import { FaWallet, FaUsers, FaCog, FaSignOutAlt } from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="fixed w-1/6 h-full bg-gradient-to-b from-purple-800 to-purple-900 text-white p-6 flex flex-col justify-between shadow-lg">
      {/* Logo Section */}
      <div>
        <div className="mb-10 flex justify-center items-center">
          <div className="w-24 h-24 bg-white rounded-full flex justify-center items-center shadow-md">
            <img
              src="https://via.placeholder.com/80"
              alt="School Logo"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="space-y-8">
            <li className="flex items-center hover:text-gray-300 transition duration-200">
              <Link to="/dashboard" className="flex items-center no-underline">
                <FaWallet className="mr-3 text-white text-lg" />
                <span className="text-sm text-white font-medium">Dashboard</span>
              </Link>
            </li>
            <li className="flex items-center hover:text-gray-300 transition duration-200">
              <Link to="/profile" className="flex items-center no-underline">
                <FaUsers className="mr-3 text-white text-lg" />
                <span className="text-sm text-white font-medium">Profile</span>
              </Link>
            </li>
            <li className="flex items-center hover:text-gray-300 transition duration-200">
              <Link to="/students" className="flex items-center no-underline">
                <FaUsers className="mr-3 text-white text-lg" />
                <span className="text-sm text-white font-medium">Students</span>
              </Link>
            </li>
            <li className="flex items-center hover:text-gray-300 transition duration-200">
              <Link to="/gigs" className="flex items-center no-underline">
                <FaUsers className="mr-3 text-white text-lg" />
                <span className="text-sm text-white font-medium">Gigs</span>
              </Link>
            </li>
            <li className="flex items-center hover:text-gray-300 transition duration-200">
              <Link to="/payment" className="flex items-center no-underline">
                <FaWallet className="mr-3 text-white text-lg" />
                <span className="text-sm text-white font-medium">Payment</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Settings and Logout */}
      <div>
        <ul className="space-y-6">
          <li className="flex items-center hover:text-gray-300 transition duration-200">
            <Link to="/settings" className="flex items-center no-underline">
              <FaCog className="mr-3 text-white text-lg" />
              <span className="text-sm text-white font-medium">Settings</span>
            </Link>
          </li>
          <li className="flex items-center hover:text-gray-300 transition duration-200">
            <Link to="/login" className="flex items-center no-underline">
              <FaSignOutAlt className="mr-3 text-white text-lg" />
              <span className="text-sm  text-white font-medium">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;