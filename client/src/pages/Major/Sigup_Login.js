import React from "react";
import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate } from "react-icons/fa"; // Importing icons
import Bg from '../../assets/bg.jpg';
import Nav from "./Nav";

const Login = () => {
  return (
    <>
      <Nav />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${Bg})`,
        }}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Choose</h2>

          <div className="space-y-4">
            <Link
              to="/teachersignup"  // Linking to the signup page for Teacher
              className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 block text-center flex items-center justify-center gap-3 no-underline"
            >
              <FaChalkboardTeacher size={20} />  {/* Teacher Icon */}
              Continue as Teacher
            </Link>

            <Link
              to="/studentsignup"  // Linking to the signup page for Student
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 block text-center flex items-center justify-center gap-3 no-underline"
            >
              <FaUserGraduate size={20} />  {/* Student Icon */}
              Continue as Student
            </Link>
          </div>

          
          
        </div>
      </div>
    </>
  );
};

export default Login;
