import React, { useState } from 'react';
import api from '../api/axios';

const AddEvent = ({ onEventSaved, onCancel }) => {
    const [formData, setFormData] = useState({
        title: '',
        event_date: '', // Will hold 'YYYY-MM-DDTHH:MM'
        location: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            onEventSaved();
        } catch (err) {
            alert("Error creating event");
        }
    };

    return (
        <div>
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit}>
                <div style={{marginBottom: '15px'}}>
                    <label>Event Title</label>
                    <input 
                        type="text" name="title" required
                        value={formData.title} onChange={handleChange}
                        style={{width: '100%'}} placeholder="e.g. Sunday Service"
                    />
                </div>

                <div style={{display: 'flex', gap: '15px', marginBottom: '15px'}}>
                    <div style={{flex: 1}}>
                        <label>Date & Time</label>
                        <input 
                            type="datetime-local" name="event_date" required
                            value={formData.event_date} onChange={handleChange}
                            style={{width: '100%'}}
                        />
                    </div>
                    <div style={{flex: 1}}>
                        <label>Location</label>
                        <input 
                            type="text" name="location" 
                            value={formData.location} onChange={handleChange}
                            style={{width: '100%'}} placeholder="e.g. Sanctuary"
                        />
                    </div>
                </div>

                <div style={{marginBottom: '20px'}}>
                    <label>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} onChange={handleChange}
                        style={{width: '100%', height: '80px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}
                    />
                </div>

                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                    <button type="button" onClick={onCancel} className="btn" style={{background: '#e2e6ea', color: '#4a5568'}}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">Create Event</button>
                </div>
            </form>
        </div>
    );
};

export default AddEvent;