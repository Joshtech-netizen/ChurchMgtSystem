import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddMember from './AddMember';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

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

    const handleDelete = async (id) => {
        if (window.confirm("Delete this member?")) {
            try {
                await api.delete(`/members/${id}`);
                setMembers(members.filter(m => m.id !== id));
            } catch (err) {
                alert("Failed to delete.");
            }
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member);
        setShowForm(true);
    };

    const handleFormSuccess = () => {
        fetchMembers();
        setShowForm(false);
        setEditingMember(null);
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
                <h1>Members Directory</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Add New Member
                </button>
            </div>

            {/* --- MODAL WRAPPER --- */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddMember 
                            onMemberSaved={handleFormSuccess} 
                            onCancel={handleFormCancel}
                            memberToEdit={editingMember} 
                        />
                    </div>
                </div>
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
                                            style={{color: '#f39c12', background: 'none', padding: '5px'}}
                                            onClick={() => handleEdit(member)}
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>
                                        <button 
                                            className="btn" 
                                            style={{color: '#e74c3c', background: 'none', padding: '5px'}}
                                            onClick={() => handleDelete(member.id)}
                                            title="Delete"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{textAlign: 'center'}}>No members found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberList;