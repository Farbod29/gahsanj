'use client';

import { useSearchParams } from 'next/navigation';

const SomeClientComponent = () => {
  const searchParams = useSearchParams();
  console.log(searchParams.get('search')); // Logs "search"
  const sosis = searchParams.get('search');
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-2 sm:px-4 md:px-8">
      <p>{sosis}</p>
    </main>
  );
};

export default SomeClientComponent;
