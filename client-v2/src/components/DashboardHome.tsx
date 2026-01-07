import { useState, useEffect } from 'react';


interface ActivityItem {
  type: 'member' | 'finance'; // Adjust strings based on your API
  text: string;
}

interface DashboardStats {
  total_members: number;
  total_revenue: number;
  recent_activity: ActivityItem[];
}

export const DashboardHome = () => {
  // Use the interface here so TS knows what 'stats' contains
  const [stats, setStats] = useState<DashboardStats>({ 
    total_members: 0, 
    total_revenue: 0, 
    recent_activity: []
  });

  useEffect(() => {
    fetch('http://localhost/church-system/api/dashboard.php')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Dashboard Load Error:", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* 1. KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-full text-2xl">👥</div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium uppercase">Active Members</h3>
            <p className="text-3xl font-bold text-slate-800 mt-1">{stats.total_members}</p>
          </div>
        </div>
        
        {/* Finances Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 text-green-600 rounded-full text-2xl">💰</div>
          <div>
            <h3 className="text-slate-500 text-sm font-medium uppercase">Total Funds</h3>
            {/* Added a check to prevent crash if value is null/undefined initially */}
            <p className="text-3xl font-bold text-green-600 mt-1">GHS {Number(stats.total_revenue || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Date Card */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-xl shadow-sm text-white">
          <h3 className="text-slate-400 text-sm font-medium uppercase">Current Date</h3>
          <p className="text-2xl font-bold mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* 2. RECENT ACTIVITY FEED */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Recent System Activity</h3>
        <div className="space-y-4">
          {stats.recent_activity.length === 0 ? (
            <p className="text-slate-400 italic">No recent activity found.</p>
          ) : (
            // 3. 'item' is now correctly typed as ActivityItem
            stats.recent_activity.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-100 transition">
                <span className="text-2xl">
                  {item.type === 'member' ? '👤' : '💵'}
                </span>
                <div>
                  <p className="font-medium text-slate-800">
                    {item.type === 'member' ? `New Member Added: ${item.text}` : `Transaction: ${item.text}`}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{item.type}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};