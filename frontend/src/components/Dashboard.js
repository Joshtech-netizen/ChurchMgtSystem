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
            <h1>Dashboard</h1>
            <div style={{display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap'}}>
                {/* Members Card */}
                <div style={cardStyle}>
                    <h3 style={{color: '#7f8c8d'}}>Active Members</h3>
                    <p style={{fontSize: '2.5em', fontWeight: 'bold', color: '#2c3e50'}}>
                        {stats.total_members}
                    </p>
                </div>
                
                {/* Donations Card */}
                <div style={cardStyle}>
                    <h3 style={{color: '#7f8c8d'}}>Donations (This Month)</h3>
                    <p style={{fontSize: '2.5em', fontWeight: 'bold', color: '#27ae60'}}>
                        ${parseFloat(stats.monthly_donations).toLocaleString()}
                    </p>
                </div>
                
                {/* Attendance Card */}
                <div style={cardStyle}>
                    <h3 style={{color: '#7f8c8d'}}>Attendance (Today)</h3>
                    <p style={{fontSize: '2.5em', fontWeight: 'bold', color: '#e67e22'}}>
                        {stats.attendance_today}
                    </p>
                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    flex: 1, 
    minWidth: '250px',
    padding: '20px', 
    background: 'white', 
    borderRadius: '8px', 
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
};

export default Dashboard;