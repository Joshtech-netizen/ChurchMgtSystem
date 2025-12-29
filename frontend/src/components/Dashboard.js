import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Change this to your actual URL
const BASE_URL = 'http://localhost/church-system/backend/api/uploads/';

const Dashboard = () => {
    // Initialize with safe defaults
    const [stats, setStats] = useState({
        total_members: 0,
        monthly_donations: 0,
        attendance_today: 0,
        upcoming_events: 0,
        chart_data: [],
        birthdays: []
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                // Merge response with defaults to ensure keys exist
                setStats(prev => ({...prev, ...response.data}));
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
                        ${parseFloat(stats.monthly_donations || 0).toLocaleString()}
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

            <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                
                {/* 2. ATTENDANCE CHART */}
                <div style={{flex: 2, minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e1e4e8'}}>
                    <h2 style={{fontSize: '1.2rem', marginBottom: '20px', color: 'var(--sidebar-blue)'}}>
                        Attendance Trends
                    </h2>
                    
                    <div style={{width: '100%', height: 300}}>
                        {/* SAFE CHECK: stats.chart_data?.length */}
                        {stats.chart_data?.length > 0 ? (
                            <ResponsiveContainer>
                                <BarChart data={stats.chart_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="title" tick={{fontSize: 12}} />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                                    <Bar dataKey="count" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999'}}>
                                Not enough data to display chart.
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. BIRTHDAYS */}
                <div style={{flex: 1, minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e1e4e8'}}>
                    <h2 style={{fontSize: '1.2rem', marginBottom: '20px', color: 'var(--sidebar-blue)', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span className="material-symbols-outlined" style={{color: '#e91e63'}}>cake</span>
                        Birthdays (This Month)
                    </h2>

                    {/* SAFE CHECK: stats.birthdays?.length */}
                    {stats.birthdays?.length > 0 ? (
                        <ul style={{listStyle: 'none', padding: 0}}>
                            {stats.birthdays.map((member, index) => {
                                const bdate = new Date(member.dob);
                                const today = new Date();
                                const isToday = bdate.getDate() === today.getDate();

                                return (
                                    <li key={index} style={{
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        padding: '10px 0', 
                                        borderBottom: '1px solid #f0f0f0',
                                        background: isToday ? '#fff0f5' : 'transparent'
                                    }}>
                                        <div style={{
                                            width: '35px', height: '35px', borderRadius: '50%', background: '#e2e8f0', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', overflow: 'hidden'
                                        }}>
                                            {member.photo ? (
                                                <img src={`${BASE_URL}${member.photo}`} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                                            ) : (
                                                <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#777'}}>person</span>
                                            )}
                                        </div>
                                        <div>
                                            <span style={{fontWeight: '500', display: 'block', color: '#333'}}>
                                                {member.first_name} {member.last_name}
                                            </span>
                                            <span style={{fontSize: '0.8rem', color: isToday ? '#e91e63' : '#888', fontWeight: isToday ? 'bold' : 'normal'}}>
                                                {isToday ? '🎂 TODAY!' : `Day: ${bdate.getDate()}`}
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p style={{color: '#888', fontStyle: 'italic'}}>No birthdays this month.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;