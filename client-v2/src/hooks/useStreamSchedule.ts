import { useState, useEffect } from 'react';
import { type StreamEvent } from '../types'; // Import from our new folder

export const useStreamSchedule = () => {
  const [schedule, setSchedule] = useState<StreamEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulating the API call again
  useEffect(() => {
    const fetchSchedule = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const dbData: StreamEvent[] = [
        { id: 1, topic: "Sunday Service", date: "2026-01-10", preacher: "Rev. Joseph" },
        { id: 2, topic: "Mid-Week Worship", date: "2026-01-14" }
      ];
      setSchedule(dbData);
      setIsLoading(false);
    };
    fetchSchedule();
  }, []);

  const addStream = (topic: string, date: string, preacher: string) => {
    const newStream: StreamEvent = {
      id: Date.now(),
      topic,
      date,
      preacher: preacher === "" ? undefined : preacher 
    };
    setSchedule(prev => [...prev, newStream]);
  };

  const removeStream = (id: number) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  return { schedule, isLoading, addStream, removeStream };
};