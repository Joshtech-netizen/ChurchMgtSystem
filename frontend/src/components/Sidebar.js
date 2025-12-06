import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation(); // To highlight the active link

    // Using CSS variables we defined in App.css
    const sidebarStyle = {
        width: '260px',
        height: '100vh',
        background: 'var(--sidebar-blue)', /* The new Navy Blue */
        color: 'white',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '30px 20px',
        boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000
    };

    const logoStyle = {
        fontSize: '1.5rem',
        fontWeight: '700',
        marginBottom: '40px',
        textAlign: 'center',
        letterSpacing: '1px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px'
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            display: 'block',
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
        <div style={sidebarStyle}>
            <div style={logoStyle}>
                Church Admin
            </div>
            <nav>
                <Link to="/" style={getLinkStyle('/')}>
                    📊 Dashboard
                </Link>
                <Link to="/members" style={getLinkStyle('/members')}>
                    👥 Members
                </Link>
                <Link to="/donations" style={getLinkStyle('/donations')}>
                    💰 Donations
                </Link>
                <Link to="/attendance" style={getLinkStyle('/attendance')}>
                    📋 Attendance
                </Link>
            </nav>
        </div>
    );
};

export default Sidebar;