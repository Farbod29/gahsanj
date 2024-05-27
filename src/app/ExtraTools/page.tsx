'use client';
import { useState } from 'react';
import Link from 'next/link';
import GeneralModal from '@/components/GeneralModal/GeneralModal';
import Image from 'next/image';

const ExtraTools = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleOpenModal = (content) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  return (
    <main className="flex flex-col items-center min-h-screen px-2 py-3 bg-[#333863] md:px-8">
      <div className="w-full max-w-md space-y-4">
        <Link href="/contact-us" legacyBehavior passHref>
          <a className="bg-[#7F84B4] rounded-lg p-5 text-white text-end block" >
            تماس با گاه‌شمار
          </a>
        </Link>
        <Link href="Link to : https://www.instagram.com/gahshomar.iran/?igsh=MW52MHcwcWpnY2QyNA%3D%3D" legacyBehavior passHref>
          <a className="bg-[#7F84B4] rounded-lg p-5 text-white text-end block" >
            ابنستاگرام
          </a>
        </Link>
        <div className="bg-[#7F84B4] rounded-lg p-5 text-white text-end"  onClick={() => handleOpenModal('ساعت های جهانی')}>
          ساعت های جهانی
        </div>
        <Link href="/gahshomaranDark" legacyBehavior passHref>
          <a className="bg-[#7F84B4] rounded-lg p-5 text-white text-end block" >
            سرآغازها
          </a>
        </Link>
        <div className="bg-[#7F84B4] rounded-lg p-5 text-white text-end"  onClick={() => handleOpenModal('تبدیل تاریخ')}>
          تبدیل تاریخ
        </div>
        <div className="bg-[#7F84B4] rounded-lg p-5 text-white text-end"  onClick={() => handleOpenModal('ماشین حساب')}>
          ماشین حساب
        </div>
        <div className="flex flex-col items-center justify-start flex-grow mt-16 min-w-40" onClick={() => handleOpenModal('گاه نامه')} >
       <Image 
          src={'/assets/gahname.png'}
          alt="گاه نامه"
          width={370} // Adjusted width for larger logo
          height={150} // Adjusted height for larger logo
          />
    </div>
      </div>

      {isModalOpen && (
        <GeneralModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <div className="text-white p-5">
            {modalContent}
          </div>
        </GeneralModal>
      )}
    </main>
  );
};

export default ExtraTools;
