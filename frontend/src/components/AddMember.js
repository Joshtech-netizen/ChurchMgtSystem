import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const AddMember = ({ onMemberSaved, onCancel, memberToEdit }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        dob: '',
        address: '',
        phone: '+233',
        status: 'active'
    });
    const [photo, setPhoto] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (memberToEdit) {
            setFormData({
                first_name: memberToEdit.first_name || '',
                last_name: memberToEdit.last_name || '',
                gender: memberToEdit.gender || '',
                email: memberToEdit.email || '',
                dob: memberToEdit.dob || '',
                address: memberToEdit.address || '',
                phone: memberToEdit.phone || '+233',
                status: memberToEdit.status || 'active'
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
                setError("File too large. Max 1MB.");
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
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            
            if (photo) {
                data.append('photo', photo);
            }

            if (memberToEdit) {
                await api.post(`/members/${memberToEdit.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Member updated successfully!"); // NEW
            } else {
                await api.post('/members', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("New member added!"); // NEW
            }
            onMemberSaved(); 
        } catch (err) {
            // Use toast.error instead of setting local state error (optional, but cleaner)
            const msg = err.response?.data?.message || "Error saving member.";
            toast.error(msg); // NEW
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
                            type="text" name="first_name" required
                            value={formData.first_name} onChange={handleChange}
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label>Last Name</label>
                        <input 
                            type="text" name="last_name" required
                            value={formData.last_name} onChange={handleChange}
                            style={{width: '100%'}}
                        />
                    </div>
                </div>

                <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <div style={{flex: 1}}>
                        <label>Gender</label>
                        <select 
                            name="gender" required
                            value={formData.gender} onChange={handleChange}
                            style={{width: '100%'}}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div style={{flex: 1}}>
                        <label>Date of Birth</label>
                        <input 
                            type="date" name="dob" 
                            value={formData.dob} onChange={handleChange}
                            style={{width: '100%'}}
                        />
                    </div>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Telephone</label>
                    <input 
                        type="text" name="phone" 
                        value={formData.phone} onChange={handleChange}
                        style={{width: '100%'}}
                        placeholder="+233..."
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Residential Address</label>
                    <input 
                        type="text" name="address" 
                        value={formData.address} onChange={handleChange}
                        style={{width: '100%'}}
                        placeholder="House No, Street Name, Area"
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Email Address</label>
                    <input 
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        style={{width: '100%'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Profile Photo</label>
                    <input 
                        type="file" accept="image/*"
                        onChange={handleFileChange}
                        style={{width: '100%', padding: '5px', border: '1px solid var(--border-color)'}}
                    />
                </div>

                <div style={{marginBottom: '25px'}}>
                    <label>Membership Status</label>
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
                        {memberToEdit ? 'Update Member' : 'Save Member'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMember;