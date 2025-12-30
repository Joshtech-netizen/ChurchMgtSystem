import { useState } from 'react';
import { useMembers } from '../hooks/useMembers';
import { AddMemberModal } from './AddMemberModal';

export const MembersView = () => {
  const { members, isLoading, error, addMember, deleteMember } = useMembers();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveMember = async (formData: FormData) => {
    await addMember(formData);
    // Note: To see the new member instantly, you might need to refresh 
    // or update 'addMember' to reload data. For now, a page refresh works best.
    window.location.reload(); 
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Church Directory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold shadow-sm transition"
        >
          + Add New Member
        </button>
      </div>

      {/* The Modal Component */}
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMember} 
      />

      {/* Existing Table Code... (Update columns to show First Name / Surname) */}
      {!isLoading && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3">Photo</th>
                <th className="p-3">Name</th>
                <th className="p-3">Mobile</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="p-3">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                        {member.first_name[0]}
                      </div>
                    )}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {member.first_name} {member.surname}
                  </td>
                  <td className="p-3 text-slate-500">{member.mobile}</td>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">{member.role}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => deleteMember(member.id)} className="text-red-400 hover:text-red-600">Delete</button>
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