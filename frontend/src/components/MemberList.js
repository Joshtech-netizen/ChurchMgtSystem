import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddMember from './AddMember';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null); // Track who we are editing

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await api.get('/members');
            setMembers(response.data);
            setLoading(false);
        } catch (err) {
            setError("Failed to connect to the backend.");
            setLoading(false);
        }
    };

    // --- DELETE LOGIC ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await api.delete(`/members/${id}`);
                // Remove from UI immediately (optimistic update)
                setMembers(members.filter(member => member.id !== id));
            } catch (err) {
                alert("Failed to delete member.");
            }
        }
    };

    // --- EDIT LOGIC ---
    const handleEdit = (member) => {
        setEditingMember(member); // Load data into state
        setShowForm(true);        // Open the form
    };

    const handleFormSuccess = () => {
        fetchMembers();      // Refresh list
        setShowForm(false);  // Close form
        setEditingMember(null); // Clear editing state
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingMember(null);
    };

    if (loading) return <div className="container">Loading members...</div>;
    if (error) return <div className="container" style={{color: 'red'}}>{error}</div>;

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Church Members</h1>
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Add New Member
                    </button>
                )}
            </div>

            {/* Form Component (Handles both Add and Edit) */}
            {showForm && (
                <AddMember 
                    onMemberSaved={handleFormSuccess} 
                    onCancel={handleFormCancel}
                    memberToEdit={editingMember} 
                />
            )}
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <tr key={member.id}>
                                    <td>{member.first_name} {member.last_name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <td>
                                        <span className={`badge ${member.status}`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="btn" 
                                            style={{backgroundColor: '#f39c12', color: 'white', marginRight: '5px', padding: '5px 10px'}}
                                            onClick={() => handleEdit(member)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn" 
                                            style={{backgroundColor: '#e74c3c', color: 'white', padding: '5px 10px'}}
                                            onClick={() => handleDelete(member.id)}
                                        >
                                            Delete
                                        </button>
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