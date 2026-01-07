import { useState } from 'react'; // Removed useEffect
import { useMembers } from '../hooks/useMembers';

// 1. DEFINE DATA TYPE
export interface ContributionFormData {
  member_id: string | number | null;
  amount: number;
  category: string;
  date: string;
  notes: string;
}

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ContributionFormData) => Promise<void>; 
}

export const AddContributionModal = ({ isOpen, onClose, onSave }: AddContributionModalProps) => {
  const { members } = useMembers(); 
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Offering");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  const [notes, setNotes] = useState("");

  
  // This replaces the problematic useEffect
  const handleClose = () => {
    // Reset fields
    setAmount("");
    setNotes("");
    setIsAnonymous(false);
    setMemberId("");
    // Trigger the parent's onClose
    onClose();
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload: ContributionFormData = {
      member_id: isAnonymous ? null : memberId,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || (category === "Offering" ? "Sunday Service" : "")
    };

    await onSave(payload);
    setIsLoading(false);
    handleClose(); // 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-800">Record Transaction</h2>
          {/* ✅ Use handleClose here instead of onClose */}
          <button type="button" onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* SOURCE TOGGLE */}
          <div className="flex items-center space-x-2 mb-4 bg-slate-50 p-3 rounded border border-slate-200">
            <input 
              type="checkbox" 
              id="anon"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={isAnonymous} 
              onChange={e => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anon" className="text-sm font-bold text-slate-700 cursor-pointer select-none">
              General Congregation (No Member)
            </label>
          </div>

          {/* MEMBER SELECT */}
          {!isAnonymous && (
            <div>
              <label htmlFor="member" className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Member</label>
              <select 
                id="member"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={memberId} 
                onChange={e => setMemberId(e.target.value)}
                required={!isAnonymous}
              >
                <option value="">-- Choose Member --</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>{m.first_name} {m.surname}</option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="amount" className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (GHS)</label>
              <input 
                id="amount"
                type="number" step="0.01" 
                className="w-full p-2 border border-slate-300 rounded font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none" 
                value={amount} onChange={e => setAmount(e.target.value)} required 
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <select 
                id="category"
                className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
                value={category} onChange={e => setCategory(e.target.value)}
              >
                <option value="Offering">Offering</option>
                <option value="Pledge">Pledge</option>
                <option value="Welfare Dues">Welfare Dues</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="date" className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
            <input 
              id="date"
              type="date" 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              value={date} onChange={e => setDate(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
            <input 
              className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder={category === "Offering" ? "e.g. Sunday Service" : "Description"} 
              value={notes} onChange={e => setNotes(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 mt-4 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Record Payment'}
          </button>

        </form>
      </div>
    </div>
  );
};