import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';

interface AddContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export const AddContributionModal = ({ isOpen, onClose, onSave }: AddContributionModalProps) => {
  if (!isOpen) return null;

  const { members } = useMembers(); 
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [isAnonymous, setIsAnonymous] = useState(false); // <--- THE SWITCH
  const [memberId, setMemberId] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Offering");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); 
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      member_id: isAnonymous ? null : memberId, // Send NULL if anonymous
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || (category === "Offering" ? "Sunday Service" : "")
    };

    await onSave(payload);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-xl font-bold text-slate-800">Record Transaction</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* 1. SOURCE TOGGLE */}
          <div className="flex items-center space-x-2 mb-4 bg-slate-50 p-3 rounded border">
            <input 
              type="checkbox" 
              id="anon"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={isAnonymous} 
              onChange={e => setIsAnonymous(e.target.checked)}
            />
            <label htmlFor="anon" className="text-sm font-bold text-slate-700 cursor-pointer">
              General Congregation (No Member)
            </label>
          </div>

          {/* 2. MEMBER SELECT (Hidden if Anonymous) */}
          {!isAnonymous && (
            <div>
              <label htmlFor="member" className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Member</label>
              <select 
                id="member"
                className="w-full p-2 border rounded" 
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
                type="number" step="0.01" 
                id="amount"
                className="w-full p-2 border rounded font-bold text-slate-800" 
                value={amount} onChange={e => setAmount(e.target.value)} required 
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <select 
                id="category"
                className="w-full p-2 border rounded" 
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
              type="date" 
              id="date"
              className="w-full p-2 border rounded" 
              value={date} onChange={e => setDate(e.target.value)} required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Notes</label>
            <input 
              className="w-full p-2 border rounded" 
              placeholder={category === "Offering" ? "e.g. Sunday Service" : "Description"} 
              value={notes} onChange={e => setNotes(e.target.value)} 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 bg-green-600 text-white font-bold rounded hover:bg-green-700 mt-4 transition-colors"
          >
            {isLoading ? 'Processing...' : 'Record Payment'}
          </button>

        </form>
      </div>
    </div>
  );
};