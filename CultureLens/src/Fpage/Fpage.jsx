import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LOGO from "../images/Logo.png";
import photo from "../images/MAP-logo.png";
import "./Fpage.css";
 import "../Header/Header.css";
 import { Helmet } from 'react-helmet';

const Fpage = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      
      {/* Header */}
      <header className="header">
      <Helmet>
      <title>Welcome Page</title>
      <meta name="description" content="This is the Welcome Page of may website" />
    </Helmet>
        <div className="header-left">
          <img src={LOGO} alt="CultureLens Logo" className="logo-img" />
          <h1 className="logo-title">CultureLens</h1>
        </div>
      </header>

      {/* About us section */}
      <div className="info-section">
        <div className="text-content">
          <p className="section-title">Welcome to CultureLens!</p>
          <p className="section-description">
            Begin your journey in understanding global cultures and discover how
            language models interact with diverse values and standards. Ready to
            explore cultures in new ways? <br />
            Get started now!
          </p>
          <nav className="nav-buttons">
            <Link to="/Sign">
              <button className="Button-Register">Get Started</button>
            </Link>
            <Link to="/Login">
              <button className="Button-Register">Log in</button>
            </Link>
          </nav>
        </div>
        <img src={photo} alt="Map Logo" className="animated-logo" />
      </div>
    </div>
  );
};

export default Fpage;
