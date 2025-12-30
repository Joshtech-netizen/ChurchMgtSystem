import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';

export const MembersView = () => {
  const { members, isLoading, error, addMember, deleteMember } = useMembers();
  
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    const success = await addMember(name, email, role);
    if (success) {
      setName(""); setEmail(""); // Clear form on success
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Church Directory</h2>

      {/* --- ADD MEMBER FORM --- */}
      <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-4 rounded-lg border border-slate-200 flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-1">FULL NAME</label>
          <input 
            className="w-full p-2 border rounded text-sm" 
            placeholder="e.g. John Doe"
            value={name} onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-1">EMAIL</label>
          <input 
            className="w-full p-2 border rounded text-sm" 
            placeholder="john@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="w-40">
          <label className="block text-xs font-bold text-slate-500 mb-1">ROLE</label>
          <select 
            className="w-full p-2 border rounded text-sm bg-white"
            value={role} onChange={e => setRole(e.target.value)}
          >
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
            <option value="Guest">Guest</option>
          </select>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded text-sm transition">
          + Add
        </button>
      </form>

      {/* --- ERROR & LOADING --- */}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <div className="text-slate-400 py-10 text-center">Loading Database...</div>}

      {/* --- DATA TABLE --- */}
      {!isLoading && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 text-slate-600 font-medium">Name</th>
                <th className="p-3 text-slate-600 font-medium">Email</th>
                <th className="p-3 text-slate-600 font-medium">Role</th>
                <th className="p-3 text-slate-600 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-800">{member.name}</td>
                  <td className="p-3 text-slate-500">{member.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button 
                      onClick={() => deleteMember(member.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};