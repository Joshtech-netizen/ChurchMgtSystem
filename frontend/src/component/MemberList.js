import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Import our configuration

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This runs automatically when the component loads
    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await api.get('/members');
            setMembers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to connect to the backend. Is your XAMPP running?");
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading members...</div>;
    if (error) return <div className="container" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1>Church Members</h1>
                <button className="btn btn-primary">Add New Member</button>
            </div>
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
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
                                    <td>{member.first_name}</td>
                                    <td>{member.last_name}</td>
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
                                <td colSpan="6" style={{textAlign: 'center'}}>No members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberList;