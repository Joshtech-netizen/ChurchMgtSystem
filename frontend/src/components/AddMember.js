import React, { useState } from 'react';
import api from '../api/axios';

const AddMember = ({ onMemberAdded, onCancel }) => {
    // 1. State for form data
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'active'
    });
    const [error, setError] = useState('');

    // 2. Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page refresh
        try {
            await api.post('/members', formData);
            // Notify parent component to refresh the list
            onMemberAdded(); 
            // Reset form
            setFormData({ first_name: '', last_name: '', email: '', phone: '', status: 'active' });
        } catch (err) {
            setError("Error adding member. Email might already exist.");
            console.error(err);
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px', marginBottom: '20px'}}>
            <h2>Add New Member</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '10px'}}>
                    <input 
                        type="text" name="first_name" placeholder="First Name" 
                        value={formData.first_name} onChange={handleChange} required 
                        style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                    />
                    <input 
                        type="text" name="last_name" placeholder="Last Name" 
                        value={formData.last_name} onChange={handleChange} required 
                        style={{width: '100%', padding: '8px', marginBottom: '10px'}}
                    />
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
                
                <button type="submit" className="btn btn-primary">Save Member</button>
                <button type="button" onClick={onCancel} className="btn" style={{marginLeft: '10px', backgroundColor: '#ddd'}}>Cancel</button>
            </form>
        </div>
    );
};

export default AddMember;