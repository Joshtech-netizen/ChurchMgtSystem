import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddDonation from './AddDonation';
import { toast } from 'react-toastify';
// 1. Import Recharts components
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DonationList = () => {
    const [donations, setDonations] = useState([]);
    const [chartData, setChartData] = useState([]); // State for chart
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    // Fetch Table Data
    const fetchDonations = async () => {
        setLoading(true);
        try {
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

    // Fetch Chart Data (Separate call)
    const fetchChartData = async () => {
        try {
            const response = await api.get('/donations?stats=true');
            setChartData(response.data);
        } catch (error) {
            console.error("Chart data failed");
        }
    };

    useEffect(() => {
        fetchDonations();
        fetchChartData(); // Load chart on startup
        // eslint-disable-next-line
    }, []); 

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSuccess = () => {
        fetchDonations();
        fetchChartData(); // Refresh chart when new donation added
        setShowForm(false);
        toast.success("Donation recorded!");
    };

    const downloadCSV = () => {
        const headers = ["ID,Date,Member Name,Type,Amount,Notes"];
        const rows = donations.map(d => {
            const name = `"${d.member_name}"`; 
            const notes = `"${d.notes || ''}"`;
            return `${d.id},${d.date},${name},${d.type},${d.amount},${notes}`;
        });
        const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `donations_report.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.info("Report downloaded.");
    };

    const totalAmount = donations.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Financial Records</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={downloadCSV} className="btn" style={{background: '#27ae60', color: 'white'}}>
                        <span className="material-symbols-outlined">download</span> 
                        Export Excel
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        + Record Donation
                    </button>
                </div>
            </div>

            {/* --- OFFERING TRENDS CHART --- */}
            <div style={{
                background: '#fff', 
                padding: '20px', 
                borderRadius: '12px', 
                border: '1px solid #e1e4e8', 
                marginBottom: '30px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
                <h3 style={{fontSize: '1rem', color: 'var(--text-light)', marginBottom: '15px'}}>
                    Monthly Offering Trends (Last 6 Months)
                </h3>
                <div style={{width: '100%', height: 250}}>
                    <ResponsiveContainer>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#27ae60" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#27ae60" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="month" tick={{fontSize: 12}} />
                            <YAxis tick={{fontSize: 12}} />
                            <Tooltip 
                                formatter={(value) => [`$${parseFloat(value).toLocaleString()}`, 'Amount']}
                                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                            />
                            <Area type="monotone" dataKey="total" stroke="#27ae60" fillOpacity={1} fill="url(#colorVal)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* FILTER BAR */}
            <div style={{
                background: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'flex-end',
                border: '1px solid var(--border-color)',
                flexWrap: 'wrap'
            }}>
                <div>
                    <label style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)'}}>From:</label>
                    <input 
                        type="date" name="startDate" 
                        value={filters.startDate} onChange={handleFilterChange} 
                        style={{display: 'block', marginTop: '5px'}}
                    />
                </div>
                <div>
                    <label style={{fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-light)'}}>To:</label>
                    <input 
                        type="date" name="endDate" 
                        value={filters.endDate} onChange={handleFilterChange} 
                        style={{display: 'block', marginTop: '5px'}}
                    />
                </div>
                <button onClick={fetchDonations} className="btn btn-primary" style={{height: '38px'}}>Filter</button>
                <button 
                    onClick={() => setFilters({startDate: '', endDate: ''})} 
                    className="btn" 
                    style={{height: '38px', background: 'transparent', color: 'var(--text-light)', border: '1px solid #ccc'}}
                >
                    Clear
                </button>

                <div style={{marginLeft: 'auto', textAlign: 'right'}}>
                    <span style={{display: 'block', fontSize: '0.85rem', color: 'var(--text-light)'}}>Total for Period</span>
                    <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--sidebar-blue)'}}>
                        ${totalAmount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* MODAL */}
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
                                        <td style={{color: '#7f8c8d', fontSize: '0.9rem'}}>{d.notes}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No donations found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default DonationList;