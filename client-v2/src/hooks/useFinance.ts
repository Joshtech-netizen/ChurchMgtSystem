import { useState, useEffect, useCallback } from 'react';

export interface Contribution {
  id: number;
  amount: number;
  date: string;
  category: "Offering" | "Pledge" | "Welfare Dues";
  notes: string;
  first_name?: string; // Optional because anonymous offerings don't have names
  surname?: string;
}

export const useFinance = () => {
  const [transactions, setTransactions] = useState<Contribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'http://localhost/church-system/api/finance.php';

  // 1. Fetch Data Function
  const fetchTransactions = useCallback(async () => {
    try {
      // We add ?t=timestamp to prevent the browser from caching old data
      const response = await fetch(`${API_URL}?t=${Date.now()}`);
      if (!response.ok) throw new Error("Failed to fetch finance data");
      
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Load on startup
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 3. Add Transaction Function
  const addTransaction = async (data: any) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        // Reload list immediately after adding
        await fetchTransactions();
      }
    } catch (err) {
      console.error("Failed to add transaction", err);
      alert("Error saving transaction");
    }
  };

  return { transactions, isLoading, addTransaction };
};