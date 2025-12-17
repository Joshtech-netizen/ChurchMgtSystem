import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_members: 0,
        monthly_donations: 0,
        attendance_today: 0,
        upcoming_events: 0,
        chart_data: [] // Data for the graph
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
            
            {/* 1. TOP CARDS */}
            <div className="dashboard-grid" style={{marginBottom: '40px'}}>
                <div className="stat-card">
                    <h3>Active Members</h3>
                    <p>{stats.total_members}</p>
                </div>
                <div className="stat-card">
                    <h3>Donations (This Month)</h3>
                    <p style={{color: 'var(--success)'}}>
                        ${parseFloat(stats.monthly_donations).toLocaleString()}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Attendance (Today)</h3>
                    <p style={{color: '#e67e22'}}>
                        {stats.attendance_today}
                    </p>
                </div>
                <div className="stat-card">
                    <h3>Upcoming Events</h3>
                    <p style={{color: 'var(--primary-blue)'}}>
                        {stats.upcoming_events}
                    </p>
                </div>
            </div>

            {/* 2. ATTENDANCE CHART */}
            <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e1e4e8'}}>
                <h2 style={{fontSize: '1.2rem', marginBottom: '20px', color: 'var(--sidebar-blue)'}}>
                    Attendance Trends (Last 5 Events)
                </h2>
                
                <div style={{width: '100%', height: 300}}>
                    {stats.chart_data.length > 0 ? (
                        <ResponsiveContainer>
                            <BarChart data={stats.chart_data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="title" tick={{fontSize: 12}} />
                                <YAxis allowDecimals={false} />
                                <Tooltip 
                                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                />
                                <Bar dataKey="count" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
                            Not enough data to display chart yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;