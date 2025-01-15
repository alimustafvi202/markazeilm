import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaGlobe, FaPhone, FaBirthdayCake, FaSchool, FaIdCard, FaBriefcase } from "react-icons/fa";
import Sidebar from '../Major/Sidebar';

const Profile = () => {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [admissionDate, setAdmissionDate] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    contactCode: "",
    contactNumber: "",
    country: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
    jobTitle: "",
    company: "",
    experienceDuration: "",
    experienceDescription: "",
  });

  const removeEducation = (index) => {
    const updatedEducationDetails = [...educationDetails];
    updatedEducationDetails.splice(index, 1);
    setEducationDetails(updatedEducationDetails);
  };

  
  const [educationDetails, setEducationDetails] = useState([
    { level: "SSC", year: "", institute: "", percentage: "", board: "" },
  ]);

  

  const handleEducationChange = (index, field, value) => {
    const updatedDetails = [...educationDetails];
    updatedDetails[index][field] = value;
    setEducationDetails(updatedDetails);
  };

  const addEducation = () => {
    const levels = ["SSC", "HSSC", "BS"];
    const nextLevel = levels[educationDetails.length] || "Other";
    setEducationDetails([
      ...educationDetails,
      { level: nextLevel, year: "", institute: "", percentage: "", board: "" },
    ]);
  };



  const [countries, setCountries] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        const countryList = response.data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
          dialCode: country.idd?.root
            ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
            : "",
        }));
        setCountries(countryList);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    const selectedCountry = countries.find((c) => c.name === formData.country);
    if (selectedCountry) {
      setFormData((prevState) => ({
        ...prevState,
        contactCode: selectedCountry.dialCode || "",
      }));
    }
  }, [countries, formData.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const country = countries.find((c) => c.name === selectedCountry);
    if (country && country.dialCode) {
      setFormData({
        ...formData,
        country: selectedCountry,
        contactCode: country.dialCode,
        contactNumber: "",
      });
    } else {
      setFormData({
        ...formData,
        country: selectedCountry,
        contactCode: "",
        contactNumber: "",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Profile content */}
      <div className="flex-1">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-md p-8">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src="https://via.placeholder.com/100"
              alt="Profile"
              className="w-24 h-24 rounded-full border"
            />
            <div>
              <h1 className="text-2xl font-bold">Jordan Hamidul</h1>
              <p className="text-sm text-gray-500">
                A student information collection form is a document used by teachers to collect data about their students.
              </p>
              <p className="text-sm text-gray-600">Jamsed Pora USA 3544</p>
              <p className="text-sm text-blue-600">+880 345678990 | jordanhamidul@gmail.com</p>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-purple-800 border-b pb-2 mb-4">Personal Details</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    placeholder="Jordan"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Father Name</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    placeholder="Hamidul"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mother Name</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    placeholder="Hamidul"
                  />
                </div>
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <div className="flex items-center space-x-4 mt-1">
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="gender" value="male" />
                    <span>Male</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="radio" name="gender" value="female" />
                    <span>Female</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Religion</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaGlobe />
                  </div>
                  <input
                    type="text"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    placeholder="Islam"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaBirthdayCake />
                  </div>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Civil Status</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaIdCard />
                  </div>
                  <select
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                  >
                    <option>Select</option>
                    <option>Single</option>
                    <option>Married</option>
                  </select>
                </div>
              </div>
              
              {/* Country */}
              <div className="mb-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaGlobe />
                  </div>
                  <select
                    id="country"
                    name="country"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    value={formData.country}
                    onChange={handleCountryChange}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Contact Number */}
              <div className="mb-2">
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">Contact Number</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaPhone />
                  </div>
                  <div className="px-2 text-gray-500 sm:text-base">{formData.contactCode}</div>
                  <input
                    type="tel"
                    id="contactNumber"
                    name="contactNumber"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <div className="flex items-center border rounded-lg mt-1">
                  <div className="px-2 text-gray-500">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </form>
          </div>
      {/* Educational Details Section */}
<div className="mb-8">
  {/* Header with Add Education Link */}
  <div className="flex justify-between items-center border-b pb-2 mb-4">
    <h2 className="text-lg font-bold text-purple-800">
      Educational Details
    </h2>
    <a
      onClick={addEducation}
      className="text-indigo-600 hover:text-indigo-500 cursor-pointer flex items-center space-x-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>
      <span className="font-semibold">Add Education</span>
    </a>
  </div>

  {/* Education Details */}
  {educationDetails.map((edu, index) => (
    <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50 relative">
      {/* Subtract Button */}
      <button
        onClick={() => removeEducation(index)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-500 flex items-center space-x-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12h12"
          />
        </svg>
        <span className="sr-only">Remove Education</span>
      </button>

      <h3 className="text-md font-semibold text-gray-700 mb-2">
        {edu.level} Details
      </h3>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Year
          </label>
          <input
            type="number"
            value={edu.year}
            onChange={(e) =>
              handleEducationChange(index, "year", e.target.value)
            }
            className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
            placeholder="Enter year"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Institute
          </label>
          <input
            type="text"
            value={edu.institute}
            onChange={(e) =>
              handleEducationChange(index, "institute", e.target.value)
            }
            className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
            placeholder="Enter institute name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Percentage
          </label>
          <input
            type="number"
            value={edu.percentage}
            onChange={(e) =>
              handleEducationChange(index, "percentage", e.target.value)
            }
            className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
            placeholder="Enter percentage"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Board
          </label>
          <input
            type="text"
            value={edu.board}
            onChange={(e) =>
              handleEducationChange(index, "board", e.target.value)
            }
            className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
            placeholder="Enter board name"
          />
        </div>
      </form>
    </div>
  ))}
</div>


      {/* Experience Details Section */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-purple-800 border-b pb-2 mb-4">
          Experience Details
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <div className="flex items-center border rounded-lg mt-1">
              <div className="px-2 text-gray-500">
                <FaBriefcase />
              </div>
              <input
                type="text"
                name="jobTitle"
                className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Software Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <div className="flex items-center border rounded-lg mt-1">
              <div className="px-2 text-gray-500">
                <FaBriefcase />
              </div>
              <input
                type="text"
                name="company"
                className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company Name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Duration
            </label>
            <div className="flex items-center border rounded-lg mt-1">
              <div className="px-2 text-gray-500">
                <FaBriefcase />
              </div>
              <input
                type="text"
                name="experienceDuration"
                className="w-full p-1 sm:text-base py-3 border-0 focus:ring-0"
                value={formData.experienceDuration}
                onChange={handleChange}
                placeholder="Duration in months/years"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Description
            </label>
            <textarea
              name="experienceDescription"
              className="w-full p-3 border-2 rounded-md focus:outline-none"
              value={formData.experienceDescription}
              onChange={handleChange}
              placeholder="Describe your responsibilities and achievements"
            />
          </div>
        </form>
      </div>
          <div className="mt-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
              Update Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
