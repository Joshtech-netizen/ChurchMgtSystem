import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        background: 'var(--sidebar-blue)',
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '20px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
    };

    // UPDATED: Vertical Stack Layout for Logo
    const logoStyle = {
        display: 'flex',
        flexDirection: 'column', // Stack items (Icon Top, Text Bottom)
        alignItems: 'center',    // Center them horizontally
        justifyContent: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        gap: '10px'              // Space between Icon and Text
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            display: 'flex',
            alignItems: 'center',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
            textDecoration: 'none',
            padding: '12px 15px',
            marginBottom: '10px',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            borderLeft: isActive ? '4px solid #fff' : '4px solid transparent'
        };
    };

    return (
        <div style={sidebarStyle} className="sidebar">
            {/* Logo Section */}
            <div style={logoStyle}>
                <span className="material-symbols-outlined" style={{fontSize: '3rem'}}>church</span>
                <span style={{fontSize: '1.2rem', fontWeight: '700', letterSpacing: '1px'}}>CHURCH ADMIN</span>
            </div>

            {/* Navigation Links */}
            <nav>
                <Link to="/" style={getLinkStyle('/')}>
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </Link>
                <Link to="/members" style={getLinkStyle('/members')}>
                    <span className="material-symbols-outlined">group</span>
                    Members
                </Link>
                <Link to="/donations" style={getLinkStyle('/donations')}>
                    <span className="material-symbols-outlined">payments</span>
                    Donations
                </Link>
                <Link to="/attendance" style={getLinkStyle('/attendance')}>
                    <span className="material-symbols-outlined">event_available</span>
                    Attendance
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;