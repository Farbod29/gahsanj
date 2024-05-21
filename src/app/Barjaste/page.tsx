// app/barjaste/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Event = {
  name: string;
  date: string;
  type: string;
};

const Barjaste: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>('/api/barjaste');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (events.length === 0) {
    return <div></div>; // Show nothing if no events exist
  }

  return (
    <div>
      <h1>برجسته های امروز</h1>
      <ul>
        {events.map((event, index) => (
          <li key={index}>{event.name}</li> // Adjust according to your event schema
        ))}
      </ul>
    </div>
  );
};

export default Barjaste;
