import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Announcements = () => {
    const [history, setHistory] = useState([]);
    const [formData, setFormData] = useState({
        type: 'email', // Default
        subject: '',
        group: 'all',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/announcements');
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to load history");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        
        // Validation for SMS length
        if (formData.type === 'sms' && formData.message.length > 160) {
            if (!window.confirm("Message exceeds 160 characters. It may cost 2 credits per person. Continue?")) return;
        }

        if (!window.confirm(`Send this ${formData.type.toUpperCase()} to the '${formData.group}' group?`)) return;

        setLoading(true);
        try {
            const res = await api.post('/announcements', formData);
            alert(res.data.message);
            setFormData({ type: 'email', subject: '', group: 'all', message: '' }); 
            fetchHistory(); 
        } catch (err) {
            alert("Failed to send.");
        } finally {
            setLoading(false);
        }

        try {
            const res = await api.post('/announcements', formData);
            toast.success(res.data.message); // "SMS sent to 50 people"
            // ... reset form ...
        } catch (err) {
            toast.error("Failed to send message. Check credentials.");
        }
    };

    return (
        <div className="container">
            <h1>Communications Center</h1>

            <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
                
                {/* LEFT: Compose Form */}
                <div style={{flex: 1, minWidth: '300px'}}>
                    <div style={{background: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #e1e4e8'}}>
                        <h3 style={{marginBottom: '15px', color: 'var(--sidebar-blue)'}}>Compose Message</h3>
                        
                        <form onSubmit={handleSend}>
                            
                            {/* CHANNEL SELECTOR */}
                            <div style={{marginBottom: '15px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Channel</label>
                                <div style={{display: 'flex', gap: '10px'}}>
                                    <label style={{flex: 1, cursor: 'pointer', background: formData.type === 'email' ? '#e2e6ea' : 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center'}}>
                                        <input 
                                            type="radio" name="type" value="email" 
                                            checked={formData.type === 'email'} 
                                            onChange={handleChange} 
                                            style={{marginRight: '5px'}}
                                        /> 
                                        Email
                                    </label>
                                    <label style={{flex: 1, cursor: 'pointer', background: formData.type === 'sms' ? '#e2e6ea' : 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'center'}}>
                                        <input 
                                            type="radio" name="type" value="sms" 
                                            checked={formData.type === 'sms'} 
                                            onChange={handleChange} 
                                            style={{marginRight: '5px'}}
                                        /> 
                                        SMS
                                    </label>
                                </div>
                            </div>

                            <div style={{marginBottom: '15px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Recipient Group</label>
                                <select 
                                    name="group" 
                                    value={formData.group} onChange={handleChange}
                                    style={{width: '100%'}}
                                >
                                    <option value="all">All Active Members</option>
                                    <option value="staff">Staff Only</option>
                                    <option value="youth">Youth Ministry</option>
                                </select>
                            </div>

                            {/* Show Subject ONLY if Email */}
                            {formData.type === 'email' && (
                                <div style={{marginBottom: '15px'}}>
                                    <label style={{display: 'block', marginBottom: '5px'}}>Subject</label>
                                    <input 
                                        type="text" name="subject" required={formData.type === 'email'}
                                        value={formData.subject} onChange={handleChange}
                                        style={{width: '100%'}} placeholder="e.g. Sunday Service Reminder"
                                    />
                                </div>
                            )}

                            <div style={{marginBottom: '15px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                    <label style={{display: 'block', marginBottom: '5px'}}>Message</label>
                                    {formData.type === 'sms' && (
                                        <span style={{fontSize: '0.8rem', color: formData.message.length > 160 ? 'red' : 'green'}}>
                                            {formData.message.length} / 160 chars
                                        </span>
                                    )}
                                </div>
                                <textarea 
                                    name="message" required
                                    value={formData.message} onChange={handleChange}
                                    style={{width: '100%', height: '150px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px'}}
                                    placeholder={formData.type === 'sms' ? "Keep it short (max 160 chars recommended)" : "Type your message here..."}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={loading} style={{width: '100%'}}>
                                {loading ? 'Sending...' : `Send ${formData.type.toUpperCase()}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* RIGHT: History Log */}
                <div style={{flex: 1.5, minWidth: '300px'}}>
                    <h3 style={{marginBottom: '15px', color: 'var(--text-light)'}}>Sent History</h3>
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Subject / Snippet</th>
                                    <th>Sent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map(item => (
                                        <tr key={item.id}>
                                            <td style={{fontSize: '0.85rem'}}>{new Date(item.sent_at).toLocaleDateString()}</td>
                                            <td>
                                                {item.type === 'sms' ? 
                                                    <span className="badge" style={{background: '#e3f2fd', color: '#0d47a1'}}>SMS</span> : 
                                                    <span className="badge" style={{background: '#fff3e0', color: '#e65100'}}>EMAIL</span>
                                                }
                                            </td>
                                            <td style={{fontWeight: '500', fontSize: '0.9rem'}}>{item.subject}</td>
                                            <td style={{color: 'var(--success)', fontWeight: 'bold'}}>{item.sent_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>No history yet.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Announcements;