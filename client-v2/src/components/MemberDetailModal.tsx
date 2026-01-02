import { X, Phone, MapPin, Calendar, Mail, User } from 'lucide-react';
import { type Member } from '../types';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
}

export const MemberDetailModal = ({ member, onClose }: MemberDetailModalProps) => {
  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative m-4">
        
        {/* Header Background */}
        <div className={`h-32 ${member.gender === 'Male' ? 'bg-pink-600' : 'bg-blue-600'}`}>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          
          {/* Avatar & Name */}
          <div className="relative -mt-16 mb-6 flex items-end justify-between">
            <div className="flex items-end gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 shadow-lg overflow-hidden flex items-center justify-center text-4xl font-bold text-slate-400">
                {member.photo_url ? (
                  <img src={member.photo_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  member.first_name.charAt(0)
                )}
              </div>
              <div className="mb-2">
                <h2 className="text-3xl font-bold text-slate-800">{member.first_name} {member.surname}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                  {member.ministry || 'General'}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase border-b pb-2">Contact Info</h3>
              
              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={20} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Mobile</p>
                  <p className="font-medium">{member.mobile || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Mail size={20} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                  <p className="font-medium">{member.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><MapPin size={20} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                  <p className="font-medium">{member.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold text-slate-400 uppercase border-b pb-2">Personal Details</h3>

              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><User size={20} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Gender</p>
                  <p className="font-medium">{member.gender || 'Not Specified'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-700">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Calendar size={20} /></div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Date of Birth</p>
                  <p className="font-medium">{member.dob || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};