import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { LibraryMusic } from "@mui/icons-material";
import { useUser } from '../UserContext';  // Adjust the import path as necessary

function Navbar() {
  const { user } = useUser();  // Get the current user state from context

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
      </div>
    </nav>
  );
}

export default Navbar;
