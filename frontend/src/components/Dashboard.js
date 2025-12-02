import React from 'react';

const Dashboard = () => {
    return (
        <div className="container">
            <h1>Dashboard</h1>
            <div style={{display: 'flex', gap: '20px', marginTop: '20px'}}>
                {/* Stat Card 1 */}
                <div style={{flex: 1, padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <h3 style={{color: '#7f8c8d'}}>Total Members</h3>
                    <p style={{fontSize: '2em', fontWeight: 'bold', color: '#2c3e50'}}>124</p>
                </div>
                
                {/* Stat Card 2 */}
                <div style={{flex: 1, padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <h3 style={{color: '#7f8c8d'}}>New This Month</h3>
                    <p style={{fontSize: '2em', fontWeight: 'bold', color: '#27ae60'}}>+8</p>
                </div>
                
                {/* Stat Card 3 */}
                <div style={{flex: 1, padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
                    <h3 style={{color: '#7f8c8d'}}>Upcoming Events</h3>
                    <p style={{fontSize: '2em', fontWeight: 'bold', color: '#f39c12'}}>3</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;