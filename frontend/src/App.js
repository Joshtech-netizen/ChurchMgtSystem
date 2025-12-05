import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import DonationList from './components/DonationList'; // We will create this next!
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{display: 'flex'}}>
        <Sidebar />
        <div style={{flex: 1, marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f4f7f6'}}>
           <Routes>
             <Route path="/" element={<Dashboard />} />
             <Route path="/members" element={<MemberList />} />
             <Route path="/donations" element={<DonationList />} />
             <Route path="/attendance" element={<Attendance />} />
           </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;