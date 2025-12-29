import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Users = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'finance'
    });

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchUsers();
        }
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to load users");
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            toast.success("New staff account created!");
            setFormData({ first_name: '', last_name: '', email: '', password: '', role: 'finance' });
            setShowForm(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Revoke access for this user?")) {
            try {
                await api.delete(`/users/${id}`);
                toast.success("Access revoked.");
                setUsers(users.filter(u => u.id !== id));
            } catch (err) {
                toast.error("Failed to delete user.");
            }
        }
    };

    if (user?.role !== 'admin') return <div className="container"><h3>Unauthorized</h3></div>;

    return (
        <div className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <h1>System Staff</h1>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add New Staff</button>
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Register New Staff</h2>
                        <form onSubmit={handleCreateUser}>
                            <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                                <input type="text" placeholder="First Name" required className="form-control"
                                    value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                                <input type="text" placeholder="Last Name" required className="form-control"
                                    value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <input type="email" placeholder="Email Address" required className="form-control" style={{width:'100%'}}
                                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                            </div>
                            <div style={{marginBottom: '15px'}}>
                                <input type="password" placeholder="Temporary Password" required className="form-control" style={{width:'100%'}}
                                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                            </div>
                            <div style={{marginBottom: '20px'}}>
                                <label style={{display: 'block', marginBottom: '5px'}}>Assign Role</label>
                                <select className="form-control" style={{width:'100%'}} value={formData.role} 
                                    onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="finance">Finance Officer</option>
                                    <option value="youth">Youth Leader</option>
                                    <option value="clerk">Church Clerk</option>
                                    <option value="admin">Super Admin</option>
                                </select>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" className="btn btn-primary" style={{flex: 1}}>Create Account</button>
                                <button type="button" className="btn" style={{flex: 1}} onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.first_name} {u.last_name}</td>
                                <td>{u.email}</td>
                                <td><span className="badge">{u.role}</span></td>
                                <td>
                                    {u.id !== user.id && (
                                        <button onClick={() => handleDelete(u.id)} style={{color: 'red', background: 'none', border: 'none', cursor: 'pointer'}}>
                                            Delete
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;