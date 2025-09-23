import React, {  } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";

// import axios from "axios";
import "../Header/Header.css";

const Header = ({ user, handleLogout }) => {
  // const navigate = useNavigate();

  // Removed setUser logic here as it is not required in this component.

  return (
    <div>
    <header className="header">
    {/* <h1 id='brand'>&nbsp;&nbsp;</h1> */}
    <h1 id="brand"><i class="fa-brands fa-studiovinari"></i>&nbsp;&nbsp;Crafted Vitae</h1>
      <nav className="nav">
        {user ? (
          <>
            <Link to="/" className="nav-link">About & Projects</Link>
            <Link to="/skills" className="nav-link">Skills</Link>
            <Link to="/education" className="nav-link">Education</Link>
            <Link to="/Achivements" className="nav-link">Achievements</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <span className="username">{user.email}</span>
            <button onClick={handleLogout} className="logoutButton"><i class="fa-solid fa-right-from-bracket" id="login-font"></i>&nbsp;&nbsp;Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link"><i class="fa-solid fa-right-to-bracket" id="nav-font"></i>&nbsp;&nbsp;Login</Link>
            <Link to="/signup" className="nav-link"><i class="fa-solid fa-user-plus" id="nav-font"></i>&nbsp;&nbsp;Signup</Link>
          </>
        )}
      </nav>
    </header>
    </div>
  );
};

export default Header;
