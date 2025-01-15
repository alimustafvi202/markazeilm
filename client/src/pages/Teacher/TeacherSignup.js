import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaBook, FaPhone,FaGlobe } from "react-icons/fa";
import Bg from '../../assets/bg.jpg';
import Nav from '../Major/Nav';

const InstructorSignupForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        contactCode: "",
        contactNumber: "",
        country: "Pakistan",
        password: "",
        confirmPassword: "",
        subjectExpertise: "",
        qualifications: "",
        experience: "",
        termsAccepted: false,
    });

    const [countries, setCountries] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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

    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            termsAccepted: e.target.checked,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.username ||
            !formData.email ||
            !formData.contactNumber ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.subjectExpertise ||
            !formData.qualifications ||
            !formData.experience ||
            !formData.termsAccepted
        ) {
            setError("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setError(""); // Clear error if validation passes

        try {
            const response = await axios.post("http://localhost:5000/teachersignup", formData);
            setSuccess(response.data.message);
            setFormData({
                name: "",
                username: "",
                email: "",
                contactCode: "",
                contactNumber: "",
                country: "Pakistan",
                password: "",
                confirmPassword: "",
                subjectExpertise: "",
                qualifications: "",
                experience: "",
                termsAccepted: false,
            });
        } catch (error) {
            console.error(error.response?.data?.message || "Error during registration.");
            setError(error.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <>
        <Nav/>
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `url(${Bg})` }}
        >
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-3 mt-20">
                <h2 className="text-lg font-bold text-center text-gray-800 mb-3">Instructor Registration</h2>
                {error && (
                    <div className="bg-red-100 text-red-700 p-2 rounded mb-2 text-sm">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="mb-2">
                        <label htmlFor="name" className="block text-xs font-medium text-gray-700">Full Name</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>
                    </div>

                    {/* Username */}
                    <div className="mb-2">
                        <label htmlFor="username" className="block text-xs font-medium text-gray-700">Username</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-2">
                        <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email Address</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaEnvelope />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    {/* Subject Expertise */}
                    <div className="mb-2">
                        <label htmlFor="subjectExpertise" className="block text-xs font-medium text-gray-700">Subject Expertise</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaBook />
                            </div>
                            <input
                                type="text"
                                id="subjectExpertise"
                                name="subjectExpertise"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.subjectExpertise}
                                onChange={handleChange}
                                placeholder="Enter subject you are expert in"
                            />
                        </div>
                    </div>

                    {/* Qualifications */}
                    <div className="mb-2">
                        <label htmlFor="qualifications" className="block text-xs font-medium text-gray-700">Qualifications</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaUser />
                            </div>
                            <input
                                type="text"
                                id="qualifications"
                                name="qualifications"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.qualifications}
                                onChange={handleChange}
                                placeholder="Enter your qualifications"
                            />
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-2">
                        <label htmlFor="experience" className="block text-xs font-medium text-gray-700">Experience</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaUser />
                            </div>
                            <input
                                id="experience"
                                name="experience"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="Describe your teaching experience"
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="mb-2">
                        <label htmlFor="country" className="block text-xs font-medium text-gray-700">Country</label>
                        <div className="flex items-center border rounded-md mt-1">
                            <div className="px-2 text-gray-500">
                                <FaGlobe />
                            </div>
                            <select
                                id="country"
                                name="country"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
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
                        <label htmlFor="contactNumber" className="block text-xs font-medium text-gray-700">Contact Number</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaPhone />
                            </div>
                            <div className="px-2 text-gray-500 text-xs">{formData.contactCode}</div>
                            <input
                                type="tel"
                                id="contactNumber"
                                name="contactNumber"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                placeholder="Phone Number"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mb-2">
                        <label htmlFor="password" className="block text-xs font-medium text-gray-700">Password</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                            />
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-2">
                        <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700">Confirm Password</label>
                        <div className="flex items-center border rounded-lg mt-1">
                            <div className="px-2 text-gray-500">
                                <FaLock />
                            </div>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="w-full p-1 text-xs border-0 focus:ring-0"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                            />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-2 flex items-center">
                        <input
                            type="checkbox"
                            id="terms"
                            name="termsAccepted"
                            className="h-3 w-3 text-blue-600 border-gray-300 rounded focus:ring-0"
                            checked={formData.termsAccepted}
                            onChange={handleCheckboxChange}
                        />
                        <label htmlFor="terms" className="ml-2 text-xs text-gray-700">
                            I agree to the <a href="/terms" className="text-purple-600">Terms and Conditions</a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition duration-200"
                    >
                        Register
                    </button>

                </form>
            </div>
        </div>
        </>
    );
};

export default InstructorSignupForm;
