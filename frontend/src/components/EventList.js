import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddEvent from './AddEvent';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    const fetchEvents = async () => {
        try {
            const response = await api.get('/events');
            setEvents(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this event?")) {
            try {
                await api.delete(`/events/${id}`);
                fetchEvents();
            } catch (err) {
                alert("Failed to delete");
            }
        }
    };

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Church Events Calendar</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Create Event
                </button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddEvent 
                            onEventSaved={() => { fetchEvents(); setShowForm(false); }} 
                            onCancel={() => setShowForm(false)} 
                        />
                    </div>
                </div>
            )}

            <div className="dashboard-grid">
                {events.length > 0 ? events.map(event => (
                    <div key={event.id} className="stat-card" style={{borderLeft: '5px solid #e67e22', textAlign: 'left'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                            <h3 style={{color: '#e67e22', margin: 0}}>{new Date(event.event_date).toLocaleDateString()}</h3>
                            <button onClick={() => handleDelete(event.id)} style={{border: 'none', background: 'none', cursor: 'pointer', color: '#999'}}>
                                <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>delete</span>
                            </button>
                        </div>
                        
                        <h2 style={{fontSize: '1.2rem', margin: '10px 0', color: 'var(--sidebar-blue)'}}>{event.title}</h2>
                        
                        <div style={{display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.9rem', marginBottom: '10px'}}>
                            <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>schedule</span>
                            {new Date(event.event_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            <span style={{margin: '0 5px'}}>|</span>
                            <span className="material-symbols-outlined" style={{fontSize: '1rem'}}>location_on</span>
                            {event.location}
                        </div>

                        <p style={{fontSize: '0.9rem', color: '#777', lineHeight: '1.4'}}>
                            {event.description || "No description provided."}
                        </p>
                    </div>
                )) : <p>No upcoming events.</p>}
            </div>
        </div>
    );
};

export default EventList;