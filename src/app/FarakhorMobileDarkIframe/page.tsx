'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';
import { findPreviousDay } from '@/utils/findPreviousDay';
import { useCalendar } from '@/contexts/CalendarContext';

interface Occasion {
  ShortTitle: string;
  EventTitle: string;
  Georgian: string;
  GeorgianK: string;
  ModalImageLink: string;
  ModalStatus: boolean;
  PersianDayNumber: number;
  PersianDayNumberK: number;
  RefLink: string;
  Text: string;
  importantDay: boolean;
  Month: string;
  LogoLink: string;
}

const FarakhorMobileDarkIframe: React.FC = () => {
  const {
    currentMonth: currentPersianMonth,
    currentYear,
    handleMonthChange,
  } = useCalendar();
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);
  const [previousDay, setPreviousDay] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const getGregorianYear = (jalaliYear: number) => jalaliYear + 621;
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

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

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

  const georgianMonthMapping = useMemo(
    () => [
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
    ],
    []
  );

  const formatGeorgianDate = (date: string) => {
    const [day, month] = date.split(',').map(Number);
    return `${day} ${georgianMonthMapping[month - 1]}`;
  };

  const fetchOccasions = async (monthName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/farakhor/${monthName}`);
      const data: Occasion[] = await response.json();

      const filteredData = Array.isArray(data)
        ? data.filter((event) => event.ShortTitle)
        : [];

      filteredData.sort((a, b) => {
        const dayA = isLeapYear(currentYear)
          ? a.PersianDayNumberK
          : a.PersianDayNumber;
        const dayB = isLeapYear(currentYear)
          ? b.PersianDayNumberK
          : b.PersianDayNumber;
        return dayA - dayB;
      });

      setCurrentMonthEvents(filteredData);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      setCurrentMonthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNextMonth = () => handleMonthChange(1);
  const handlePrevMonth = () => handleMonthChange(-1);

  const resetToToday = () => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    const newName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === jToday.jm
    );
    setCurrentMonthName(newName || '');
    fetchOccasions(newName || '');
  };

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.ModalStatus) {
      setModalContent(occasion);
      setModalVisible(true);
    }
  };

  const toPersianNum = (num: string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[parseInt(digit, 10)] || digit)
      .join('');
  };

  useEffect(() => {
    resetToToday();
    console.log('Persian month on load:', todayPersianMonth); // Log the Persian month when component loads
  }, []);

  useEffect(() => {
    resetToToday();
  }, []);

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const todayPersianDayNumber = jToday.jd;
  const todayPersianMonth = jToday.jm;
  const currentDisplayYear = currentYear;
  const todayPersianDayNumberK = isLeapYear(currentDisplayYear)
    ? todayPersianDayNumber
    : todayPersianDayNumber;
  const leapYearText = isLeapYear(currentDisplayYear)
    ? '( کبیسه / انباشته ) '
    : '';
  const getGregorianYearRange = (jalaliYear: number, currentYear: number) => {
    console.log(jalaliYear);
    const currentGeorgianYear = currentDisplayYear + 621;

    // Log to verify the month
    console.log(`Current Persian month is: ${currentPersianMonth}`);

    // When in دی (month 10), display both the current and next year
    if (currentPersianMonth === 10) {
      return `${currentGeorgianYear} / ${currentGeorgianYear + 1}`;
    }
    // For بهمن and اسفند (months 11 and 12), show only the next year
    else if (currentPersianMonth >= 11) {
      return `${currentGeorgianYear + 1}`;
    }
    // For months before دی (months 1 to 9), show only the current year
    else {
      return `${currentGeorgianYear}`;
    }
  };

  useEffect(() => {
    console.log('Current Persian month is:', currentPersianMonth);
    if (currentPersianMonth === 10) {
      // Your existing logic
    }
  }, [currentPersianMonth]);

  // Update month name and fetch occasions when month changes
  useEffect(() => {
    const newMonthName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === currentPersianMonth
    );

    if (newMonthName) {
      setCurrentMonthName(newMonthName);
      fetchOccasions(newMonthName);
    }
  }, [currentPersianMonth, currentYear]);

  return (
    <div className='min-h-screen flex flex-col pb-1'>
      {/* Calendar info section - Moved from fixed position */}
      <div className='bg-[#4c5494] shadow-lg rounded-lg px-6 py-4 w-full mb-4'>
        <div className='flex items-center justify-between'>
          <button onClick={handlePrevMonth} className='text-2xl text-white'>
            &lt;
          </button>

          <div className='flex items-center justify-between flex-grow mx-4'>
            <button
              onClick={resetToToday}
              className='border border-white px-3 py-1 text-[10px] rounded text-white hover:bg-white hover:text-[#333863] transition-colors duration-300'
            >
              برو به این ماه
            </button>

            {/* Calendar Systems Grid */}
            <div className='grid grid-cols-3 gap-4 text-xs'>
              {/* First Column */}
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>ایران نو</span>
                  <span className='text-white mx-1'>
                    {toPersianNum((currentYear - 1396).toString())}
                  </span>
                </div>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>هجرت</span>
                  <span className='text-white mx-1'>
                    {toPersianNum(currentYear.toString())}
                  </span>
                </div>
              </div>

              {/* Second Column */}
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>پادشاهی</span>
                  <span className='text-white mx-1'>
                    {toPersianNum((currentYear + 1180).toString())}
                  </span>
                </div>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>ایلامی</span>
                  <span className='text-white mx-1'>
                    {toPersianNum((currentYear + 3821).toString())}
                  </span>
                </div>
              </div>

              {/* Third Column */}
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>مادی/کردی</span>
                  <span className='text-white mx-1'>
                    {toPersianNum((currentYear + 1321).toString())}
                  </span>
                </div>
                <div className='flex items-center whitespace-nowrap'>
                  <span className='text-gray-300'>زرتشتی</span>
                  <span className='text-white mx-1'>
                    {toPersianNum((currentYear + 2359).toString())}
                  </span>
                </div>
              </div>
            </div>

            {/* Gregorian Year and Month Name */}
            <div className='flex flex-col items-end'>
              <span className='text-gray-300 text-xs'>
                میلادی
                <span className='text-white mx-1'>
                  {toPersianNum(
                    getGregorianYearRange(todayPersianMonth, currentYear)
                  )}
                </span>
              </span>
              <span className='text-gray-300 text-xs mt-1'>{leapYearText}</span>
              <span className='text-white text-sm mt-2'>
                فراخورهای ماه {currentMonthName}
              </span>
            </div>
          </div>

          <button onClick={handleNextMonth} className='text-2xl text-white'>
            &gt;
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className='text-center text-white mt-4'>
          ... در حال بارگزاری فراخور های پیش رو
        </div>
      ) : (
        <div
          ref={scrollRef}
          className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-4'
          style={{ direction: 'rtl' }}
        >
          {currentMonthEvents.map((event, index) => {
            const isToday =
              monthMapping[event.Month] === todayPersianMonth &&
              (isLeapYear(currentYear)
                ? event.PersianDayNumberK === todayPersianDayNumberK
                : event.PersianDayNumber === todayPersianDayNumber);
            const logo =
              event.LogoLink ||
              'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg';

            return (
              <div
                key={`${event.PersianDayNumber}-${event.Georgian}-${index}`}
                onClick={() => handleDayClick(event)}
                className={`relative ${
                  event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isToday
                    ? 'bg-[#4c5494] border-4 border-[#FF8200] shadow-lg'
                    : 'bg-[#FFFFFF]'
                } shadow-md rounded-lg p-2 text-center`}
                style={{ width: '100%', maxWidth: '350px', height: '142px' }}
              >
                {/* ${isToday ? 'bg-gray-900  ' : 'bg-[#FFFFFF] '} */}
                <div
                  style={{
                    position: 'absolute',
                    left: '2px', // exact left position
                    top:
                      window.innerWidth >= 1200
                        ? '88px'
                        : window.innerWidth >= 768
                          ? '75px'
                          : '80px', // controlling top based on screen width
                    width:
                      window.innerWidth >= 1200
                        ? '40px'
                        : window.innerWidth >= 768
                          ? '50px'
                          : '30px', // controlling width
                    height:
                      window.innerWidth >= 1200
                        ? '70px'
                        : window.innerWidth >= 768
                          ? '50px'
                          : '40px', // controlling height
                    padding: '2px', // setting padding
                    margin: '2px', // setting margin
                    marginBottom: '1px', // bottom margin
                    maxWidth: '80%', // max width limit
                  }}
                  className='rounded-xl overflow-hidden'
                >
                  {isValidUrl(logo) && (
                    <Image
                      src={logo}
                      alt='Logo Of the Day'
                      width={50}
                      height={50}
                      layout='responsive'
                      className='w-full h-auto'
                    />
                  )}
                </div>

                <style jsx>{`
                  @media (min-width: 1784px) {
                    .customsizefologosite {
                      left: -10px;
                      width: 25px;
                    }
                  }
                `}</style>
                <div className='flex flex-col h-full'>
                  <span
                    className={`text-3xl sm:text-2xl font-bold ${isToday ? 'text-[#FFFFFF] ' : 'text-gray-700'}`}
                  >
                    {toPersianNum(
                      isLeapYear(currentDisplayYear)
                        ? event.PersianDayNumberK.toString()
                        : event.PersianDayNumber.toString()
                    )}
                  </span>
                  <span className='text-[#CAB9B9] text-sm sm:text-lg pb-[-5px] '>
                    {toPersianNum(currentMonthName)}
                  </span>
                  <div
                    className={`relative ${
                      event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                    } ${isToday ? 'text-[#FFFFFF] pb-10' : 'text-[#373636] pb-10'}
            text-center`}
                    style={{
                      fontSize:
                        event.ShortTitle.length > 16
                          ? '0.72rem'
                          : event.ShortTitle.length > 12
                            ? '0.89rem'
                            : event.ShortTitle.length > 8
                              ? '1.0rem'
                              : event.ShortTitle.length > 7
                                ? '1.0rem'
                                : '0.89rem',
                    }}
                  >
                    {event.ShortTitle}
                  </div>
                  <div className='relative' style={{ direction: 'ltr' }}>
                    <div
                      className={` ${
                        isToday
                          ? 'text-gray-300 font-extrabold text-lg'
                          : 'text-[#2a5b71]'
                      } rounded-lg text-center `}
                      style={{
                        position: 'absolute', // Ensure it stays at the bottom
                        bottom: '0px',
                        width: '100%',
                        // paddingBottom: '0px', // Add padding to ensure there's space
                      }}
                    >
                      {formatGeorgianDate(
                        isLeapYear(currentDisplayYear)
                          ? event.GeorgianK
                          : event.Georgian
                      )}
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
          <div className='bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-[90%] w-full max-h-[80vh] overflow-auto flex flex-col items-center'>
            <h1 className='text-xl sm:text-3xl font-bold text-[#393939] text-center'>
              {modalContent.EventTitle}
            </h1>
            <div className='w-52  4'>
              <Image
                src={
                  modalContent.ModalImageLink ||
                  'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg'
                }
                alt='Modal Image'
                className='h-full sm-logo:w-[30px] sm-logo:h-[20px] w-2 p-2'
                layout='responsive'
                width={30}
                height={30}
              />
            </div>
            <p
              className='text-sm sm:text-[#707070] p-4 4 text-justify'
              dir='rtl'
            >
              {modalContent.Text}
            </p>
            {modalVisible && modalContent && modalContent.RefLink && (
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
              className='px-3 sm:px-4 py-1 sm:py-2 bg-[#FF8200] text-white rounded xs:py-3 xs:pt-3'
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

export default FarakhorMobileDarkIframe;