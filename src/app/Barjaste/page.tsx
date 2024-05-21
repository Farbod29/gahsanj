'use client';

import React, { useEffect, useState } from 'react';

const Barjaste: React.FC = () => {
  const [shortTitles, setShortTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchShortTitles = async () => {
      try {
        const response = await fetch('/api/barjaste');
        const data = await response.json();
        setShortTitles(data);
      } catch (error) {
        console.error('Error fetching short titles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShortTitles();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center pt-24">
      <h1 className="text-2xl font-bold mb-4 text-white">برجسته های امروز</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul className="list-disc text-white">
          {shortTitles.length > 0 ? (
            shortTitles.map((title, index) => (
              <li key={index} className="text-lg">
                {title}
              </li>
            ))
          ) : (
            <li className="text-lg text-white">
              {' '}
              برای امروز فراخوری موجود نیست{' '}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default Barjaste;
