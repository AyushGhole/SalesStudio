import axios from "axios";
import httpStatus from "http-status";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment.js";

// Create authentication context
export const AuthContext = createContext({});

// Axios client setup
const client = axios.create({
  baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null); // Store logged-in user data
  const navigate = useNavigate();

  // Handle User Registration
  const handleRegister = async (name, username, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: username,
        password: password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
    } catch (err) {
      console.error(
        "Registration Error:",
        err.response?.data?.message || err.message
      );
      throw err;
    }
  };

  // Handle User Login
  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });

      console.log("Login Response:", request.data);

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        setUserData(request.data.user); // Store user info in state
        navigate("/"); // Redirect to Home Page
      }
    } catch (err) {
      console.error("Login Error:", err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Handle User Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/login"); // Redirect to login
  };

  return (
    <AuthContext.Provider
      value={{ userData, handleRegister, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
