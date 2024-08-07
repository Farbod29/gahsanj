// src/components/Footer/Footer.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../FooterIcons/FooterIcons';
import { useState } from 'react';

const Footer = () => {
  const pathname = usePathname();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const buttons = [
    { path: '/', label: '', icon: 'home' },
    { path: '/smallCalendarMobile', label: '', icon: 'calendar' },
    { path: '/FarakhorMobileDark', label: '', icon: 'FarakhorMobileDark' },
    { path: '/AiGenerator', label: '', icon: 'AiGenerator' },
    { path: '/ExtraTools', label: '', icon: 'ExtraTools' },
  ];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(
          `Error attempting to disable full-screen mode: ${err.message}`
        );
      });
      setIsFullscreen(false);
    }
  };

  // useEffect(() => {
  //   const requestFullscreen = () => {
  //     if (!document.fullscreenElement) {
  //       document.documentElement.requestFullscreen().catch((err) => {
  //         console.error(
  //           `Error attempting to enable full-screen mode: ${err.message}`
  //         );
  //       });
  //     }
  //   };

  //   // Add an event listener to request full-screen mode on user interaction
  //   document.addEventListener('click', requestFullscreen);

  //   return () => {
  //     document.removeEventListener('click', requestFullscreen);
  //   };
  // }, []);

  return (
    <footer className='fixed bottom-0 w-full p-4 flex justify-around bg-[#373D70]'>
      {buttons.map((button) => (
        <Link
          href={button.path}
          key={button.path} // Use button.path as the key to ensure uniqueness
          className='flex flex-col items-center'
        >
          <Icon
            name={button.icon}
            className={`w-6 h-6 ${
              pathname === button.path ? 'text-[#FD821D]' : 'text-white'
            }`}
          />
          <span
            className={`${
              pathname === button.path ? 'text-[#FD821D]' : 'text-white'
            } no-underline`}
          >
            {button.label}
          </span>
        </Link>
      ))}
      <button
        onClick={toggleFullscreen}
        className='flex flex-col items-center text-white'
      >
        <Icon
          name={isFullscreen ? 'exit_fullscreen' : 'fullscreen'}
          className='w-6 h-6'
        />
        <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
      </button>
    </footer>
  );
};

export default Footer;