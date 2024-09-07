'use client';
import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';

interface Occasion {
  RefLink: string;
  DayNumber: number; // Changed to number if DayNumber is a number from backend
  PersianDayNumber: number;
  Georgian: string;
  GeorgianK: string;
  Month: string; // Persian month from the backend
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  LogoLink: string;
  ModalImageLink: string;
  importantDay: boolean;
  PersianDayNumberK: number; // Persian (Jalaali) day number from backend
  PersianMonthNumberK: number; // Persian (Jalaali) month number from backend
}

// Helper function to convert Georgian month number to English month names
const georgianMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Function to format Georgian date from "22,09" to "21 Sep"
const formatGeorgianDate = (dateString: string) => {
  const [day, month] = dateString.split(',');

  // Define a list of month abbreviations
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Convert the month from string number to the corresponding name
  const monthName = months[parseInt(month, 10) - 1];

  // Return the correct format: "21 Sep"
  return `${day} ${monthName}`;
};

const Occasions6Days: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);

  const getPersianMonthName = () => {
    const today = new Date();
    const persianDate = jalaali.toJalaali(today); // Convert to Persian calendar
    const persianMonthNumber = persianDate.jm;
    const persianMonths = [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'امرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ];
    return persianMonths[persianMonthNumber - 1];
  };

  const toPersianNum = (num: number | string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[+digit] || digit)
      .join('');
  };

  const fetchOccasions = async () => {
    setLoading(true);
    try {
      const currentMonth = getPersianMonthName();
      const response = await fetch(`/api/farakhor6Days/${currentMonth}`);
      const data: Occasion[] = await response.json();
      setCurrentMonthEvents(data);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      setCurrentMonthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccasions();
  }, []);

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.ModalStatus) {
      setModalContent(occasion);
      setModalVisible(true);
    }
  };

  return (
    <div className='bg-[#333863] flex flex-col items-center justify-center pb-0 mb-16'>
      {loading ? (
        <div className='mt-10 text-center text-white'>Loading...</div>
      ) : (
        <div
          className='bg-[#333863] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 mt-3 mr-1 w-full p-3 lg:mt-1 mt:p-1'
          style={{ direction: 'rtl' }}
        >
          {currentMonthEvents.map((event) => {
            const logo =
              event.LogoLink ||
              'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg';

            return (
              <div
                key={event.DayNumber}
                onClick={() => handleDayClick(event)}
                className={`relative ${
                  event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                } bg-[#FFFFFF] shadow-md rounded-lg p-2 text-center sm:max-w-[150px] sm:h-[140px] md:max-w-[180px] md:h-[145px]`}
              >
                <div
                  className='absolute bottom-0 xl:top-[65px] sm:top-[75px] left-1 sm-logo:left-1 w-[70px] lg:h-[60px] sm:w-[100px] xs:w-10 xs:left-[-12px] xs:top-[80px] sm:h-[80px] h-[30px] flex 2 pl-1  mr-1'
                  style={{ width: 'auto', maxWidth: '80%' }}
                >
                  <Image
                    src={logo}
                    alt='Logo Of the Day'
                    width={70}
                    height={70}
                    layout='responsive'
                    className='w-full h-auto'
                  />
                </div>
                <div className='flex flex-col items-center justify-center bg-transparent'>
                  <span className='text-3xl sm:text-3xl font-bold text-[#333863] text-center'>
                    {toPersianNum(event.PersianDayNumberK)}{' '}
                  </span>
                  <span className='text-[#CAB9B9] text-sm sm:text-lg'>
                    {event.Month}
                  </span>
                  <div
                    className={`relative ${
                      event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                    } text-[#373636] text-center`}
                    style={{
                      fontSize:
                        event.ShortTitle.length > 16
                          ? '0.69rem'
                          : event.ShortTitle.length > 12
                            ? '0.79rem'
                            : event.ShortTitle.length > 8
                              ? '0.79rem'
                              : event.ShortTitle.length > 7
                                ? '0.79rem'
                                : '0.70rem',
                    }}
                  >
                    {event.ShortTitle}
                  </div>
                  <div className='relative' style={{ direction: 'ltr' }}>
                    <div className='text-[#2a5b71] p-2 text-center'>
                      {event.GeorgianK
                        ? formatGeorgianDate(event.GeorgianK)
                        : formatGeorgianDate(event.Georgian)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalVisible && modalContent && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
          <div className='bg-white p-2 sm:p-8 rounded-lg shadow-lg max-w-[90%] w-full max-h-[80vh] overflow-auto flex flex-col items-center'>
            <h1 className='text-xl sm:text-3xl font-bold text-[#393939] mb-4 text-center'>
              {modalContent.EventTitle}
            </h1>
            <div className='w-52 mb-4'>
              <Image
                src={
                  modalContent.ModalImageLink ||
                  'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg'
                }
                alt='Modal Image'
                className='h-full sm-logo:w-[30px] sm-logo:h-[20px] w-2'
                layout='responsive'
                width={30}
                height={30}
              />
            </div>
            <p className='text-sm sm:text-[#707070] mb-4 text-justify'>
              {modalContent.Text}
            </p>
            {modalVisible && modalContent.RefLink && (
              <p className='text-center mt-4 p-3 py-4 pb-4'>
                برای اطلاعات بیشتر به{' '}
                <a
                  href={modalContent.RefLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  لینک زیر
                </a>{' '}
                مراجع کنید.
              </p>
            )}
            <button
              className='px-3 sm:px-4 py-1 sm:py-2 bg-[#FF8200] text-white rounded'
              onClick={() => setModalVisible(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Occasions6Days;
