import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MembersView } from './components/MembersView';
import { MediaView } from './components/MediaView';
import { DashboardHome } from './components/DashboardHome';

function App() {
  // 1. State lives here now!
  const [currentView, setCurrentView] = useState("Dashboard");

  // 2. Logic to choose which component to render
  const renderContent = () => {
    switch (currentView) {
      case "Dashboard":
        return <DashboardHome />;
      case "Members":
        return <MembersView />;
      case "Media Team":
        return <MediaView />;
      default:
        return <div className="p-10 text-center">🚧 Page under construction</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* 3. Pass the state and the changer function down */}
      <Sidebar activeTab={currentView} onTabChange={setCurrentView} />

      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{currentView}</h2>
            <p className="text-slate-500">Welcome back, Joseph.</p>
          </div>
          <button className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-slate-600">
            📅 Dec 30, 2025
          </button>
        </header>

        {/* 4. Render the dynamic content */}
        {renderContent()}

      </main>
    </div>
  );
}


export default App;