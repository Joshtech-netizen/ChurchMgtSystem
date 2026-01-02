export type UserRole = 
  | 'Super Admin' 
  | 'Admin' 
  | 'Youth Leader' 
  | 'Children Leader' 
  | 'Women Leader' 
  | 'Evangelism Leader' 
  | 'Visitation Leader';

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export interface StreamEvent {
  id: number;
  topic: string;
  date: string;
  preacher?: string; 
}

export interface Member {
  id: number;
  first_name: string;
  surname: string;
  other_names?: string;
  gender?: "Male" | "Female ";
  ministry?: string;
  email: string;
  mobile: string;
  address?: string;
  dob?: string;
  photo_url?: string;
  role: "Admin" | "Member" | "Guest";
  status: "Active" | "Inactive";
}
