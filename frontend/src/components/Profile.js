import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';

const Profile = () => {
    const { user, setUser } = useContext(AuthContext); // Access global user state
    const [formData, setFormData] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load current user data into form
    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: '',
                confirm_password: ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validate Passwords
        if (formData.password && formData.password !== formData.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }

        try {
            // Send update request
            await api.post('/profile/update', {
                id: formData.id,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                password: formData.password // Optional
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            
            // Update local user state so sidebar/header updates instantly
            const updatedUser = { ...user, first_name: formData.first_name, last_name: formData.last_name, email: formData.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // We need a way to update Context. Ideally, Context exposes a setter.
            // For now, reload serves as a simple sync, or we can update if Context allows.
            window.location.reload(); 

        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px'}}>
            <h1>My Profile</h1>
            
            {message.text && (
                <div style={{
                    padding: '10px', 
                    marginBottom: '20px', 
                    borderRadius: '4px',
                    backgroundColor: message.type === 'error' ? '#ffebee' : '#e8f5e9',
                    color: message.type === 'error' ? '#c62828' : '#2e7d32'
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
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

                <div style={{marginBottom: '20px'}}>
                    <label>Email Address</label>
                    <input 
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        style={{width: '100%'}}
                    />
                </div>

                <hr style={{margin: '30px 0', border: '0', borderTop: '1px solid #eee'}} />
                
                <h3 style={{marginBottom: '15px'}}>Change Password</h3>
                <p style={{fontSize: '0.9rem', color: '#666', marginBottom: '15px'}}>Leave blank if you don't want to change it.</p>

                <div style={{marginBottom: '20px'}}>
                    <label>New Password</label>
                    <input 
                        type="password" name="password" 
                        value={formData.password} onChange={handleChange}
                        style={{width: '100%'}} placeholder="••••••"
                    />
                </div>

                <div style={{marginBottom: '30px'}}>
                    <label>Confirm Password</label>
                    <input 
                        type="password" name="confirm_password" 
                        value={formData.confirm_password} onChange={handleChange}
                        style={{width: '100%'}} placeholder="••••••"
                    />
                </div>

                <button type="submit" className="btn btn-primary">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;