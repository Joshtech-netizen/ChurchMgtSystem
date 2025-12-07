import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import DonationList from './components/DonationList';
import AttendancePage from './components/AttendancePage'; // Make sure this is imported
import './App.css';

function App() {
  // State to track if sidebar is visible
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>
      <div className="App" style={{display: 'flex'}}>
        
        {/* Pass state to Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Adjust Main Content based on sidebar state */}
        <div 
            className="main-content" 
            style={{
                flex: 1, 
                // If sidebar is open, push content 260px. If closed, 0px.
                marginLeft: isSidebarOpen ? '260px' : '0', 
                width: '100%'
            }}
        >
           {/* Top Bar with the Menu Button */}
           <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
                <button onClick={toggleSidebar} className="menu-btn" title="Toggle Sidebar">
                    <span className="material-symbols-outlined" style={{fontSize: '2rem', color: '#002b59'}}>
                        menu
                    </span>
                </button>
                {/* Optional: Add a Title or Breadcrumb next to the button */}
                <h4 style={{marginLeft: '15px', color: '#777', fontWeight: '400'}}>
                   Church Management System
                </h4>
           </div>

           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/members" element={<MemberList />} />
             <Route path="/donations" element={<DonationList />} />
             <Route path="/attendance" element={<AttendancePage />} />
           </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;