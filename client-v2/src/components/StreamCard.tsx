import { type StreamEvent } from '../types';

interface StreamCardProps {
  stream: StreamEvent;
  onDelete: (id: number) => void;
}

export const StreamCard = ({ stream, onDelete }: StreamCardProps) => {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex justify-between items-center mb-3 hover:shadow-md transition-shadow">
      <div>
        <h3 className="font-bold text-slate-800">{stream.topic}</h3>
        <p className="text-sm text-slate-500">📅 {stream.date}</p>
        
        <div className="mt-1">
          {stream.preacher ? (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              🎤 {stream.preacher}
            </span>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-medium italic">
              🎵 Worship Only
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={() => onDelete(stream.id)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
        title="Delete Schedule"
      >
        🗑️
      </button>
    </div>
  );
};