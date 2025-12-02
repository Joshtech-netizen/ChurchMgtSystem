import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddDonation = ({ onDonationAdded, onCancel }) => {
    // 1. State for the form fields
    const [formData, setFormData] = useState({
        member_id: '',
        amount: '',
        type: 'tithe',
        date: new Date().toISOString().split('T')[0], // Default to today
        notes: ''
    });

    // 2. State for the "Dropdown" list
    const [members, setMembers] = useState([]);

    // 3. Load Members for the dropdown
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get('/members');
                setMembers(response.data);
            } catch (err) {
                console.error("Could not load members", err);
            }
        };
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/donations', formData);
            onDonationAdded(); // Refresh the parent list
        } catch (err) {
            alert("Error recording donation. Did you select a member?");
        }
    };

    return (
        <div className="container" style={{maxWidth: '600px', marginBottom: '20px', borderLeft: '4px solid #27ae60'}}>
            <h2>Record Donation</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label style={{display: 'block', marginBottom: '5px'}}>Member:</label>
                    <select 
                        name="member_id" 
                        value={formData.member_id} 
                        onChange={handleChange} 
                        required
                        style={{width: '100%', padding: '8px'}}
                    >
                        <option value="">-- Select a Member --</option>
                        {members.map(member => (
                            <option key={member.id} value={member.id}>
                                {member.first_name} {member.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                    <div style={{flex: 1}}>
                        <label>Amount ($):</label>
                        <input 
                            type="number" name="amount" step="0.01"
                            value={formData.amount} onChange={handleChange} required 
                            style={{width: '100%', padding: '8px'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label>Type:</label>
                        <select 
                            name="type" value={formData.type} onChange={handleChange}
                            style={{width: '100%', padding: '8px'}}
                        >
                            <option value="tithe">Tithe</option>
                            <option value="offering">Offering</option>
                            <option value="building_fund">Building Fund</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Date:</label>
                    <input 
                        type="date" name="date" 
                        value={formData.date} onChange={handleChange} required 
                        style={{width: '100%', padding: '8px'}}
                    />
                </div>

                <div style={{marginBottom: '15px'}}>
                    <label>Notes:</label>
                    <input 
                        type="text" name="notes" placeholder="Optional notes"
                        value={formData.notes} onChange={handleChange} 
                        style={{width: '100%', padding: '8px'}}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Record Donation</button>
                <button type="button" onClick={onCancel} className="btn" style={{marginLeft: '10px', backgroundColor: '#ddd'}}>
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default AddDonation;