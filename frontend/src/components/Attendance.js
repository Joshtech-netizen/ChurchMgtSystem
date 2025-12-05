import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AttendancePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [members, setMembers] = useState([]);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load data whenever the date changes
    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 1. Get All Members
            const membersRes = await api.get('/members');
            // 2. Get Attendance for selected date
            const attendanceRes = await api.get(`/attendance?date=${selectedDate}`);
            
            setMembers(membersRes.data);
            setAttendanceRecords(attendanceRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCheckIn = async (memberId) => {
        try {
            await api.post('/attendance', {
                member_id: memberId,
                date: selectedDate,
                status: 'present'
            });
            // Refresh data to show the green checkmark
            loadData();
        } catch (err) {
            alert("Check-in failed");
        }
    };

    // Helper to check if a specific member ID is in the attendance list
    const isPresent = (memberId) => {
        return attendanceRecords.some(record => record.member_id === memberId);
    };

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Attendance Check-in</h1>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{padding: '10px', fontSize: '1em', borderRadius: '5px', border: '1px solid #ccc'}}
                />
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status for {selectedDate}</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {members.map(member => {
                                const attended = isPresent(member.id);
                                return (
                                    <tr key={member.id} style={{background: attended ? '#f0f9eb' : 'white'}}>
                                        <td>{member.first_name} {member.last_name}</td>
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