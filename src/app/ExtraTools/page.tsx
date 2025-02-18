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
  let iconSize = 'w-20 h-20';
  let textSize = 'text-sm';

  if (height >= 667) {
    boxHeight = 'h-20';
    iconSize = 'w-24 h-24';
    textSize = 'text-base';
  }
  if (height >= 844) {
    boxHeight = 'h-24';
    iconSize = 'w-28 h-28';
    textSize = 'text-lg';
  }
  if (height >= 896) {
    boxHeight = 'h-28';
    iconSize = 'w-32 h-32';
    textSize = 'text-xl';
  }

  const content = (
    <div
      className={`bg-[#7F84B4] rounded-xl p-2 text-white flex items-center justify-between ${boxHeight} gap-x-4`}
      onClick={onClick}
    >
      <div className={`flex items-center ${iconSize} pl-4`}>
        <Image src={iconSrc} alt={altText} width={40} height={40} />
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
    <main className='flex flex-col items-center min-h-screen h-screen overflow-hidden px-2 py-3 bg-[#333863]'>
      <div className='w-full max-w-md space-y-3 py-3 p-2 flex flex-col flex-grow'>
        <Box
          text='تماس با گاه سنج'
          iconSrc='/assets/contact.png'
          altText='گاه نامه'
          onClick={() =>
            (window.location.href = 'https://gahshomar.com/contact/')
          }
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
          link='/PhoneAppGahshomarNoAIJustModal'
        />
        <Box
          text='تبدیل تاریخ'
          iconSrc='/assets/Replay.png'
          altText='تبدیل تاریخ'
          onClick={
            () =>
              handleOpenModal(
                <iframe
                  src='https://gahshomar.com/gahgardan/'
                  width='100%'
                  height='500px'
                  style={{ border: 'none' }}
                ></iframe>
              ) // https://gahshomar.com/contact/
          }
        />

        <div
          className={`flex flex-col items-center justify-start flex-grow mt-8 w-full`}
          onClick={() => handleOpenModal('گاه نامه')}
        >
          <Image
            src={'/assets/gahname.png'}
            alt='گاه نامه'
            width={400}
            height={400}
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
