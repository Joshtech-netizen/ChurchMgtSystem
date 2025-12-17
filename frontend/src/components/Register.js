import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'admin' // Default role set to 'admin'
    });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData.first_name, formData.last_name, formData.email, formData.password, formData.role);
            alert("Registration successful! Please login.");
            navigate('/login');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.leftSide}>
                <div style={styles.brandContent}>
                    <span className="material-symbols-outlined" style={{fontSize: '6rem', marginBottom: '20px', textShadow: '0 4px 10px rgba(0,0,0,0.2)'}}>
                        church
                    </span>
                    <h1 style={{color: 'white', fontSize: '2.5rem', margin: '0 0 10px 0'}}>Join the Team</h1>
                    <p style={{fontSize: '1.1rem', opacity: 0.8, fontWeight: '300'}}>
                        Create an account to manage church records.
                    </p>
                </div>
            </div>

            <div style={styles.rightSide}>
                <div style={styles.formBox}>
                    <div style={{marginBottom: '30px'}}>
                        <h2 style={{fontSize: '2rem', color: 'var(--sidebar-blue)', marginBottom: '10px'}}>Create Account</h2>
                        <p style={{color: 'var(--text-light)'}}>Enter your details below.</p>
                    </div>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{display: 'flex', gap: '15px', marginBottom: '20px'}}>
                            <div style={{flex: 1}}>
                                <label style={styles.label}>First Name</label>
                                <input 
                                    type="text" name="first_name" required
                                    value={formData.first_name} onChange={handleChange}
                                    style={styles.input} placeholder="John"
                                />
                            </div>
                            <div style={{flex: 1}}>
                                <label style={styles.label}>Last Name</label>
                                <input 
                                    type="text" name="last_name" required
                                    value={formData.last_name} onChange={handleChange}
                                    style={styles.input} placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <label style={styles.label}>Email Address</label>
                            <input 
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                style={styles.input} placeholder="john@church.com"
                            />
                        </div>

                        <div style={{marginBottom: '20px'}}>
                            <label style={styles.label}>Committee / Role</label>
                            <select 
                                name="role" 
                                value={formData.role} 
                                onChange={handleChange} 
                                style={styles.input}
                            >
                                <option value="youth">Youth Committee</option>
                                <option value="children">Children's Ministry</option>
                                <option value="finance">Finance Committee</option>
                                <option value="building">Building Committee</option>
                                <option value="evangelism">Evangelism Team</option>
                                <option value="admin">System Admin (Preacher)</option>
                            </select>
                        </div>

                        <div style={{marginBottom: '30px'}}>
                            <label style={styles.label}>Password</label>
                            <input 
                                type="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                style={styles.input} placeholder="••••••"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: '1rem'}}>
                            Sign Up
                        </button>
                    </form>
                    
                    <p style={{marginTop: '20px', textAlign: 'center', fontSize: '0.9rem'}}>
                        Already have an account? <Link to="/login" style={{color: 'var(--primary-blue)', fontWeight: '600', textDecoration: 'none'}}>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

// Reusing styles for consistency
const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: "'Poppins', sans-serif" },
    leftSide: { flex: 1, background: 'linear-gradient(135deg, var(--sidebar-blue) 0%, var(--primary-blue) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' },
    brandContent: { textAlign: 'center', padding: '40px', maxWidth: '500px' },
    rightSide: { flex: 1, background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' },
    formBox: { width: '100%', maxWidth: '450px' },
    label: { display: 'block', marginBottom: '8px', fontWeight: '500', color: 'var(--text-dark)', fontSize: '0.9rem' },
    input: { width: '100%', padding: '12px 15px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#f9f9f9', outline: 'none' },
    error: { background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '0.9rem', borderLeft: '4px solid #c62828' }
};

export default Register;