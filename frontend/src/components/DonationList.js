import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddDonation from './AddDonation';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Function to fetch data
    const fetchDonations = async () => {
        try {
            const response = await api.get('/donations');
            setDonations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching donations:", error);
            setLoading(false);
        }
    };

    // Load data on start
    useEffect(() => {
        fetchDonations();
    }, []);

    // Handle successful addition
    const handleSuccess = () => {
        fetchDonations(); // Refresh table
        setShowForm(false); // Close form
    };

    if (loading) return <div className="container">Loading donations...</div>;

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Donations</h1>
                {!showForm && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Record Donation
                    </button>
                )}
            </div>

            {/* Show Form Logic */}
            {showForm && (
                <AddDonation 
                    onDonationAdded={handleSuccess} 
                    onCancel={() => setShowForm(false)} 
                />
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
                                    <td>
                                        <span className="badge" style={{background: '#e0e0e0', color: '#333'}}>
                                            {d.type}
                                        </span>
                                    </td>
                                    <td style={{fontWeight: 'bold', color: '#27ae60'}}>
                                        ${d.amount}
                                    </td>
                                    <td style={{color: '#7f8c8d', fontSize: '0.9em'}}>
                                        {d.notes}
                                    </td>
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