import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { LibraryMusic } from "@mui/icons-material";
import { useUser } from '../UserContext';  // Adjust the import path as necessary

function Navbar() {
  const { user, setUser } = useUser();  // Get the current user state and setUser function from context

  const handleLogout = () => {
    setUser(null); // Clear the user state upon logout
    window.location.href = "/"; // Redirect the user to the home screen upon logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          {/* Conditionally change the destination based on user's login state */}
          <Link to={user ? "/user" : "/"} className="navbar-logo">
            AudioScapes&nbsp;
            <LibraryMusic color="white" fontSize="large" />
          </Link>
        </div>
        {/* Logout button */}
        {user && (
          <div className="logout-container">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
