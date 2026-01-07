import { LogOut, X, type LucideIcon } from 'lucide-react';
import { type User } from '../types';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon; // Tells TS this is a valid icon component
}

// 1. Define exactly what the Parent (App.tsx) needs to provide
interface SidebarProps {
  user: User;
  activeTab: string;
  isOpen: boolean;
  menuItems: MenuItem[]; // The list of allowed tabs (calculated in App.tsx)
  onTabChange: (tabId: string) => void;
  onClose: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}

export const Sidebar = ({ 
  user, 
  activeTab, 
  isOpen, 
  menuItems, 
  onTabChange, 
  onClose, 
  onLogout, 
  onProfileClick 
}: SidebarProps) => {

  return (
    <aside 
      className={`fixed md:relative z-30 h-full w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-64'
      }`}
    >
      
      {/* --- HEADER --- */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="min-w-[2.5rem] w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-900/50">
            ⛪
          </div>
          <div className="font-bold text-white whitespace-nowrap opacity-100 md:opacity-0 lg:opacity-100 transition-opacity">
            ChurchSys
          </div>
        </div>
        {/* Mobile Close Button */}
        <button type="button" onClick={onClose} className="md:hidden text-slate-400 hover:text-white" aria-label="Close sidebar" title="Close sidebar">
          <X size={24} />
        </button>
      </div>

      {/* --- NAVIGATION MENU --- */}
      <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon; // Get the Lucide icon component
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 group relative
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              title={item.label}
            >
              <span className="shrink-0"><Icon size={20} /></span>
              <span className="font-medium whitespace-nowrap md:hidden lg:block">{item.label}</span>
              
              {/* Active Indicator Bar (Desktop collapsed view) */}
              {isActive && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-white/30 rounded-full md:hidden lg:block" />
              )}
            </button>
          );
        })}
      </nav>

      {/* --- USER PROFILE & LOGOUT --- */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        
        {/* Clickable User Area -> Triggers Profile Modal */}
        <div 
          onClick={onProfileClick} 
          className="flex items-center gap-3 mb-4 overflow-hidden cursor-pointer hover:bg-slate-800 p-2 -mx-2 rounded-lg transition group"
          title="Edit Profile"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="md:hidden lg:block overflow-hidden">
            <p className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">
              {user.username}
            </p>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1">
              {user.role} <span className="text-[10px] text-blue-500 font-bold">(Edit)</span>
            </p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors group"
          title="Log Out"
        >
          <LogOut size={20} />
          <span className="font-medium md:hidden lg:block group-hover:translate-x-1 transition-transform">
            Log Out
          </span>
        </button>
      </div>

    </aside>
  );
};