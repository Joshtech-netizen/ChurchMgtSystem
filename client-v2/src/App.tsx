import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Banknote, Video, LogOut, Menu, X } from 'lucide-react';
import {type User } from './types';

// --- COMPONENT IMPORTS ---
import { LoginView } from './components/LoginView';
import { DashboardHome } from './components/DashboardHome';
import { MembersView } from './components/MembersView';
import { MediaView } from './components/MediaView';

function App() {
  // 1. GLOBAL STATE
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. RESTORE SESSION ON LOAD
  useEffect(() => {
    const savedUser = localStorage.getItem('church_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session");
        localStorage.removeItem('church_user');
      }
    }
  }, []);

  // 3. HANDLERS
  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setActiveTab("Dashboard"); // Reset to home on login
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('church_user');
      setUser(null);
    }
  };

  // 4. THE AUTH GUARD (Stop here if not logged in)
  if (!user) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  // 5. VIEW ROUTER
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardHome />;
      case "Members":
        return <MembersView />;
      //case "Finances":
        //return <FinanceView />;
      case "Media Team":
        return <MediaView />;
      default:
        return <DashboardHome />;
    }
  };

  // 6. MAIN APP LAYOUT
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- MOBILE OVERLAY (Closes sidebar when clicking outside) --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside 
        className={`fixed md:relative z-30 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="min-w-[2.5rem] w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
              ⛪
            </div>
            <div className="font-bold text-white whitespace-nowrap opacity-100 md:opacity-0 lg:opacity-100 transition-opacity">
              ChurchSys
            </div>
          </div>
          {/* Close Button (Mobile Only) */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 space-y-2 px-3">
          <NavButton 
            active={activeTab === "Dashboard"} 
            onClick={() => setActiveTab("Dashboard")} 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
          />
          <NavButton 
            active={activeTab === "Members"} 
            onClick={() => setActiveTab("Members")} 
            icon={<Users size={20} />} 
            label="Members" 
          />
          <NavButton 
            active={activeTab === "Finances"} 
            onClick={() => setActiveTab("Finances")} 
            icon={<Banknote size={20} />} 
            label="Finances" 
          />
          <NavButton 
            active={activeTab === "Media Team"} 
            onClick={() => setActiveTab("Media Team")} 
            icon={<Video size={20} />} 
            label="Media Team" 
          />
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="md:hidden lg:block overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.username}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors group"
            title="Log Out"
          >
            <LogOut size={20} />
            <span className="font-medium md:hidden lg:block group-hover:translate-x-1 transition-transform">Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        
        {/* Top Header (Mobile Toggle) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800">{activeTab}</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>

    </div>
  );
}

// --- HELPER COMPONENT: NAV BUTTON ---
interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton = ({ active, onClick, icon, label }: NavButtonProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 group relative
      ${active 
        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    title={label}
  >
    <span className="shrink-0">{icon}</span>
    <span className="font-medium whitespace-nowrap md:hidden lg:block">{label}</span>
    
    {/* Active Indicator Bar */}
    {active && (
      <div className="absolute left-0 top-2 bottom-2 w-1 bg-white/30 rounded-full md:hidden lg:block" />
    )}
  </button>
);

export default App;