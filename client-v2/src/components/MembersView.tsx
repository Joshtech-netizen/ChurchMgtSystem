export const MembersView = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold mb-4">Church Directory</h2>
      <p className="text-slate-500">List of members will go here...</p>
      
      {/* Simple Table Placeholder */}
      <div className="mt-4 border rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-3">Joseph Abassah</td>
              <td className="p-3">Admin</td>
              <td className="p-3 text-green-600">Active</td>
            </tr>
            <tr className="border-t">
              <td className="p-3">Sarah Smith</td>
              <td className="p-3">Member</td>
              <td className="p-3 text-green-600">Active</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};