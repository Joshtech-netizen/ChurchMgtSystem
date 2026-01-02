import { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, Users, Banknote, Video, Menu, 
  Baby, Heart, Tent, Mic2, NotebookPen 
} from 'lucide-react';
import { type User, type UserRole } from './types';

// --- COMPONENT IMPORTS ---
import { LoginView } from './components/LoginView';
import { DashboardHome } from './components/DashboardHome';
import { MembersView } from './components/MembersView';
import { FinanceView } from './components/FinanceView';
import { MediaView } from './components/MediaView';
import { MinistryView } from './components/MinistryView';
import { UserProfileModal } from './components/UserProfileModal';
import { Sidebar } from './components/Sidebar';

// --- ACCESS CONTROL CONFIGURATION ---
interface MenuItem {
  id: string;
  label: string;
  icon: any;
  allowedRoles: UserRole[];
}

const MENU_CONFIG: MenuItem[] = [
  // 1. GENERAL MANAGEMENT
  { 
    id: "Dashboard", 
    label: "General Dashboard", 
    icon: LayoutDashboard, 
    allowedRoles: ['Super Admin', 'Admin'] 
  },
  { 
    id: "Finances", 
    label: "Finances", 
    icon: Banknote, 
    allowedRoles: ['Super Admin', 'Admin'] 
  },
  { 
    id: "Members", 
    label: "Members Directory", 
    icon: Users, 
    allowedRoles: ['Super Admin', 'Admin'] 
  },
  { 
    id: "Media Team", 
    label: "Media Team", 
    icon: Video, 
    allowedRoles: ['Super Admin', 'Admin'] 
  },

  // 2. SPECIFIC MINISTRY DASHBOARDS
  { 
    id: "Youth", 
    label: "Youth Ministry", 
    icon: Tent, 
    allowedRoles: ['Super Admin', 'Admin', 'Youth Leader'] 
  },
  { 
    id: "Children", 
    label: "Children Ministry", 
    icon: Baby, 
    allowedRoles: ['Super Admin', 'Admin', 'Children Leader'] 
  },
  { 
    id: "Women", 
    label: "Women Ministry", 
    icon: Heart, 
    allowedRoles: ['Super Admin', 'Admin', 'Women Leader'] 
  },
  { 
    id: "Evangelism", 
    label: "Evangelism", 
    icon: Mic2, 
    allowedRoles: ['Super Admin', 'Admin', 'Evangelism Leader'] 
  },
  { 
    id: "Visitation", 
    label: "Visitation", 
    icon: NotebookPen, 
    allowedRoles: ['Super Admin', 'Admin', 'Visitation Leader'] 
  },
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // 1. RESTORE SESSION
  useEffect(() => {
    const savedUser = localStorage.getItem('church_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem('church_user');
      }
    }
  }, []);

  // 2. CALCULATE ACCESSIBLE TABS
  const accessibleMenu = useMemo(() => {
    if (!user) return [];
    return MENU_CONFIG.filter(item => item.allowedRoles.includes(user.role));
  }, [user]);

  // 3. SET DEFAULT TAB ON LOGIN
  useEffect(() => {
    if (user && accessibleMenu.length > 0) {
      const isAllowed = accessibleMenu.find(item => item.id === activeTab);
      if (!isAllowed) {
        setActiveTab(accessibleMenu[0].id);
      }
    }
  }, [user, accessibleMenu, activeTab]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('church_user');
      setUser(null);
      setActiveTab("");
    }
  };

  if (!user) {
    return <LoginView onLoginSuccess={handleLogin} />;
  }

  // 4. VIEW ROUTER
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard": return <DashboardHome />;
      case "Members": return <MembersView />;
      case "Finances": return <FinanceView />;
      case "Media Team": return <MediaView />; // MediaView usually doesn't need props unless modified
      
      // Ministries
      case "Youth": return <MinistryView title="Youth Ministry" color="bg-orange-500" />;
      case "Children": return <MinistryView title="Children Ministry" color="bg-blue-400" />;
      case "Women": return <MinistryView title="Women's Fellowship" color="bg-pink-600" />;
      case "Evangelism": return <MinistryView title="Evangelism" color="bg-red-600" />;
      case "Visitation": return <MinistryView title="Visitation Team" color="bg-green-600" />;
      
      default: return <div className="p-8">Select a menu item</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      
      {/* --- 1. PROFILE MODAL (FIXED: NOW INSIDE RETURN) --- */}
      <UserProfileModal 
        user={user} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* --- 2. MOBILE OVERLAY --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* --- 3. SIDEBAR --- */}
      <Sidebar 
        user={user}
        activeTab={activeTab}
        isOpen={isSidebarOpen}
        menuItems={accessibleMenu}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        onProfileClick={() => setIsProfileOpen(true)}
      />

      {/* --- 4. MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:hidden shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
            <span className="font-bold text-slate-800">{activeTab}</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;