// src/app/page.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import GeneralModal from '@/components/GeneralModal/GeneralModal';
import Image from 'next/image';
import ClocksPageMobile from '../ClocksPageMobile/page';
import useWindowDimensions from '@/hooks/useWindowDimensions';

interface BoxProps {
  text: string;
  iconSrc: string;
  altText: string;
  onClick?: () => void;
  link?: string;
}

const Box: React.FC<BoxProps> = ({ text, iconSrc, altText, onClick, link }) => {
  const { height } = useWindowDimensions();

  let boxHeight = 'h-16';
  let iconSize = 'w-8 h-8';
  let textSize = 'text-sm';

  if (height >= 667) {
    boxHeight = 'h-20';
    iconSize = 'w-9 h-9';
    textSize = 'text-base';
  }
  if (height >= 844) {
    boxHeight = 'h-24';
    iconSize = 'w-12 h-12';
    textSize = 'text-lg';
  }
  if (height >= 896) {
    boxHeight = 'h-28';
    iconSize = 'w-12 h-12';
    textSize = 'text-xl';
  }

  const content = (
    <div
      className={`bg-[#7F84B4] rounded-xl p-2 text-white flex items-center justify-between ${boxHeight} gap-x-4`}
      onClick={onClick}
    >
      <div className={`flex items-center ${iconSize} pl-4`}>
        <Image src={iconSrc} alt={altText} width={30} height={30} />
      </div>
      <span className={textSize}>{text}</span>
    </div>
  );

  return link ? (
    <Link href={link} legacyBehavior passHref>
      {content}
    </Link>
  ) : (
    content
  );
};

const ExtraTools = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | string>('');

  const handleOpenModal = (content: JSX.Element | string) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent('');
  };

  return (
    <main className='flex flex-col items-center min-h-screen px-2 py-3 bg-[#333863] overflow-hidden'>
      <div className='w-full max-w-md space-y-3 py-3 p-2'>
        <Box
          text='تماس با گاه‌شمار'
          iconSrc='/assets/contact.png'
          altText='گاه نامه'
          onClick={() => handleOpenModal('تماس ')}
        />
        <Box
          text='اینستاگرام'
          iconSrc='/assets/insta.png'
          altText='گاه نامه'
          link='https://www.instagram.com/gahshomar.iran/?igsh=MW52MHcwcWpnY2QyNA%3D%3D'
        />
        <Box
          text='ساعت های جهانی'
          iconSrc='/assets/CLOCK.png'
          altText='گاه نامه'
          onClick={() => handleOpenModal(<ClocksPageMobile />)}
        />
        <Box
          text='سرآغازها'
          iconSrc='/assets/calendaerIcon.png'
          altText='سرآغازها'
          link='/gahshomaranDark'
        />
        <Box
          text='تبدیل تاریخ'
          iconSrc='/assets/Replay.png'
          altText='تبدیل تاریخ'
          onClick={() => handleOpenModal('تبدیل تاریخ')}
        />

        <div
          className='flex flex-col items-center justify-start flex-grow mt-8'
          onClick={() => handleOpenModal('گاه نامه')}
        >
          <Image
            src={'/assets/gahname.png'}
            alt='گاه نامه'
            width={300}
            height={100}
            className='md:w-[320px] md:h-[120px] lg:w-[370px] lg:h-[150px] xl:w-[400px] xl:h-[170px]'
          />
        </div>
      </div>

      {isModalOpen && (
        <GeneralModal isOpen={isModalOpen} onClose={handleCloseModal}>
          {modalContent}
        </GeneralModal>
      )}
    </main>
  );
};

export default ExtraTools;