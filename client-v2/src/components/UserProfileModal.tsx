import { useState } from 'react';
import { User as UserIcon, Lock, Save, X } from 'lucide-react';
import { type User } from '../types'; 

interface UserProfileModalProps {
  user: User; 
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal = ({ user, isOpen, onClose }: UserProfileModalProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // If closed, render nothing
  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (newPassword !== confirmPassword) {
      setMessage({ text: "New passwords do not match", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/church-system/api/profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id, 
          current_password: currentPassword,
          new_password: newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: "Password updated successfully!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(onClose, 2000);
      } else {
        setMessage({ text: data.message || "Failed to update", type: "error" });
      }
    } catch (err) {
      console.error(err); // 3. Fixed: Log the error so 'err' is used
      setMessage({ text: "Network error", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            {/* Used the renamed icon here */}
            <div className="p-2 bg-blue-600 rounded-lg"><UserIcon size={20} /></div>
            <div>
              <h2 className="font-bold text-lg">My Profile</h2>
              {/* TS now knows username/role exist */}
              <p className="text-xs text-slate-400">{user.username} • {user.role}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white transition" aria-label="Close sidebar" title="Close sidebar"><X /></button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            
            {message.text && (
              <div className={`p-3 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Current Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="password"
                  className="w-full pl-10 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="border-t border-slate-100 my-4 pt-4">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">New Password</label>
              <input 
                type="password"
                className="w-full p-2.5 border border-slate-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <input 
                type="password"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? 'Updating...' : <><Save size={18} /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};