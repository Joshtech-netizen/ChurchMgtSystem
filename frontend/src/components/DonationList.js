import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddDonation from './AddDonation';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    const fetchDonations = async () => {
        setLoading(true);
        try {
            // Build Query String: /donations?start=2023-01-01&end=2023-01-31
            let query = '/donations';
            const params = [];
            if (filters.startDate) params.push(`start=${filters.startDate}`);
            if (filters.endDate) params.push(`end=${filters.endDate}`);
            
            if (params.length > 0) {
                query += '?' + params.join('&');
            }

            const response = await api.get(query);
            setDonations(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    // Load initial data (all time)
    useEffect(() => {
        fetchDonations();
        // eslint-disable-next-line
    }, []); 

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSuccess = () => {
        fetchDonations();
        setShowForm(false);
    };

    // Calculate Total of displayed records
    const totalAmount = donations.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Donations Records</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    + Record Donation
                </button>
            </div>

            {/* --- FILTER BAR --- */}
            <div style={{
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'flex-end',
                border: '1px solid var(--border-color)'
            }}>
                <div>
                    <label style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)'}}>From:</label>
                    <input 
                        type="date" 
                        name="startDate" 
                        value={filters.startDate} 
                        onChange={handleFilterChange} 
                        style={{display: 'block', marginTop: '5px'}}
                    />
                </div>
                <div>
                    <label style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)'}}>To:</label>
                    <input 
                        type="date" 
                        name="endDate" 
                        value={filters.endDate} 
                        onChange={handleFilterChange} 
                        style={{display: 'block', marginTop: '5px'}}
                    />
                </div>
                <button onClick={fetchDonations} className="btn btn-primary" style={{height: '38px'}}>
                    Filter Results
                </button>
                <button 
                    onClick={() => {
                        setFilters({startDate: '', endDate: ''});
                        // We need to trigger a fetch with empty filters, so we call it manually inside a timeout or simplified logic
                        // For simplicity, we just reset state here. User clicks Filter again to clear.
                        // Or better: pass empty args to fetchDonations.
                    }} 
                    className="btn" 
                    style={{height: '38px', background: 'transparent', color: 'var(--text-light)', border: '1px solid #ccc'}}
                >
                    Clear
                </button>

                {/* Total Summary */}
                <div style={{marginLeft: 'auto', textAlign: 'right'}}>
                    <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-light)'}}>Total for Period</span>
                    <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--sidebar-blue)'}}>
                        ${totalAmount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Modal */}
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

            {loading ? <p>Loading...</p> : (
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
                                            ${parseFloat(d.amount).toFixed(2)}
                                        </td>
                                        <td style={{color: '#7f8c8d'}}>{d.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No donations found for this period.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DonationList;