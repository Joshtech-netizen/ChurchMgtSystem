import { useState, useEffect } from 'react';
import { Member } from '../types';

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // CALL YOUR PHP API
        // Note: We use the full URL to your XAMPP server
        const response = await fetch('http://localhost/church-system/api/members.php');
        
        if (!response.ok) {
          throw new Error('Failed to fetch from PHP API');
        }

        const data = await response.json();
        setMembers(data);
      } catch (err) {
        console.error("API Error:", err);
        setError("Could not load members. Is XAMPP running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return { members, isLoading, error };
};