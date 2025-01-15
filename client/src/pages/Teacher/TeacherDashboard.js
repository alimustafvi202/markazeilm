import React from "react";
import Sidebar from "../Major/Sidebar";
import {
  FaUser,
  FaChalkboardTeacher,
  FaUsers,
  FaSearch,
  FaTachometerAlt,
  FaBook,
  FaWallet,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaGraduationCap,
  FaEllipsisV,
} from "react-icons/fa";
import "react-circular-progressbar/dist/styles.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 bg-gradient-to-b from-gray-100 via-white to-gray-200 md:ml-[250px]">
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700">
            Welcome back, Admin
          </h2>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative">
              <FaSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border rounded-lg text-gray-600 w-full md:w-auto"
              />
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Overview Section */}
        <section className="p-4 bg-gradient-to-b from-purple-200 via-white to-blue-200 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Overview
            </h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-600 bg-white shadow-sm">
              <option>2023/2024</option>
              <option>2022/2023</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Cards */}
            {[
              {
                icon: <FaGraduationCap className="text-2xl text-purple-600" />,
                bg: "bg-purple-100",
                count: "4,588",
                label: "Total Students",
              },
              {
                icon: (
                  <FaChalkboardTeacher className="text-2xl text-purple-600" />
                ),
                bg: "bg-purple-100",
                count: "34",
                label: "Total Teachers",
              },
              {
                icon: <FaUsers className="text-2xl text-red-500" />,
                bg: "bg-red-100",
                count: "1,545",
                label: "Total Parents",
              },
            ].map(({ icon, bg, count, label }, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center`}
                  >
                    {icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-lg md:text-xl font-bold text-gray-800">
                      {count}
                    </p>
                    <p className="text-sm text-gray-500">{label}</p>
                  </div>
                </div>
                <div className="text-gray-400">
                  <FaEllipsisV />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Registrations and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-lg md:text-2xl font-bold">Registrations</h1>
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-gray-600">Name</th>
                    <th className="py-2 text-gray-600">Class</th>
                    <th className="py-2 text-gray-600">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Justina Ifidan</td>
                    <td className="py-2">JSS1</td>
                    <td className="py-2">F</td>
                  </tr>
                  <tr>
                    <td className="py-2">Victor Akubugo</td>
                    <td className="py-2">SS1</td>
                    <td className="py-2">M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-6 bg-gradient-to-br from-purple-800 to-purple-600 rounded-lg shadow-md text-white">
            <h3 className="font-bold text-lg md:text-xl">Events</h3>
            <ul className="mt-4 space-y-3">
              <li className="bg-purple-500 rounded-lg p-2 text-sm flex justify-between items-center">
                <span>Interhouse Sport</span>
                <span className="text-xs">12:30 PM</span>
              </li>
              <li className="bg-purple-500 rounded-lg p-2 text-sm flex justify-between items-center">
                <span>Teachers Training</span>
                <span className="text-xs">9:30 AM</span>
              </li>
              <li className="bg-purple-500 rounded-lg p-2 text-sm flex justify-between items-center">
                <span>Parents Come-In</span>
                <span className="text-xs">12:30 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payments */}
        <section className="mt-8 p-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-lg md:text-2xl font-bold text-gray-700">
            Payments
          </h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-gray-600">Name</th>
                  <th className="py-2 text-gray-600">Description</th>
                  <th className="py-2 text-gray-600">Amount</th>
                  <th className="py-2 text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Mr. Joseph Achibong</td>
                  <td className="py-2">School Fees</td>
                  <td className="py-2">N350,000</td>
                  <td className="py-2">12/04/2023</td>
                </tr>
                <tr>
                  <td className="py-2">Mrs. Victoria Ihechukwude</td>
                  <td className="py-2">Complete School Uniform</td>
                  <td className="py-2">N230,000</td>
                  <td className="py-2">12/04/2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
