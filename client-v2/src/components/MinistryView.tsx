import { Users, Calendar, ClipboardList } from 'lucide-react';

interface MinistryViewProps {
  title: string;
  color: string;
}

export const MinistryView = ({ title, color }: MinistryViewProps) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-8 rounded-xl shadow-sm text-white ${color}`}>
        <h1 className="text-3xl font-bold">{title} Dashboard</h1>
        <p className="opacity-90 mt-2">Manage members, events, and reports for {title}.</p>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-full text-slate-600"><Users /></div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase">Total Members</p>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-full text-slate-600"><Calendar /></div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase">Upcoming Events</p>
            <p className="text-2xl font-bold text-slate-800">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 bg-slate-100 rounded-full text-slate-600"><ClipboardList /></div>
          <div>
            <p className="text-slate-500 text-sm font-bold uppercase">Reports Due</p>
            <p className="text-2xl font-bold text-slate-800">None</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white p-10 rounded-xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-400 italic">
          Specific management tools for {title} will appear here.
        </p>
      </div>
    </div>
  );
};