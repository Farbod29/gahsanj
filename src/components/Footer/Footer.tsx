// This is a React functional component named Footer that renders a footer section with navigation buttons and a fullscreen toggle.
// It uses Next.js for routing and maintains the current path to highlight the active button.
// The footer contains

import FullscreenIcon from './FullscreenIcon';
import ExitFullscreenIcon from './ExitFullscreenIcon';
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
    {
      path: '/FarakhorMobileDark',
      label: '',
      icon: 'FarakhorMobileDark',
    },
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

  return (
    <footer className='fixed bottom-0 w-full p-4 flex justify-around items-center bg-[#373D70]'>
      {buttons.map((button) => (
        <Link
          href={button.path}
          key={button.path}
          className='flex flex-col items-center text-center w-1/5'
        >
          <Icon
            name={button.icon}
            className={`w-6 h-6 mb-1 ${
              pathname === button.path ? 'text-[#FD821D]' : 'text-white'
            }`}
          />
          <span
            className={`text-xs ${
              pathname === button.path ? 'text-[#FD821D]' : 'text-white'
            }`}
          >
            {button.label}
          </span>
        </Link>
      ))}
      <button
        onClick={toggleFullscreen}
        className='flex flex-col items-center text-center w-1/5 pb-0'
      >
        {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
      </button>
    </footer>
  );
};

export default Footer;
