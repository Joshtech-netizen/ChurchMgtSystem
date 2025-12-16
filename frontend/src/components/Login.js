import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/'); // Redirect to Dashboard on success
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={{textAlign: 'center', marginBottom: '30px'}}>
                    <span className="material-symbols-outlined" style={{fontSize: '4rem', color: 'var(--primary-blue)'}}>church</span>
                    <h2 style={{marginTop: '10px', color: 'var(--sidebar-blue)'}}>Church Admin</h2>
                    <p style={{color: 'var(--text-light)'}}>Sign in to manage your church</p>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom: '20px'}}>
                        <label style={styles.label}>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required 
                            style={styles.input}
                            placeholder="admin@church.com"
                        />
                    </div>
                    <div style={{marginBottom: '30px'}}>
                        <label style={styles.label}>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            style={styles.input}
                            placeholder="••••••"
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{width: '50%', padding: '12px'}}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light-blue-bg)'
    },
    card: {
        background: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        width: '100%',
        maxWidth: '400px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: 'var(--text-dark)'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid var(--border-color)',
        fontSize: '1rem'
    },
    error: {
        background: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '0.9rem'
    }
};

export default Login;