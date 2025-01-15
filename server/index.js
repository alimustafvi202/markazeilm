// Updated Express Backend Code
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/markazeilm";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    contactCode: String,
    contactNumber: String,
    country: String,
    password: String,
    rrole: { type: String, enum: ['student', 'teacher'], required: true },
});

const User = mongoose.model("Users", userSchema);

// Signup Route
app.post("/studentsignup", async (req, res) => {
    try {
        const { name, username, email, contactCode, contactNumber, country, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to DB
        const newUser = new User({
            name,
            username,
            email,
            contactCode,
            contactNumber,
            country,
            password: hashedPassword,
            rrole:'student',
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});


// Teacher Schema
const teacherSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    contactCode: String,
    contactNumber: String,
    country: String,
    subjectExpertise: String,
    qualifications: String,
    experience: String,
    password: String,
    role: { type: String, enum: ['teacher', 'student'], default: 'teacher' },
});

const Teacher = mongoose.model("Teachers", teacherSchema);

// Teacher Signup Route
app.post("/teachersignup", async (req, res) => {
    try {
        const { name, username, email, contactCode, contactNumber, country, subjectExpertise, qualifications, experience, password } = req.body;

        // Check if teacher exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) return res.status(400).json({ message: "Teacher already exists." });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save teacher to DB
        const newTeacher = new Teacher({
            name,
            username,
            email,
            contactCode,
            contactNumber,
            country,
            subjectExpertise,
            qualifications,
            experience,
            password: hashedPassword,
            
        });

        await newTeacher.save();
        res.status(201).json({ message: "Teacher created successfully." });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
});


// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists as a student or teacher
        let user = await User.findOne({ email });
        let role = "student"; // Default role if found in User

        if (!user) {
            user = await Teacher.findOne({ email });
            if (user) {
                role = "teacher"; // Update role if found in Teacher
            }
        }

        if (!user) return res.status(404).json({ message: "Invalid email or password." });

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: "Invalid email or password." });

        // Generate token with role
        const token = jwt.sign({ id: user._id, role: role }, JWT_SECRET, { expiresIn: "1h" });

        // Send user info based on role (teacher or student)
        return res.status(200).json({
            token,
            user: { 
                name: user.name, 
                email: user.email, 
                role: role, 
                message: `Welcome, ${role.charAt(0).toUpperCase() + role.slice(1)}!` 
            }
            
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong." });
    }
});

// Start the server
app.listen(PORT, () => console.log('Server running on http://localhost:${PORT}'));