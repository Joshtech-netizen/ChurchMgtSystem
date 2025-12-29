import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AddDonation = ({ onDonationAdded, onCancel }) => {
    const [formData, setFormData] = useState({
        member_id: '',
        amount: '',
        type: 'tithe',
        date: new Date().toISOString().split('T')[0],
        notes: ''
    });
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await api.get('/members');
                setMembers(response.data);
            } catch (err) {
                console.error("Could not load members", err);
            }
        };
        fetchMembers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/donations', formData);
            onDonationAdded();
        } catch (err) {
            alert("Error recording donation.");
        }
    };

    return (
      <div>
        <h2>Record Donation</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label>Member</label>
            <select
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            >
              <option value="">-- Select Member --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.first_name} {m.last_name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Amount ($)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                required
                style={{ width: "100%" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                style={{ width: "100%" }}
              >
                <option value="tithe">Tithe</option>
                <option value="offering">Offering</option>
                <option value="welfare">Welfare</option>
                <option value="benevolence">Benevolence</option>
                <option value="building_fund">Building Fund</option>
                <option value="pledge_payment">Pledge Payment</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              placeholder="Optional"
              value={formData.notes}
              onChange={handleChange}
              style={{ width: "100%" }}
            />
          </div>

          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
          >
            <button
              type="button"
              onClick={onCancel}
              className="btn"
              style={{ background: "#e2e6ea", color: "#4a5568" }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Record
            </button>
          </div>
        </form>
      </div>
    );
};

export default AddDonation;