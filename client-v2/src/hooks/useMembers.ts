import { useState, useEffect } from 'react';
import { type Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = 'http://localhost/church-system/api/members.php';

  // 1. FETCH (Load on startup)
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError("Could not load members.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. ADD FUNCTION
  const addMember = async (name: string, email: string, role: string) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role })
      });
      
      if (response.ok) {
        const result = await response.json();
        // Optimistic Update: Add to list immediately without waiting for reload
        const newMember: Member = {
          id: result.id,
          name,
          email,
          role: role as any,
          status: 'Active'
        };
        setMembers(prev => [newMember, ...prev]);
        return true;
      }
    } catch (err) {
      alert("Failed to add member");
    }
    return false;
  };

  // 3. DELETE FUNCTION
  const deleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      // We pass the ID in the URL: members.php?id=123
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove from screen immediately
        setMembers(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete member");
    }
  };

  return { members, isLoading, error, addMember, deleteMember };
};