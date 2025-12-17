import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddMember from './AddMember';
import MemberDetails from './MemberDetails'; // Import the new component

const BASE_URL = 'http://localhost/church-system/backend/api/uploads/';

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for Modals
    const [showForm, setShowForm] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [viewingMember, setViewingMember] = useState(null); // New state for View Mode

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

    // New: Handle View Click
    const handleView = (member) => {
        setViewingMember(member);
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

            {/* --- ADD/EDIT MODAL --- */}
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

            {/* --- VIEW DETAILS MODAL --- */}
            {viewingMember && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{maxWidth: '400px'}}>
                        <MemberDetails 
                            member={viewingMember} 
                            onClose={() => setViewingMember(null)} 
                        />
                    </div>
                </div>
            )}
            
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Photo</th>
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
                                    <td>
                                        {member.photo ? (
                                            <img 
                                                src={`${BASE_URL}${member.photo}`} 
                                                alt="Profile" 
                                                style={{width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'}}
                                            />
                                        ) : (
                                            <div style={{width: '40px', height: '40px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <span className="material-symbols-outlined" style={{fontSize: '20px', color: '#718096'}}>person</span>
                                            </div>
                                        )}
                                    </td>
                                    <td style={{fontWeight: '500'}}>{member.first_name} {member.last_name}</td>
                                    <td>{member.email}</td>
                                    <td>{member.phone}</td>
                                    <td><span className={`badge ${member.status}`}>{member.status}</span></td>
                                    <td>
                                        {/* VIEW BUTTON */}
                                        <button 
                                            className="btn" 
                                            style={{color: '#3498db', background: 'none', padding: '5px'}}
                                            onClick={() => handleView(member)}
                                            title="View Details"
                                        >
                                            <span className="material-symbols-outlined">visibility</span>
                                        </button>

                                        {/* EDIT BUTTON */}
                                        <button 
                                            className="btn" 
                                            style={{color: '#f39c12', background: 'none', padding: '5px'}}
                                            onClick={() => handleEdit(member)}
                                            title="Edit"
                                        >
                                            <span className="material-symbols-outlined">edit</span>
                                        </button>

                                        {/* DELETE BUTTON */}
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
                            <tr><td colSpan="6" style={{textAlign: 'center'}}>No members found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MemberList;