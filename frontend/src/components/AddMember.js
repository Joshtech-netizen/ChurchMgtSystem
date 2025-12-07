import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddMember = ({ onMemberSaved, onCancel, memberToEdit }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'active'
    });
    const [error, setError] = useState('');

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
                await api.put(`/members/${memberToEdit.id}`, formData);
            } else {
                await api.post('/members', formData);
            }
            onMemberSaved(); 
        } catch (err) {
            setError("Error saving member. Please check inputs.");
        }
    };

    return (
        <div> {/* Removed "container" class */}
            <h2>{memberToEdit ? 'Edit Member' : 'Add New Member'}</h2>
            
            {error && <p style={{color: 'var(--danger)', marginBottom: '10px'}}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <div style={{flex: 1}}>
                        <label>First Name</label>
                        <input 
                            type="text" name="first_name" 
                            value={formData.first_name} onChange={handleChange} required 
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label>Last Name</label>
                        <input 
                            type="text" name="last_name" 
                            value={formData.last_name} onChange={handleChange} required 
                            style={{width: '100%'}}
                        />
                    </div>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Email</label>
                    <input 
                        type="email" name="email" 
                        value={formData.email} onChange={handleChange} required 
                        style={{width: '100%'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Phone</label>
                    <input 
                        type="text" name="phone" 
                        value={formData.phone} onChange={handleChange} 
                        style={{width: '100%'}}
                    />
                </div>

                <div style={{marginBottom: '25px'}}>
                    <label>Status</label>
                    <select 
                        name="status" value={formData.status} onChange={handleChange}
                        style={{width: '100%'}}
                    >
                        <option value="active">Active</option>
                        <option value="visitor">Visitor</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                    <button type="button" onClick={onCancel} className="btn" style={{background: '#e2e6ea', color: '#4a5568'}}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {memberToEdit ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMember;