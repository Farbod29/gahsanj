// libraries
import localFont from 'next/font/local';

export const Hamishe = localFont({
  variable: '--Hamishe',
  src: [
    {
      path: '/Hamishe/Hamishe.otf', // Assuming you move the Hamishe folder to the public directory
      weight: '100',
      style: 'normal',
    },
  ],
});
