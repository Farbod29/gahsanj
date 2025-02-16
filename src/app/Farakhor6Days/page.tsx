'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';

interface Occasion {
  RefLink: string;
  DayNumber: number;
  PersianDayNumber: number;
  Georgian: string;
  GeorgianK: string;
  Month: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  LogoLink: string;
  ModalImageLink: string;
  importantDay: boolean;
  PersianDayNumberK: number;
  PersianMonthNumberK: number;
  _id: string;
}

// Helper to format the Georgian Date
const formatGeorgianDate = (dateString: string) => {
  const [day, month] = dateString.split(',');
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
  return `${day} ${months[parseInt(month, 10) - 1]}`;
};

const Occasions6Days: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    jalaali.toJalaali(new Date()).jy
  );
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const todayPersianDayNumber = jToday.jd;
  const todayPersianMonth = jToday.jm;

  const monthMapping = useMemo(
    () => ({
      فروردین: 1,
      اردیبهشت: 2,
      خرداد: 3,
      تیر: 4,
      اَمُرداد: 5,
      شهریور: 6,
      مهر: 7,
      آبان: 8,
      آذر: 9,
      دی: 10,
      بهمن: 11,
      اسفند: 12,
    }),
    []
  );

  const leapYears = useMemo(
    () => [
      1403, 1407, 1411, 1415, 1419, 1423, 1427, 1431, 1435, 1439, 1443, 1447,
      1451, 1455, 1459, 1463, 1467, 1471, 1475, 1479, 1483, 1487, 1491, 1495,
      1499, 1503, 1507, 1511, 1515, 1519, 1523, 1527, 1531, 1535, 1539, 1543,
      1547, 1551, 1555, 1559, 1563, 1567, 1571, 1575, 1579, 1583, 1587, 1591,
      1595, 1599,
    ],
    []
  );

  const isLeapYear = (year: number) => leapYears.includes(year);

  const getPersianMonthName = useCallback(() => {
    const today = new Date();
    const persianDate = jalaali.toJalaali(today);
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
  }, []);

  const fetchOccasions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/occasions');
      if (!response.ok) {
        throw new Error('Failed to fetch occasions');
      }
      const data = await response.json();

      // The API returns { occasions: [...] }, so we need to extract the occasions array
      const occasions = data.occasions || [];

      // Filter occasions for the current month if needed
      const currentMonthName = getPersianMonthName();
      const filteredOccasions = occasions.filter(
        (occ) => occ.Month === currentMonthName
      );
      setCurrentMonthEvents(filteredOccasions);

      console.log('API Response:', data);
      console.log('Filtered Occasions:', filteredOccasions);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      setCurrentMonthEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOccasions();
  }, []);

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.ModalStatus) {
      setModalContent(occasion);
      setModalVisible(true);
    }
  };

  const toPersianNum = (num: number | string | undefined | null) => {
    if (num === undefined || num === null) return '';

    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[+digit] || digit)
      .join('');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#373D70] to-[#1C1E33]'>
      {loading ? (
        <div className='mt-8 text-center text-white'>Loading...</div>
      ) : (
        <div
          className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-2 w-full p-4'
          style={{ direction: 'rtl' }}
        >
          {currentMonthEvents.map((event) => {
            const isToday =
              monthMapping[event.Month] === todayPersianMonth &&
              (isLeapYear(currentYear)
                ? event.PersianDayNumberK === todayPersianDayNumber
                : event.PersianDayNumber === todayPersianDayNumber);

            const logo = event.LogoLink
              ? event.LogoLink
              : isToday
                ? '/assets/LogoMobMain.png'
                : 'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg';

            const dayNumber = isLeapYear(currentYear)
              ? event.PersianDayNumberK
              : event.PersianDayNumber;

            return (
              <div
                key={event._id}
                onClick={() => handleDayClick(event)}
                className={`relative h-[150px] rounded-2xl ${
                  isToday
                    ? 'bg-[#4c5494] border-4 border-[#FF8200] shadow-lg'
                    : 'bg-[#FFFFFF]'
                } shadow-md rounded-lg p-2 text-center`}
                style={{ width: '100%', maxWidth: '350px' }}
              >
                {/* Logo */}
                <div className='absolute top-[110px] left-2 rounded-xl overflow-hidden max-h-8 max-w-8'>
                  <Image
                    src={logo || '/assets/LogoMobMain.png'}
                    alt='Logo Of the Day'
                    width={50}
                    height={50}
                    layout='responsive'
                    className='object-cover'
                  />
                </div>

                {/* Persian Day */}
                <div className='flex flex-col items-center justify-center'>
                  <span
                    className={`text-3xl sm:text-3xl font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}
                  >
                    {toPersianNum(dayNumber)}
                  </span>
                  <span className='text-[#CAB9B9] text-sm sm:text-lg'>
                    {event.Month}
                  </span>
                </div>
                {/* Short Title */}
                <div
                  className={`relative text-center ${isToday ? 'text-white' : 'text-gray-700'}`}
                  style={{
                    fontSize:
                      event.ShortTitle.length > 16
                        ? '0.69rem'
                        : event.ShortTitle.length > 12
                          ? '0.79rem'
                          : '0.89rem',
                  }}
                >
                  {event.ShortTitle}
                </div>

                {/* Georgian Date */}
                <div
                  className={`${isToday ? 'text-gray-300 font-extrabold text-lg' : 'text-[#2a5b71]'} rounded-lg text-center`}
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '1px',
                    width: '100%',
                  }}
                >
                  {event.GeorgianK
                    ? formatGeorgianDate(event.GeorgianK)
                    : formatGeorgianDate(event.Georgian)}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modalVisible && modalContent && (
        <div
          className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-[9999]'
          onClick={() => setModalVisible(false)}
        >
          <div
            className='relative bg-white p-8 rounded-lg shadow-lg max-w-[90%] w-full max-h-[80vh] overflow-auto flex flex-col items-center z-[10000]'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className='absolute top-3 right-3 text-gray-600 hover:text-gray-800 font-bold text-xl'
              onClick={() => setModalVisible(false)}
            >
              &times;
            </button>

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
                className='h-full w-full'
                layout='responsive'
                width={100}
                height={100}
              />
            </div>
            <p className='text-sm text-[#707070] mb-4 text-justify'>
              {modalContent.Text}
            </p>
            {modalContent.RefLink && (
              <p className='text-center mt-4 p-3'>
                برای اطلاعات بیشتر{' '}
                <a
                  href={modalContent.RefLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  اینجا را کلیک کنید
                </a>{' '}
              </p>
            )}
            <button
              className='px-4 py-2 bg-[#FF8200] text-white rounded'
              onClick={() => setModalVisible(false)}
            >
              بستن
            </button>
          </div>
        </div>
      )}
      {/* <div className='p-3 pt-3 bg-white rounded-lg w-full max-w-[358px]'>
        <p className='items-center text-center font-weight-bold'> نمایه</p>
      </div> */}
    </div>
  );
};

export default Occasions6Days;