import React from "react";
import { useEffect, useState } from "react";

import "../App.css";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  // Check if the user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); // Redirect to login page
  };

  return (
    <>
      <nav>
        <div className="navHeader">
          <h2>SalesStudio</h2>
        </div>
        <div className="navList">
          <div className="text-right p-4">
            {isLoggedIn ? (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                style={{ borderRadius: "5px" }}
                onClick={handleLogout}>
                🔒 Logout
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
                style={{ borderRadius: "5px" }}
                onClick={() => navigate("/signup")}>
                📝 Register
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
