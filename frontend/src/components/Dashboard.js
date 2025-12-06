import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_members: 0,
        monthly_donations: 0,
        attendance_today: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error("Error loading stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="container">
            <h1>Dashboard Overview</h1>
            
            <div className="dashboard-grid">
                {/* Members Card */}
                <div className="stat-card">
                    <h3>Active Members</h3>
                    <p>{stats.total_members}</p>
                </div>
                
                {/* Donations Card */}
                <div className="stat-card">
                    <h3>Donations (This Month)</h3>
                    <p style={{color: 'var(--success)'}}>
                        ${parseFloat(stats.monthly_donations).toLocaleString()}
                    </p>
                </div>
                
                {/* Attendance Card */}
                <div className="stat-card">
                    <h3>Attendance (Today)</h3>
                    <p style={{color: '#e67e22'}}>
                        {stats.attendance_today}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;