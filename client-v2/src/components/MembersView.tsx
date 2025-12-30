import { useMembers } from '../hooks/useMembers';

export const MembersView = () => {
  // Use the hook!
  const { members, isLoading, error } = useMembers();

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Church Directory</h2>
        <span className="text-sm text-slate-500">Total: {members.length}</span>
      </div>

      {/* ERROR STATE */}
      {error && (
        <div className="p-4 mb-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          ⚠️ {error}
        </div>
      )}

      {/* LOADING STATE */}
      {isLoading ? (
        <div className="text-center py-10 text-slate-500 animate-pulse">
          Loading Directory from Database...
        </div>
      ) : (
        /* DATA TABLE */
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-3 text-slate-600 font-medium">Name</th>
                <th className="p-3 text-slate-600 font-medium">Email</th>
                <th className="p-3 text-slate-600 font-medium">Role</th>
                <th className="p-3 text-slate-600 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium text-slate-800">{member.name}</td>
                  <td className="p-3 text-slate-500">{member.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      member.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 
                      member.role === 'Member' ? 'bg-blue-100 text-blue-700' : 
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {member.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`flex items-center gap-1 text-sm ${
                      member.status === 'Active' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        member.status === 'Active' ? 'bg-green-600' : 'bg-red-500'
                      }`}></span>
                      {member.status}
                    </span>
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