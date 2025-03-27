import React from "react";
import {FaPlay, FaFire,FaUpload, FaBook, FaClock, FaCheckCircle, FaClipboardList, FaUserCheck, FaTasks } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Sidebar from "../Sidebar";

const courses = [
    { name: "Physics 1", progress: 30, overall: 80, status: "In progress", color: "bg-orange-500", icon: "P" },
    { name: "Physics 2", progress: 30, overall: 80, status: "In progress", color: "bg-orange-500", icon: "P" },
    { name: "Chemistry 1", progress: 30, overall: 70, status: "In progress", color: "bg-blue-500", icon: "C" },
    { name: "Chemistry 2", progress: 30, overall: 80, status: "In progress", color: "bg-blue-500", icon: "C" },
    { name: "Higher math 1", progress: 100, overall: 90, status: "Completed", color: "bg-green-500", icon: "H" },
  ];

  const quizzes = [
    { name: "Vector division", questions: 10, duration: "15 min" },
    { name: "Vector division", questions: 10, duration: "15 min" },
  ];


const Dashboard = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 ">
        <Sidebar/>
      </aside>

        <main className="flex-1 p-6">
        {/* Performance Summary */}
        <div className="bg-green-100 p-4 rounded-md mb-4">
          <p className="text-green-700 font-semibold">Great effort so far Anika! Keep up the hard work.</p>
        </div>

                      {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Overall Performance */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
      {/* Title */}
      <h3 className="text-lg font-semibold">Overall Performance</h3>
      <p className="text-gray-500 text-sm">Course completion rate</p>

      {/* Semi-circle Progress Bar */}
      <div className="relative w-40 h-20 mt-4 overflow-hidden">
        <div className="w-full h-full ">
          <CircularProgressbar
            value={80}
            maxValue={100}
            styles={buildStyles({
              rotation: 0.5, // Starts from the left
              strokeLinecap: "round",
              textSize: "20px",
              pathColor: "#22C55E", // Green arc
              trailColor: "#E5E7EB", // Gray background
              textColor: "#000", // Text color
            })}
          />
        </div>

        {/* Centered Text */}
        <div className="absolute inset-0 flex flex-col items-center mt-3 justify-center">
          <p className="text-xl font-bold text-black">80%</p>
          <p className="text-xs text-gray-500">PRO LEARNER</p>
        </div>
      </div>
    </div>

          {/* Enroll, Completion, Hours */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between gap-4 mb-4">
              <FaBook className="text-green-500 text-2xl" />
              <h5>Total Enroll Courses</h5>
              <div className="w-16 h-16">
                <CircularProgressbar value={100} text={"5"} styles={buildStyles({ pathColor: "#22C55E" })} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <FaCheckCircle className="text-blue-500 text-2xl" />
              <h5>Course Completed</h5>
              <div className="w-16 h-16">
                <CircularProgressbar value={20} text={"1"} styles={buildStyles({ pathColor: "#3B82F6" })} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <FaClock className="text-pink-500 text-2xl" />
              <h5>Hours Spent</h5>
              <div className="w-16 h-16">
                <CircularProgressbar value={90} text={"112h"} styles={buildStyles({ pathColor: "#EC4899" })} />
              </div>
            </div>
          </div>

          {/* Attendance, Quiz, Assignments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between gap-4 mb-4">
            <FaUserCheck className="text-orange-500 text-2xl" />
            <h5>Live Class Attended</h5>
            <div className="w-16 h-16">
              <CircularProgressbar value={70} text={"70%"} styles={buildStyles({ pathColor: "#F97316" })} />
            </div>
           </div>

            <div className="flex items-center justify-between gap-4 mb-4">
              <FaClipboardList className="text-purple-500 text-2xl" />
              <h5>Quiz Practised</h5>
              <div className="w-16 h-16 ">
                <CircularProgressbar value={67} text={"20/30"} styles={buildStyles({ pathColor: "#A855F7" })} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <FaTasks className="text-blue-500 text-2xl" />
              <h5>Assignment Done</h5>
              <div className="w-16 h-16">
                <CircularProgressbar value={66} text={"10/15"} styles={buildStyles({ pathColor: "#3B82F6" })} />
              </div>
            </div>
          </div>
        </div>
      
        <div className="grid grid-cols-4 gap-6 w-full">
        
        {/* Upcoming Classes - 75% width */}
        <div className="col-span-3 bg-white p-6 gap-8 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Newtonian Mechanics - Class 5</h4>
                <p className="text-sm text-gray-500">Physics 1</p>
                <p className="text-sm text-gray-400">by Rakesh Ahmed</p>
              </div>
              <p className="text-red-500 text-sm">2 min left</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Join</button>
            </div>
            <div className="flex items-center justify-between p-4 mb-4 border rounded-lg">
              <div>
                <h4 className="font-semibold">Polymer - Class 3</h4>
                <p className="text-sm text-gray-500">Chemistry 1</p>
                <p className="text-sm text-gray-400">by Khalil Khan</p>
              </div>
              <p className="text-blue-500 text-sm">4 hr left</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Join</button>
            </div>
          </div>
          <div className="col-span-2 bg-white p-6 rounded-lg shadow-md ">
      <h3 className="text-lg font-semibold mb-4">Total Courses (5)</h3>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Course Name</th>
            <th className="p-2">Progress</th>
            <th className="p-2">Overall Score</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={index} className="border-b">
              <td className="p-2 flex items-center gap-2">
                <span className={`w-6 h-6 flex items-center justify-center text-white rounded-full ${course.color}`}>
                  {course.icon}
                </span>
                <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-gray-500 text-sm">5 chapters • 30 lectures</p>
                </div>
              </td>
              <td className="p-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full"
                    style={{ width: `${course.progress}%`, backgroundColor: course.color.split("-")[1] }}
                  ></div>
                </div>
              </td>
              <td className="p-2 font-semibold">{course.overall}%</td>
              <td className="p-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-sm rounded-full ${
                    course.status === "Completed" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {course.status === "Completed" && <FaCheckCircle className="mr-1" />}
                  {course.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
                
        {/* Combined Container for 5 Days and Assignment */}
        <div className="col-span-1 bg-white rounded-lg  flex flex-col gap-4">
          {/* 5 Days Without a Break */}
          <div className="bg-white p-4 rounded-lg shadow-md h-60 flex flex-col justify-between">
            <h3 className="text-lg font-semibold">5 Days Without a Break</h3>
            <p className="text-gray-500 text-sm">The record is 16 days without a break</p>
            <div className="flex gap-2">
              {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                <FaFire key={index} className={`text-xl ${index < 5 ? "text-orange-500" : "text-gray-300"}`} />
              ))}
            </div>
            <p className="text-sm text-gray-500">6 classes covered | 4 assignments completed</p>
          </div>
          
          {/* Assignments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Assignment</h3>
            <p className="font-semibold">Advanced Problem-Solving Math</p>
            <p className="text-sm text-gray-500">H. Math 1 | Assignment 5</p>
            <p className="text-red-500 text-sm">Submit before: 15th Oct, 2024 - 12:00PM</p>
            <div className="flex gap-4 mt-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">View</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <FaUpload /> Upload
              </button>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Pending Quizzes</h3>
        <button className="text-sm text-blue-500">See all</button>
      </div>
      {quizzes.map((quiz, index) => (
        <div key={index} className="flex items-center justify-between border-t pt-4 first:border-t-0 first:pt-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 text-purple-500 flex items-center justify-center rounded-full">
              Q
            </div>
            <div>
              <p className="font-semibold">{quiz.name}</p>
              <p className="text-sm text-gray-500">{quiz.questions} questions • {quiz.duration}</p>
            </div>
          </div>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <FaPlay /> Start
          </button>
        </div>
      ))}
    </div>
        </div>
        

      </div>
      </main>
    </div>
  );
};

export default Dashboard;