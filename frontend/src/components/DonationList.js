import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddDonation from './AddDonation';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const fetchDonations = async () => {
        try {
            const response = await api.get('/donations');
            setDonations(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const handleSuccess = () => {
        fetchDonations();
        setShowForm(false);
    };

    if (loading) return <div className="container">Loading donations...</div>;

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Donations Records</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Record Donation
                </button>
            </div>

            {/* --- MODAL WRAPPER --- */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddDonation 
                            onDonationAdded={handleSuccess} 
                            onCancel={() => setShowForm(false)} 
                        />
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Member</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length > 0 ? (
                            donations.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.date}</td>
                                    <td><strong>{d.member_name}</strong></td>
                                    <td><span className="badge">{d.type}</span></td>
                                    <td style={{fontWeight: 'bold', color: 'var(--success)'}}>
                                        ${d.amount}
                                    </td>
                                    <td style={{color: '#7f8c8d'}}>{d.notes}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{textAlign: 'center'}}>No donations recorded yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DonationList;