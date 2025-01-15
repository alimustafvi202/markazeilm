import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Teacher from "./pages/Teacher/TeacherDashboard";
import Login from "./pages/Major/Login";
import Signup from "./pages/Student/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import Choose from "./pages/Major/Sigup_Login";
import TeacherSignup from "./pages/Teacher/TeacherSignup";
import { useState } from "react";
import Profile from './pages/Student/Profile';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div>
        <Routes>
          {/* Pass handleLogin to the Login component */}
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          {/* Protect /teacher route */}
          <Route
            path="/teacher"
            element={
              isAuthenticated ? (
                <Teacher />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route path="/studentsignup" element={<Signup />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/teachersignup" element={<TeacherSignup />} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
