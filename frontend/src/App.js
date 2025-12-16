import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import DonationList from './components/DonationList';
import AttendancePage from './components/AttendancePage';
import './App.css';

// A wrapper component to handle the Layout logic
const AppLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // If user is NOT logged in, show Login Page
    if (!user) {
        return (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        );
    }

    // If user IS logged in, show the App Layout
    return (
        <div className="App" style={{display: 'flex'}}>
            <Sidebar isOpen={isSidebarOpen} />
            
            <div 
                className="main-content" 
                style={{
                    flex: 1, 
                    marginLeft: isSidebarOpen ? '260px' : '0', 
                    width: '100%'
                }}
            >
               {/* Header Bar */}
               <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="menu-btn">
                            <span className="material-symbols-outlined" style={{fontSize: '2rem', color: 'var(--sidebar-blue)'}}>menu</span>
                        </button>
                        <h4 style={{marginLeft: '15px', color: '#777', fontWeight: '400'}}>Church Management System</h4>
                    </div>
                    
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span style={{fontWeight: '500', color: 'var(--sidebar-blue)'}}>
                            Hi, {user.first_name}
                        </span>
                        <button onClick={logout} className="btn" style={{background: '#ffebee', color: '#c62828', padding: '5px 10px'}}>
                            Logout
                        </button>
                    </div>
               </div>

               <Routes>
                 <Route path="/" element={<Dashboard />} />
                 <Route path="/members" element={<MemberList />} />
                 <Route path="/donations" element={<DonationList />} />
                 <Route path="/attendance" element={<AttendancePage />} />
                 {/* Redirect any unknown route to dashboard */}
                 <Route path="*" element={<Navigate to="/" />} />
               </Routes>
            </div>
        </div>
    );
};

function App() {
  return (
    <AuthProvider>
        <Router>
            <AppLayout />
        </Router>
    </AuthProvider>
  );
}

export default App;