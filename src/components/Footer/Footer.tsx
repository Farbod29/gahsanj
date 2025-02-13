import FullscreenIcon from './FullscreenIcon';
import ExitFullscreenIcon from './ExitFullscreenIcon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Icon from '../FooterIcons/FooterIcons';
import ConverterIconGahshomar from './ConverterIconGahshomar';
import ConverterIconGahshomarOrange from './ConverterIconGahshomarOrange';
import { useState } from 'react';

const Footer = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false); // Add fullscreen state

  const buttons = [
    { path: '/ExtraTools', label: '', icon: 'ExtraTools' },

    { path: '/smallCalendarMobile', label: '', icon: 'calendar' },
    { path: '/FarakhorMobileDark', label: '', icon: 'FarakhorMobileDark' },
    { path: '/', label: '', icon: 'home' },
    { path: '/AiGenerator', label: '', icon: 'AiGenerator' },
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

  const navigateToDateConverter = () => {
    router.push('/DateConverter');
  };

  return (
    <footer className='fixed bottom-0 w-full p-3 flex justify-around items-center bg-[#373D70]'>
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
            className={`text-xs mb-1 ${
              pathname === button.path ? 'text-[#FD821D]' : 'text-white'
            }`}
          >
            {button.label}
          </span>
        </Link>
      ))}

      {/* Gahgardan Button */}
      <button
        onClick={navigateToDateConverter}
        className='flex flex-col items-center text-center w-1/5 mb-[12px] mt-2'
      >
        {pathname === '/DateConverter' ? (
          <div className='w-6 h-6 mb-1 text-white'>
            <ConverterIconGahshomarOrange />
          </div>
        ) : (
          <div className='w-6 h-6 mb-1 text-white'>
            <ConverterIconGahshomar />
          </div>
        )}
      </button>

      {/* Fullscreen toggle button */}
      <button
        onClick={toggleFullscreen}
        className='flex flex-col items-center text-center w-1/5 mb-[12px]'
      >
        {isFullscreen ? (
          <div className='w-6 h-6 mb-1 text-white'>
            <ExitFullscreenIcon />
          </div>
        ) : (
          <div className='w-6 h-6 mb-1 text-white'>
            <FullscreenIcon />
          </div>
        )}
      </button>
    </footer>
  );
};

export default Footer;