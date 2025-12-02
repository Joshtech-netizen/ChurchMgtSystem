import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const sidebarStyle = {
        width: '250px',
        height: '100vh',
        background: '#2c3e50',
        color: '#ecf0f1',
        position: 'fixed',
        left: 0,
        top: 0,
        padding: '20px'
    };

    const linkStyle = {
        display: 'block',
        color: '#ecf0f1',
        textDecoration: 'none',
        padding: '10px 15px',
        marginBottom: '5px',
        borderRadius: '4px',
        fontSize: '1.1em'
    };

    return (
        <div style={sidebarStyle}>
            <h2 style={{borderBottom: '1px solid #34495e', paddingBottom: '15px', marginBottom: '20px'}}>
                Church Admin
            </h2>
            <nav>
                <Link to="/" style={linkStyle}>📊 Dashboard</Link>
                <Link to="/members" style={linkStyle}>👥 Members</Link>
                <Link to="/donations" style={linkStyle}>💰 Donations</Link>
            </nav>
        </div>
    );
};

export default Sidebar;