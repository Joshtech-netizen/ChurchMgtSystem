import { useState } from 'react';
import { useStreamSchedule } from '../hooks/useStreamSchedule';
import { StreamCard } from './StreamCard';

export const MediaView = () => {
  const { schedule, isLoading, addStream, removeStream } = useStreamSchedule();
  
  // Local form state
  const [topic, setTopic] = useState("");
  const [preacher, setPreacher] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !date) return;
    addStream(topic, date, preacher);
    setTopic(""); setPreacher(""); setDate("");
  };

  return (
    <div className="max-w-4xl">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">📹 Media Team Scheduler</h2>
        <p className="text-slate-500 mb-6">Plan upcoming livestreams and assign technical roles.</p>

        {/* The Add Form */}
        <form onSubmit={handleSubmit} className="flex gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="flex-1">
            <label htmlFor="topic" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Event Topic</label>
            <input 
              id="topic"
              className="w-full p-2 border rounded text-sm"
              placeholder="e.g. Sunday Service" 
              value={topic} onChange={e => setTopic(e.target.value)} 
            />
          </div>
          <div className="flex-1">
            <label htmlFor="preacher" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Preacher (Opt)</label>
            <input 
              id="preacher"
              className="w-full p-2 border rounded text-sm"
              placeholder="Rev. Joseph" 
              value={preacher} onChange={e => setPreacher(e.target.value)} 
            />
          </div>
          <div className="">
            <label htmlFor="date" className="block text-xs font-bold text-slate-500 mb-1 uppercase">Date</label>
            <input id="date"
              type="date"
              className="p-2 border rounded text-sm"
              value={date} onChange={e => setDate(e.target.value)} 
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded text-sm transition-colors">
            Add Event
          </button>
        </form>
      </div>

      {/* The List Section */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">
          <p className="animate-pulse">Loading schedule data...</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {schedule.length === 0 && <p className="text-center text-slate-400 py-10">No events scheduled.</p>}
          {schedule.map(stream => (
            <StreamCard key={stream.id} stream={stream} onDelete={removeStream} />
          ))}
        </div>
      )}
    </div>
  );
};