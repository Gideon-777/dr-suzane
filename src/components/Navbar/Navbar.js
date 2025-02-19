// src/components/Navbar/Navbar.js
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import { Tilt } from 'react-tilt';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';
import logo from '../../assets/images/logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // Get current location

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Function to check if link is active
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Tilt options={{ max: 50 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ width: 75, height: 75, paddingTop: '4px' }}
                    />
                </Tilt>
            </div>

            <ul className="navbar-links">
                {user ? (
                    <>
                        <li><Link to="/" className={isActive('/')}>Home</Link></li>
                        <li><Link to="/history" className={isActive('/history')}>History</Link></li>
                        <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
                        <li><Link to="/signup" className={isActive('/signup')}>Sign Up</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
