import { useState, useEffect, useCallback } from 'react';
import { type Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = 'http://localhost/church-system/api/members.php';

  // 1. Define fetchMembers with useCallback so we can reuse it
  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      setError("Could not load members.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Load initial data
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 3. Add Member (Updated to Refresh List)
  const addMember = async (formData: FormData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        // SUCCESS! Now reload the list from the database
        await fetchMembers(); 
        return { success: true };
      }
    } catch (err) {
      alert("Failed to add member");
    }
    return { success: false };
  };

  // 4. Delete Member (Updated to Refresh List)
  const deleteMember = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Filter locally for instant speed, or use fetchMembers() for safety
        setMembers(prev => prev.filter(m => m.id !== id));
      }
    } catch (err) {
      alert("Failed to delete member");
    }
  };

  return { members, isLoading, error, addMember, deleteMember };
};