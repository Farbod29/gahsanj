// src/components/Footer.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '../FooterIcons/FooterIcons';

const Footer = () => {
  const pathname = usePathname();

  const buttons = [
    { path: '/', label: '', icon: 'home' },
    { path: '/smallCalendarMobile', label: '', icon: 'calendar' },
    { path: '/FarakhorMobileDark', label: '', icon: 'FarakhorMobileDark' },
    // { path: '/gahshomaranDark', label: '', icon: 'gahshomaranDark' },
    { path: '/AiGenerator', label: '', icon: 'AiGenerator' },
    { path: '/ExtraTools', label: '', icon: 'ExtraTools' },
  ];

  return (
    <footer className="fixed bottom-0 w-full p-4 flex justify-around bg-[#373D70]">
      {buttons.map((button) => (
        <Link
          href={button.path}
          key={button.label}
          className="flex flex-col items-center"
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
    </footer>
  );
};

export default Footer;
