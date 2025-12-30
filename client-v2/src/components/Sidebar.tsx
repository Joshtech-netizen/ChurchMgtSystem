// 1. Define what the parent MUST pass down
interface SidebarProps {
  activeTab: string;
  onTabChange: (tabName: string) => void; // Function to call when clicked
}

interface MenuItem {
  name: string;
  icon: string;
}

// 2. Accept the props
export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  
  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Members", icon: "👥" },
    { name: "Finances", icon: "💰" },
    { name: "Media Team", icon: "📹" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider">CHURCH<span className="text-blue-500">CMS</span></h1>
        <p className="text-xs text-slate-400 mt-1">v2.0 Admin System</p>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            // 3. When clicked, tell the Parent!
            onClick={() => onTabChange(item.name)} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              // 4. Check props to see if active
              activeTab === item.name 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Profile section remains the same... */}
      <div className="absolute bottom-0 w-full p-4 bg-slate-900 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">JA</div>
          <div>
            <p className="text-sm font-semibold">Joseph Abassah</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};