// pages/Occasions.js // pages/Occasions.js == for whole persian month
'use client';

// pages/Occasions.js

import React, { useState, useEffect, useMemo, useRef } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';
import { findPreviousDay } from '@/utils/findPreviousDay';

interface Occasion {
  DayNumber: number;
  PersianDayNumber: string;
  GeorgianDay: string;
  Month: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  Logo: string;
  ModalImageLink: string;
  ExtraLinks: string[];
}

const Occasions: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);
  const [previousDay, setPreviousDay] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const monthNames = useMemo(
    () => [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'اَمُرداد',
      'شهریور',
      'مهر',
      'آبان',
      'آذر',
      'دی',
      'بهمن',
      'اسفند',
    ],
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
      filteredData.sort((a, b) => {
        const dateA = new Date(a.GeorgianDay);
        const dateB = new Date(b.GeorgianDay);
        return dateA.getTime() - dateB.getTime();
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
    const newName = monthNames[jToday.jm - 1];
    setCurrentMonthName(newName);
    fetchOccasions(newName);
  }, [monthNames]);

  useEffect(() => {
    if (previousDay && !loading && currentMonthEvents.length > 0) {
      const today = new Date();

      const [prevDay, prevMonth] = previousDay.split(',');

      const allEvents = currentMonthEvents.slice().sort((a, b) => {
        const dateA = new Date(a.GeorgianDay);
        const dateB = new Date(b.GeorgianDay);
        return dateA.getTime() - dateB.getTime();
      });

      const scrollIndex = allEvents.findIndex((event) => {
        const eventDate = new Date(event.GeorgianDay);
        return (
          eventDate.getDate() === parseInt(prevDay, 10) &&
          eventDate.getMonth() + 1 === parseInt(prevMonth, 10)
        );
      });

      if (scrollIndex !== -1) {
        const previousEvent = allEvents[scrollIndex];
        console.log('Previous Event Date:', previousEvent.GeorgianDay);

        if (scrollRef.current) {
          const elementToScroll = scrollRef.current.children[
            scrollIndex
          ] as HTMLDivElement;
          const yOffset = -100; // Adjust this value to your needs
          const y =
            elementToScroll.getBoundingClientRect().top +
            window.scrollY +
            yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      } else {
        console.log('No previous event found');
      }
    }
  }, [loading, currentMonthEvents, previousDay]);

  const updateMonth = (monthIndex: number) => {
    const newName = monthNames[monthIndex];
    setCurrentMonthName(newName);
    fetchOccasions(newName);
  };

  const resetToToday = () => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    const newName = monthNames[jToday.jm - 1];
    setCurrentMonthName(newName);
    fetchOccasions(newName);
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

  // Get current date in Georgian format
  const todayGregorian = `${new Date().getDate()} ${
    [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ][new Date().getMonth()]
  }`;

  return (
    <div className='bg-[#333863] min-h-screen flex flex-col items-center justify-center pt-24 pb-24'>
      <div className='bg-[#4c5494] shadow-lg rounded-lg px-4 py-6 w-full text-center text-xl md:text-2xl font-bold text-white fixed top-0 flex justify-between items-center z-10'>
        <div className='flex items-center'>
          <button
            onClick={() =>
              updateMonth(
                (monthNames.indexOf(currentMonthName) + 1 + monthNames.length) %
                  monthNames.length
              )
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
            updateMonth(
              (monthNames.indexOf(currentMonthName) - 1 + monthNames.length) %
                monthNames.length
            )
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
            // Parsing Georgian date stored in DB
            const [day, month] = event.GeorgianDay.split(' ');
            const eventDate = new Date(`${month} ${day}`);
            const isToday =
              eventDate.getDate() === new Date().getDate() &&
              eventDate.getMonth() === new Date().getMonth();
            const logo = event.Logo || '/https://picsum.photos/536/35'; // Use a valid path

            return (
              <div
                key={`${event.DayNumber}-${event.GeorgianDay}-${index}`}
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
                    {toPersianNum(event.DayNumber.toString())}
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
                      {event.GeorgianDay}
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
