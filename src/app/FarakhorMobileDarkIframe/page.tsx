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

const Occasions = () => {
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

  const isLeapYear = (year: number) => {
    const isLeap = leapYears.includes(year);
    console.log(`Year ${year} is${isLeap ? '' : ' not'} a leap year.`);
    return isLeap;
  };

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
      console.log('Fetched Occasions:', data);

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
    console.log("Today's Jalali Date:", jToday);
    const newName = monthNames[jToday.jm - 1];
    setCurrentMonthName(newName);
    fetchOccasions(newName);
  }, [monthNames]);

  useEffect(() => {
    if (previousDay && !loading && currentMonthEvents.length > 0) {
      const [prevDay, prevMonth] = previousDay.split(',');

      const allEvents = currentMonthEvents.slice().sort((a, b) => {
        const today = new Date();
        const jToday = jalaali.toJalaali(today);
        const currentYear = jToday.jy;

        const dayA = isLeapYear(currentYear)
          ? a.PersianDayNumberK
          : a.PersianDayNumber;
        const dayB = isLeapYear(currentYear)
          ? b.PersianDayNumberK
          : b.PersianDayNumber;
        return dayA - dayB;
      });

      const scrollIndex = allEvents.findIndex((event) => {
        const today = new Date();
        const eventDate = new Date(event.Georgian);
        return (
          eventDate.getDate() === parseInt(prevDay, 10) &&
          eventDate.getMonth() + 1 === parseInt(prevMonth, 10)
        );
      });

      if (scrollIndex !== -1) {
        const previousEvent = allEvents[scrollIndex];
        console.log('Previous Event Date:', previousEvent.Georgian);

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

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const todayPersianDayNumber = jToday.jd;
  const currentYear = jToday.jy;
  const todayPersianDayNumberK = isLeapYear(currentYear)
    ? todayPersianDayNumber
    : todayPersianDayNumber;
  {
    currentMonthEvents.map((event, index) => {
      const isToday =
        event.PersianDayNumber === todayPersianDayNumber ||
        (isLeapYear(currentYear) &&
          event.PersianDayNumberK === todayPersianDayNumberK);
      const logo = event.LogoLink || '/https://picsum.photos/536/35';
      const georgianDayToShow = isLeapYear(currentYear)
        ? event.GeorgianK
        : event.Georgian;

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
                {georgianDayToShow}
              </div>
            </div>
          </div>
        </div>
      );
    });
  }
};
export default Occasions;
