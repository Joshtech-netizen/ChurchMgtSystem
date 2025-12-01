import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddMember from './AddMember'; // Import the form component

const MemberList = () => {
    // State variables
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false); // Controls visibility of the Add Form

    // Initial Data Fetch
    useEffect(() => {
        fetchMembers();
    }, []);

    // Function to get data from PHP API
    const fetchMembers = async () => {
        try {
            const response = await api.get('/members');
            setMembers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to connect to the backend.");
            setLoading(false);
        }
    };

    // Callback function: Run this after a new member is successfully saved
    const handleMemberAdded = () => {
        fetchMembers();      // 1. Refresh the list from the server
        setShowForm(false);  // 2. Hide the form
    };

    // Loading State
    if (loading) return <div className="container">Loading members...</div>;
    
    // Error State
    if (error) return <div className="container" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="container">
            {/* Header Area */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Church Members</h1>
                {/* Only show "Add" button if form is NOT visible */}
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Add New Member
                    </button>
                )}
            </div>

            {/* Conditionally Render the Add Member Form */}
            {showForm && (
                <AddMember 
                    onMemberAdded={handleMemberAdded} 
                    onCancel={() => setShowForm(false)} 
                />
            )}
            
            {/* Member Table */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.id}</td>
                                    <td>{member.first_name} {member.last_name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <td>
                                        <span className={`badge ${member.status}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{textAlign: 'center'}}>No members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberList;