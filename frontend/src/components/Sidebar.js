import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // We need to know WHO is logged in

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const { user } = useContext(AuthContext); // Get current user

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

    const logoStyle = {
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: '10px'
    };

    const getLinkStyle = (path) => {
        const isActive = location.pathname === path;
        return {
            display: 'flex', alignItems: 'center',
            color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
            background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
            textDecoration: 'none', padding: '10px 15px', marginBottom: '8px',
            borderRadius: '8px', fontSize: '0.9rem', fontWeight: '500', transition: 'all 0.3s ease',
            borderLeft: isActive ? '4px solid #fff' : '4px solid transparent'
        };
    };

    // --- PERMISSION LOGIC ---
    // If role is 'admin', they see everything.
    // If role is in the array, they see the link.
    const canAccess = (allowedRoles) => {
        if (!user) return false;
        if (user.role === 'admin') return true; // Preacher sees all
        return allowedRoles.includes(user.role);
    };

    return (
        <div style={sidebarStyle} className="sidebar">
            <div style={logoStyle}>
                <span className="material-symbols-outlined" style={{fontSize: '2.5rem'}}>church</span>
                <span style={{fontSize: '1rem', fontWeight: '700', letterSpacing: '1px'}}>
                    {user?.role === 'admin' ? 'CHURCH ADMIN' : user?.role.toUpperCase() + ' PORTAL'}
                </span>
            </div>

            <nav>
                {/* 1. DASHBOARD - Everyone sees this */}
                <Link to="/" style={getLinkStyle('/')}>
                    <span className="material-symbols-outlined">dashboard</span>
                    Dashboard
                </Link>

                {/* 2. MEMBERS - Admin, Evangelism, Youth, Children */}
                {canAccess(['evangelism', 'youth', 'children']) && (
                    <Link to="/members" style={getLinkStyle('/members')}>
                        <span className="material-symbols-outlined">group</span>
                        Members Directory
                    </Link>
                )}

                {/* 3. DONATIONS - Admin, Finance, Building */}
                {canAccess(['finance', 'building']) && (
                    <Link to="/donations" style={getLinkStyle('/donations')}>
                        <span className="material-symbols-outlined">payments</span>
                        Financial Records
                    </Link>
                )}

                {/* 4. ATTENDANCE - Admin, Youth, Children */}
                {canAccess(['youth', 'children']) && (
                    <Link to="/attendance" style={getLinkStyle('/attendance')}>
                        <span className="material-symbols-outlined">event_available</span>
                        Attendance
                    </Link>
                )}
                {/* 5. EVENTS - Admin, Evangelism */}
                {canAccess(['evangelism']) && (
                    <Link to="/events" style={getLinkStyle('/events')}>
                        <span className="material-symbols-outlined">calendar_month</span>
                        Events
                    </Link>
                )}  
            </nav>
        </div>
    );
};

export default Sidebar;