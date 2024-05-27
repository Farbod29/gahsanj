'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
//import logo from 'Users/farbodaprin/Desktop/iranian-gah-shomar2/public/assets/logo-gahshomar-yellow.png';
import Image from 'next/image';

const ExtraTools = () => {

  

  return (
    <main className="flex min-h-screen flex-col items-center px-2 sm:px-4 md:px-8 py-12 bg-[#333863]">
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> تماس با گاه‌شمار </div>
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> ابنستاگرام </div>
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> ساعت های جهانی </div>
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> سرآغازها </div>
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> تبدیل تاریخ </div>
        <div className='bg-[#7F84B4] rounded-lg p-6 m-2 w-[400px] dir="rtl text-white text-end'> ماشین حساب </div>
    </main>
  );
}
export default ExtraTools;