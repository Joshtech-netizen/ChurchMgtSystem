import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();

    // Dynamic Style for Sliding
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
        // The Sliding Magic:
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease-in-out'
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '30px',
        textAlign: 'center',
        letterSpacing: '1px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            display: 'flex',
            alignItems: 'center', // Aligns icon and text
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
            <div style={logoStyle}>
                <span className="material-symbols-outlined" style={{fontSize: '2rem'}}>church</span>
                Church Admin
            </div>
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