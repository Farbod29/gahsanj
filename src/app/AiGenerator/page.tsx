// src/app/page.tsx
'use client';

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';

const AiGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();
  const handleClockClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <main className='flex flex-col items-center justify-between p-4 bg-[#333863] min-h-screen '>
      <div className='flex flex-col items-center justify-start flex-grow mt-40'>
        <Image
          src={'/assets/LogoMobile.png'}
          alt='AI Generator'
          width={150} // Adjusted width for larger logo
          height={150} // Adjusted height for larger logo
        />
        <h1 className='text-white text-lg mb-6 mt-12 text-center' dir='rtl'>
          در اینجا میتوانید برگه روزشمار
          <br />
          با گاهشمار و پس زمینه انتخابی خود را بسازید
        </h1>
      </div>
      <Link href='/PhoneAppGahshomar' legacyBehavior passHref>
        <button
          className='bg-[#FF8200] text-white py-5 px-32 rounded-lg mb-20'
          dir='rtl'
        >
          شروع کن
        </button>
      </Link>
    </main>
  );
};

export default AiGenerator;
