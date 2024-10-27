import React, { useState } from 'react';
import './ModeratorPage.css';
import { useNavigate } from 'react-router-dom';
import Logo from '../images/Logo.png';
import { Footer } from '../Footer/Footer';
import '../Header/Header.css';
import SignOutConfirmation from './SignOutConfirmation'; 
import {Helmet} from 'react-helmet';

const ModeratorPage = () => {
  const [view, setView] = useState('view-edit');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false); 
  const navigate = useNavigate();

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleProfileClick = () => {
    console.log('Navigating to profile page');
    navigate('/profile');
  };

  // Show sign-out confirmation modal
  const handleSignOut = () => {
    setShowSignOutModal(true); 
  };

  // Confirm sign-out
  const handleConfirmSignOut = () => {
    setShowSignOutModal(false);
    navigate('/Login'); 
  };

  // Cancel sign-out
  const handleCancelSignOut = () => {
    setShowSignOutModal(false); 
  };

  return (
    <div className="moderator-container">
        <Helmet>
          <title>Moderator Page</title>
          <meta name="description" content="This is Moderator page" />
        </Helmet>
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={Logo} alt="CultureLens Logo" className="logo-img" />
          <h1 className="logo-title">CultureLens</h1>
        </div>

        <button className="menu-btn" onClick={handleMenuToggle}>
          <span className="menu-icon">&#9776;</span>
        </button>
        {menuOpen && (
          <div className="menu-dropdown">
            <p onClick={handleProfileClick}>Profile</p>
            <p onClick={handleSignOut} className="sign-out">Sign out</p>
          </div>
        )}
      </header>

      {/* Header for Page Title */}
      <div className="header-banner">
        <h1>Moderator Page</h1>
      </div>

      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={view === 'view-edit' ? 'active' : ''}
          onClick={() => setView('view-edit')}
        >
          View Edit
        </button>
        <button
          className={view === 'notifications' ? 'active' : ''}
          onClick={() => setView('notifications')}
        >
          Notifications
        </button>
      </div>

      {/* Content Views */}
      {view === 'view-edit' && (
        <div className="table-container">
          <h2 className="pagename">View Edit Dataset</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Attribute-ID</th>
                <th>UserID</th>
                <th>Region</th>
                <th>Topic</th>
                <th>Value</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td>Na-ko-39</td>
              <td>user_47</td>
              <td>Western</td>
                <td>Food</td>
                <td>Tea</td>
                <td>Sub-culture</td>
              </tr>
              <tr>
              <td>Ara-ko-39</td>
              <td>user_80</td>
              <td>Arab</td>
                <td>Food</td>
                <td>Coffee</td>
                <td>Variance</td>
              </tr>
              <tr>
              <td>by-da-30</td>
              <td>user_40</td>
              <td>Western</td>
                <td>Holiday</td>
                <td>New Year</td>
                <td>Variance</td>
              </tr>
              <tr>
              <td>Chi_311</td>
              <td>user_99</td>
              <td>Chines</td>
                <td>Sport</td>
                <td>Water</td>
                <td>Variance</td>
              </tr>
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button className="pagination-btn active">1</button>
          </div>
        </div>
      )}

      {view === 'notifications' && (
        <div className="notifications-container">
          <h2 className="pagename">Notifications</h2>
          <p>No Notifications.</p>
        </div>
      )}

      {/* Sign-out confirmation modal */}
      {showSignOutModal && (
        <SignOutConfirmation onConfirm={handleConfirmSignOut} onCancel={handleCancelSignOut} />
      )}

        {/* Footer */}
        <Footer/>
    </div>
  );
};

export default ModeratorPage;
