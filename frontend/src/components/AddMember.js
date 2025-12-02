import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddMember = ({ onMemberSaved, onCancel, memberToEdit }) => {
    // 1. Initialize State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'active'
    });
    const [error, setError] = useState('');

    // 2. Load data if we are editing
    useEffect(() => {
        if (memberToEdit) {
            setFormData({
                first_name: memberToEdit.first_name,
                last_name: memberToEdit.last_name,
                email: memberToEdit.email,
                phone: memberToEdit.phone,
                status: memberToEdit.status
            });
        }
    }, [memberToEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (memberToEdit) {
                // --- EDIT MODE (PUT) ---
                await api.put(`/members/${memberToEdit.id}`, formData);
            } else {
                // --- ADD MODE (POST) ---
                await api.post('/members', formData);
            }
            // Notify parent to refresh list
            onMemberSaved(); 
        } catch (err) {
            setError("Error saving member. Please check your input.");
            console.error(err);
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px', marginBottom: '20px', borderLeft: '4px solid #3498db'}}>
            {/* Dynamic Title */}
            <h2>{memberToEdit ? 'Edit Member' : 'Add New Member'}</h2>
            
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '10px'}}>
                    <div style={{display: 'flex', gap: '10px'}}>
                        <input 
                            type="text" name="first_name" placeholder="First Name" 
                            value={formData.first_name} onChange={handleChange} required 
                            style={{flex: 1, padding: '8px'}}
                        />
                        <input 
                            type="text" name="last_name" placeholder="Last Name" 
                            value={formData.last_name} onChange={handleChange} required 
                            style={{flex: 1, padding: '8px'}}
                        />
                    </div>
                    <br />
                    <input 
                        type="email" name="email" placeholder="Email" 
                        value={formData.email} onChange={handleChange} required 
                        style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                    />
                    <input 
                        type="text" name="phone" placeholder="Phone" 
                        value={formData.phone} onChange={handleChange} 
                        style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                    />
                    <select 
                        name="status" value={formData.status} onChange={handleChange}
                        style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                    >
                        <option value="active">Active</option>
                        <option value="visitor">Visitor</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                
                <button type="submit" className="btn btn-primary">
                    {memberToEdit ? 'Update Member' : 'Save Member'}
                </button>
                <button type="button" onClick={onCancel} className="btn" style={{marginLeft: '10px', backgroundColor: '#ddd'}}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddMember;