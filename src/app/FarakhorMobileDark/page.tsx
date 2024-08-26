'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';
import { findPreviousDay } from '@/utils/findPreviousDay';

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

const Occasions: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);
  const [previousDay, setPreviousDay] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const leapYears = useMemo(
    () => [1403, 1407, 1411, 1415, 1419, 1423, 1427, 1431, 1435, 1439],
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

  const fetchOccasions = async (monthName: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/farakhor/${monthName}`);
      const data: Occasion[] = await response.json();
      console.log('Occasion', data);

      const filteredData = Array.isArray(data)
        ? data.filter((event) => event.ShortTitle)
        : [];

      const today = new Date();
      const jToday = jalaali.toJalaali(today);
      const currentYear = jToday.jy;

      // Sort events based on PersianDayNumber or PersianDayNumberK depending on the leap year status
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
      setPreviousDay(findPreviousDay(filteredData));
    } catch (error) {
      console.error('Error fetching occasions:', error);
      setCurrentMonthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    const newName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === jToday.jm
    );
    setCurrentMonthName(newName || '');
    fetchOccasions(newName || '');

    // Print today's Persian date for debugging
    console.log(`Today's Persian date: ${jToday.jd}, ${newName}`);
  }, [monthMapping]);

  const updateMonth = (monthIndex: number) => {
    const newName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === monthIndex
    );
    setCurrentMonthName(newName || '');
    fetchOccasions(newName || '');
  };

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

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const todayPersianDayNumber = jToday.jd;
  const todayPersianMonth = jToday.jm;
  const currentYear = jToday.jy;
  const todayPersianDayNumberK = isLeapYear(currentYear)
    ? todayPersianDayNumber
    : todayPersianDayNumber;

  return (
    <div className='bg-[#333863] min-h-screen flex flex-col items-center justify-center pt-24 pb-24'>
      <div className='bg-[#4c5494] shadow-lg rounded-lg px-4 py-6 w-full text-center text-xl md:text-2xl font-bold text-white fixed top-0 flex justify-between items-center z-10'>
        <div className='flex items-center'>
          <button
            onClick={() =>
              updateMonth((monthMapping[currentMonthName] + 1) % 12 || 12)
            }
            className='text-4xl md:text-5xl'
          >
            &lt;
          </button>
          <button
            onClick={resetToToday}
            className='ml-12 p-2 text-2xl sm:text-xl rounded transition-colors duration-300 text-white hover:bg-white hover:text-[#333863] active:bg-gray-700 active:text-white'
          >
            برو به امروز
          </button>
        </div>

        <h1>فراخورهای ماه {currentMonthName}</h1>
        <button
          onClick={() =>
            updateMonth((monthMapping[currentMonthName] - 1 + 12) % 12 || 12)
          }
          className='text-4xl md:text-5xl'
        >
          &gt;
        </button>
      </div>

      {loading ? (
        <div className='mt-10 text-center text-white'>
          ... در حال بارگزاری فراخور های پیش رو
        </div>
      ) : (
        <div
          ref={scrollRef}
          className='grid grid-cols-2 se:grid-cols-3 iphone14:grid-cols-3 lg:grid-cols-6 ipad:grid-cols-3 ipadair:grid-cols-3 gap-4 ipad:gap-3 ipadair:gap-3 mt-3 mr-1 w-full p-3 lg:mt-8 mt:p-10'
          style={{ direction: 'rtl' }}
        >
          {currentMonthEvents.map((event, index) => {
            const isToday =
              monthMapping[event.Month] === todayPersianMonth &&
              (isLeapYear(currentYear)
                ? event.PersianDayNumberK === todayPersianDayNumberK
                : event.PersianDayNumber === todayPersianDayNumber);
            const logo = event.LogoLink || '/https://picsum.photos/536/35';

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
                style={{ width: '100%', maxWidth: '350px', height: 'auto' }}
              >
                <div className='absolute bottom-0 xl:top-[65px] sm:top-[75px] left-1 sm-logo:left-2 w-[30px] lg:h-[50px] sm:w-[40px] xs:w-8 xs:left-0 sm:h-[70px] h-[10px] flex items-center justify-center pb-2 pl-2 m-2 customsizefologosite xs:mt-2 xl:mb-12 2xl:mb-10 pr-1 mr-7'>
                  {isValidUrl(logo) && (
                    <Image
                      src={logo}
                      alt='Logo Of the Day'
                      width={50}
                      height={50}
                      className='w-[30px] h-full sm-logo:w-[20px] sm-logo:h-[20px] sm-logo:h-[20px]'
                      layout='responsive'
                    />
                  )}
                </div>
                <div className='flex flex-col items-center justify-center'>
                  <span
                    className={`text-3xl sm:text-3xl font-bold ${isToday ? 'text-[#FFFFFF] ' : 'text-[#333863]'} text-center`}
                  >
                    {toPersianNum(event.PersianDayNumber.toString())}
                  </span>
                  <span className='text-[#CAB9B9] text-sm sm:text-lg '>
                    {toPersianNum(currentMonthName)}
                  </span>
                  <div
                    className={`relative ${
                      event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                    } ${isToday ? 'text-[#FFFFFF] ' : 'text-[#8e8585]'}
               text-center`}
                    style={{
                      fontSize:
                        event.ShortTitle.length > 16
                          ? '0.79rem'
                          : event.ShortTitle.length > 12
                            ? '0.99rem'
                            : event.ShortTitle.length > 8
                              ? '1.0rem'
                              : event.ShortTitle.length > 7
                                ? '1.175rem'
                                : '1.3rem',
                    }}
                  >
                    {event.ShortTitle}
                  </div>

                  <div
                    className='relative'
                    style={{ height: '32px', position: 'relative' }}
                  >
                    <div
                      className={`text-[#2a5b71] B14-SE1 absluteEnmonth ${
                        isToday ? 'text-[#ded4bd] ' : 'text-[#2a5b71]'
                      }shadow-md rounded-lg p-2 text-center`}
                    >
                      {isLeapYear(currentYear)
                        ? event.GeorgianK
                        : event.Georgian}
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
            <h1 className='text-xl sm:text-3xl font-bold text-[#393939] mb-4 text-center'>
              {modalContent.EventTitle}
            </h1>
            <div className='w-52 mb-4'>
              <Image
                src={
                  modalContent.ModalImageLink || 'https://picsum.photos/536/354'
                }
                alt='Modal Image'
                className='h-full sm-logo:w-[30px] sm-logo:h-[20px] w-2'
                layout='responsive'
                width={30}
                height={30}
              />
            </div>
            <p
              className='text-sm sm:text-[#707070] mb-4 text-justify text-end'
              dir='rtl'
            >
              {modalContent.Text}
            </p>
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

export default Occasions;
