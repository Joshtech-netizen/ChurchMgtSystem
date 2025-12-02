import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{display: 'flex'}}>
        {/* 1. Sidebar stays on the left */}
        <Sidebar />

        {/* 2. Main Content Area */}
        <div style={{flex: 1, marginLeft: '250px', padding: '20px', minHeight: '100vh', backgroundColor: '#f4f7f6'}}>
           <Routes>
             {/* When URL is /, show Dashboard */}
             <Route path="/" element={<Dashboard />} />
             
             {/* When URL is /members, show MemberList */}
             <Route path="/members" element={<MemberList />} />
           </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;