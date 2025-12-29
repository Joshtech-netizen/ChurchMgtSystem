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
            navigate('/'); 
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
                    <h1 style={{color: 'white', fontSize: '2.5rem', margin: '0 0 10px 0'}}>Church Admin</h1>
                    <p style={{fontSize: '1.1rem', opacity: 0.8, fontWeight: '300'}}>
                        Manage Members, Donations & Events.
                    </p>
                </div>
            </div>

            <div style={styles.rightSide}>
                <div style={styles.formBox}>
                    <div style={{marginBottom: '30px'}}>
                        <h2 style={{fontSize: '2rem', color: 'var(--sidebar-blue)', marginBottom: '10px'}}>Welcome Back</h2>
                        <p style={{color: 'var(--text-light)'}}>Please enter your details to sign in.</p>
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
                        <button type="submit" className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: '1rem'}}>
                            Sign In
                        </button>
                    </form>
                 </div>
            </div>
        </div>
    );
};

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

export default Login;