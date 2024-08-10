'use client';

import React, { useEffect, useState } from 'react';

const Barjaste: React.FC = () => {
  const [shortTitles, setShortTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShortTitles = async () => {
      try {
        const response = await fetch('/api/barjaste');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setShortTitles(data);
        } else {
          console.error('Invalid data format:', data);
        }
      } catch (error) {
        console.error('Error fetching short titles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortTitles();
  }, []);

  return (
    <div className='flex flex-col items-center justify-center pt-24'>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className='list-disc text-white'>
          {shortTitles.length > 0 ? (
            shortTitles.map((title, index) => (
              <li key={index} className='text-lg'>
                {title}
              </li>
            ))
          ) : (
            <li className='text-lg'>No titles available</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Barjaste;
