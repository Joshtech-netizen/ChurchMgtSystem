import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Pledges = () => {
    const [pledges, setPledges] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        member_id: '',
        campaign_name: '',
        amount_promised: '',
        deadline: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [pRes, mRes] = await Promise.all([
                api.get('/pledges'),
                api.get('/members')
            ]);
            setPledges(pRes.data);
            setMembers(mRes.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load data");
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/pledges', formData);
            toast.success("Pledge Recorded!");
            setShowForm(false);
            loadData();
        } catch (err) {
            toast.error("Failed to create pledge");
        }
    };

    // Quick Update Payment Function
    const addPayment = async (id) => {
        const amount = prompt("Enter amount paid towards this pledge:");
        if (amount && !isNaN(amount)) {
            try {
                await api.put(`/pledges/${id}`, { amount: parseFloat(amount) });
                toast.success("Payment Recorded!");
                loadData();
            } catch(err) {
                toast.error("Update failed");
            }
        }
    };

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>Church Pledges</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ New Pledge</button>
            </div>

            {/* FORM MODAL (Inline for brevity, better in separate component) */}
            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Pledge Commitment</h2>
                        <form onSubmit={handleCreate}>
                            <div style={{marginBottom: '15px'}}>
                                <label>Member</label>
                                <select 
                                    className="form-control"
                                    value={formData.member_id}
                                    onChange={(e) => setFormData({...formData, member_id: e.target.value})}
                                    required
                                    style={{width: '100%', padding: '8px'}}
                                >
                                    <option value="">Select Member</option>
                                    {members.map(m => <option key={m.id} value={m.id}>{m.first_name} {m.last_name}</option>)}
                                </select>
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <label>Campaign Name</label>
                                <input type="text" placeholder="e.g. Building Fund 2025" required style={{width: '100%', padding: '8px'}} 
                                    value={formData.campaign_name} onChange={e => setFormData({...formData, campaign_name: e.target.value})} />
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <label>Amount Promised ($)</label>
                                <input type="number" required style={{width: '100%', padding: '8px'}} 
                                    value={formData.amount_promised} onChange={e => setFormData({...formData, amount_promised: e.target.value})} />
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <label>Deadline</label>
                                <input type="date" required style={{width: '100%', padding: '8px'}} 
                                    value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                            </div>
                            <button type="submit" className="btn btn-primary">Save Pledge</button>
                            <button type="button" className="btn" onClick={() => setShowForm(false)} style={{marginLeft:'10px'}}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* PLEDGE LIST */}
            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Campaign</th>
                            <th>Member</th>
                            <th>Progress</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pledges.map(p => {
                            const percent = Math.min((p.amount_paid / p.amount_promised) * 100, 100);
                            return (
                                <tr key={p.id}>
                                    <td style={{fontWeight: '500'}}>{p.campaign_name}</td>
                                    <td>{p.member_name}</td>
                                    <td style={{width: '200px'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '3px'}}>
                                            <span>${p.amount_paid}</span>
                                            <span>${p.amount_promised}</span>
                                        </div>
                                        <div style={{width: '100%', background: '#e0e0e0', borderRadius: '4px', height: '10px'}}>
                                            <div style={{
                                                width: `${percent}%`, 
                                                background: percent >= 100 ? '#27ae60' : '#3498db', 
                                                height: '100%', borderRadius: '4px'
                                            }}></div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${p.status === 'completed' ? 'active' : 'visitor'}`}>
                                            {p.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn" style={{fontSize: '0.8rem', padding: '5px 10px', background: '#e2e6ea'}}
                                            onClick={() => addPayment(p.id)}>
                                            Record Pay
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Pledges;