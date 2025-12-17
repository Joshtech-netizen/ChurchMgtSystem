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
    const [photo, setPhoto] = useState(null);
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 1048576) {
                setError("File is too large! Max size is 1MB.");
                setPhoto(null);
                e.target.value = null;
                return;
            }
            setPhoto(file);
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const data = new FormData();
            data.append('first_name', formData.first_name);
            data.append('last_name', formData.last_name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('status', formData.status);
            
            if (photo) {
                data.append('photo', photo);
            }

            // CRITICAL CHANGE: We use POST for both Add and Edit
            if (memberToEdit) {
                // Update (POST to ID)
                await api.post(`/members/${memberToEdit.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                // Create (POST to Collection)
                await api.post('/members', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onMemberSaved(); 
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Error saving member.");
        }
    };

    return (
        <div> 
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

                {/* Always Show File Input */}
                <div style={{marginBottom: '15px'}}>
                    <label>Profile Photo (Max 1MB)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{width: '100%', padding: '5px', border: '1px solid var(--border-color)', borderRadius: '4px'}}
                    />
                    {memberToEdit && <small style={{color: '#888'}}>Leave empty to keep current photo.</small>}
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