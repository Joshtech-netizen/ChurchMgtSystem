import React, { useState } from 'react';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

export const AddMemberModal = ({ onClose, onSave }: AddMemberModalProps) => {

  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("Member");
  const [status, setStatus] = useState("Active");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("first_name", firstName);
    formData.append("surname", surname);
    formData.append("other_names", otherNames);
    formData.append("email", email);
    formData.append("mobile", mobile);
    formData.append("dob", dob);
    formData.append("address", address);
    formData.append("role", role);
    formData.append("status", status);
    if (photo) formData.append("photo", photo);

    await onSave(formData);
    
    setIsLoading(false);
    onClose(); // Close modal on success
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Add New Member</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Photo Upload (Full Width) */}
          <div className="col-span-full mb-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">Member Photo</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">First Name *</label>
            <input required className="w-full p-2 border rounded mt-1" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Surname *</label>
            <input required className="w-full p-2 border rounded mt-1" value={surname} onChange={e => setSurname(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Other Names</label>
            <input className="w-full p-2 border rounded mt-1" value={otherNames} onChange={e => setOtherNames(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
            <input type="date" className="w-full p-2 border rounded mt-1" value={dob} onChange={e => setDob(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
            <input type="tel" className="w-full p-2 border rounded mt-1" value={mobile} onChange={e => setMobile(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Email</label>
            <input type="email" className="w-full p-2 border rounded mt-1" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div className="col-span-full">
            <label className="block text-xs font-bold text-slate-500 uppercase">Residential Address</label>
            <textarea className="w-full p-2 border rounded mt-1" rows={2} value={address} onChange={e => setAddress(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Role</label>
            <select className="w-full p-2 border rounded mt-1" value={role} onChange={e => setRole(e.target.value)}>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase">Status</label>
            <select className="w-full p-2 border rounded mt-1" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Footer Actions */}
          <div className="col-span-full flex justify-end gap-3 mt-6 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancel</button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save Member'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};