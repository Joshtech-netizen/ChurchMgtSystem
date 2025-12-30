export interface StreamEvent {
  id: number;
  topic: string;
  date: string;
  preacher?: string; 
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Member" | "Guest";
  status: "Active" | "Inactive";
}