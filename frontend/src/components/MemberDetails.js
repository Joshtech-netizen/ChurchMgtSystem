import React from 'react';

// Make sure this matches your actual backend URL
const BASE_URL = 'http://localhost/church-system/backend/api/uploads/';

const MemberDetails = ({ member, onClose }) => {
    if (!member) return null;

    return (
        <div style={{textAlign: 'center'}}>
            {/* Profile Header */}
            <div style={{marginBottom: '20px'}}>
                {member.photo ? (
                    <img 
                        src={`${BASE_URL}${member.photo}`} 
                        alt="Profile" 
                        style={{
                            width: '120px', 
                            height: '120px', 
                            borderRadius: '50%', 
                            objectFit: 'cover',
                            border: '4px solid var(--primary-blue)',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
                        }}
                    />
                ) : (
                    <div style={{
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%', 
                        background: '#e2e8f0', 
                        color: '#718096',
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '3rem'
                    }}>
                        <span className="material-symbols-outlined" style={{fontSize: '60px'}}>person</span>
                    </div>
                )}
                <h2 style={{marginTop: '15px', marginBottom: '5px', color: 'var(--sidebar-blue)'}}>
                    {member.first_name} {member.last_name}
                </h2>
                <span className={`badge ${member.status}`} style={{fontSize: '0.9rem'}}>
                    {member.status.toUpperCase()}
                </span>
            </div>

            {/* Details Grid */}
            <div style={{textAlign: 'left', background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #eee'}}>
                <div style={{marginBottom: '10px'}}>
                    <strong style={{color: '#888', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase'}}>Email Address</strong>
                    <div style={{fontSize: '1.1rem', color: '#333'}}>{member.email}</div>
                </div>
                
                <div style={{marginBottom: '10px'}}>
                    <strong style={{color: '#888', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase'}}>Phone Number</strong>
                    <div style={{fontSize: '1.1rem', color: '#333'}}>{member.phone || 'N/A'}</div>
                </div>

                <div>
                    <strong style={{color: '#888', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase'}}>Member ID</strong>
                    <div style={{fontSize: '1.1rem', color: '#333'}}>#{member.id}</div>
                </div>
            </div>

            <button 
                onClick={onClose} 
                className="btn btn-primary" 
                style={{marginTop: '25px', width: '100%', padding: '12px'}}
            >
                Close Profile
            </button>
        </div>
    );
};

export default MemberDetails;