import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AttendancePage = () => {
    const [events, setEvents] = useState([]); // List of events
    const [selectedEventId, setSelectedEventId] = useState(''); // Which event we are checking
    
    const [members, setMembers] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(false);

    // 1. Load Events on Start
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events');
                setEvents(res.data);
            } catch (err) {
                console.error("Failed to load events");
            }
        };
        fetchEvents();
        // Also load members once
        const fetchMembers = async () => {
            const res = await api.get('/members');
            setMembers(res.data);
        };
        fetchMembers();
    }, []);

    // 2. When Event Changes, Load Attendance
    useEffect(() => {
        if (selectedEventId) {
            loadAttendance(selectedEventId);
        } else {
            setAttendanceRecords([]);
        }
    }, [selectedEventId]);

    const loadAttendance = async (eventId) => {
        setLoading(true);
        try {
            const res = await api.get(`/attendance?event_id=${eventId}`);
            setAttendanceRecords(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (memberId) => {
        if (!selectedEventId) return alert("Please select an event first!");
        try {
            await api.post('/attendance', {
                member_id: memberId,
                event_id: selectedEventId,
                status: 'present'
            });
            loadAttendance(selectedEventId); // Refresh list
        } catch (err) {
            alert("Check-in failed");
        }
    };

    const isPresent = (memberId) => {
        return attendanceRecords.some(record => record.member_id === memberId);
    };

    return (
        <div className="container">
            <div style={{marginBottom: '20px'}}>
                <h1>Attendance Check-in</h1>
                
                <label style={{display: 'block', marginBottom: '8px', color: '#666'}}>Select Event to Take Attendance For:</label>
                <select 
                    value={selectedEventId} 
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    style={{width: '100%', maxWidth: '400px', padding: '10px', fontSize: '1rem'}}
                >
                    <option value="">-- Choose an Event --</option>
                    {events.map(event => (
                        <option key={event.id} value={event.id}>
                            {event.title} ({new Date(event.event_date).toLocaleDateString()})
                        </option>
                    ))}
                </select>
            </div>

            {/* Only show list if event is selected */}
            {!selectedEventId ? (
                <div style={{textAlign: 'center', padding: '40px', color: '#888', background: '#f9f9f9', borderRadius: '8px'}}>
                    Please select an event from the dropdown above to start taking attendance.
                </div>
            ) : (
                <div className="table-wrapper">
                    {loading && <p style={{padding: '10px'}}>Loading records...</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>Member Name</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => {
                                const attended = isPresent(member.id);
                                return (
                                    <tr key={member.id} style={{background: attended ? '#f0f9eb' : 'white'}}>
                                        <td style={{fontWeight: '500'}}>{member.first_name} {member.last_name}</td>
                                        <td>
                                            {attended ? (
                                                <span className="badge active">✅ Present</span>
                                            ) : (
                                                <span className="badge" style={{background: '#eee', color: '#777'}}>Absent</span>
                                            )}
                                        </td>
                                        <td>
                                            {!attended && (
                                                <button 
                                                    className="btn btn-primary" 
                                                    onClick={() => handleCheckIn(member.id)}
                                                    style={{padding: '5px 15px'}}
                                                >
                                                    Mark Present
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AttendancePage;