'use client';
import React, { useState, useEffect, useMemo } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';

interface Occasion {
  RefLink: string;
  DayNumber: number;
  PersianDayNumber: string;
  GeorgianDay: string;
  GeorgianK: string;
  Month: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  Logo: string;
  ModalImageLink: string;
  importantDay: boolean;
  PersianDayNumberK: number;
}

const Occasions6Days: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(
    jalaali.toJalaali(new Date()).jy
  );

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

  const fetchOccasions = async (monthName: string) => {
    setLoading(true);
    try {
      let response = await fetch(`/api/farakhor7Days/${monthName}`);
      let data: Occasion[] = await response.json();
      let filteredData = Array.isArray(data)
        ? data.filter((event) => event.ShortTitle && event.importantDay)
        : [];

      // Check if fewer than 6 important events, fetch from next month
      if (filteredData.length < 6) {
        const nextMonthIndex = (monthNames.indexOf(monthName) + 1) % 12;
        const nextMonthName = monthNames[nextMonthIndex];
        response = await fetch(`/api/farakhor7Days/${nextMonthName}`);
        const nextMonthData: Occasion[] = await response.json();
        const nextMonthFilteredData = Array.isArray(nextMonthData)
          ? nextMonthData.filter(
              (event) => event.ShortTitle && event.importantDay
            )
          : [];
        filteredData = [...filteredData, ...nextMonthFilteredData].slice(0, 6);
      }

      const currentYear = jalaali.toJalaali(new Date()).jy;
      filteredData.sort((a, b) => {
        const dayA = isLeapYear(currentYear)
          ? Number(a.PersianDayNumberK)
          : Number(a.PersianDayNumber);
        const dayB = isLeapYear(currentYear)
          ? Number(b.PersianDayNumberK)
          : Number(b.PersianDayNumber);
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

  useEffect(() => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    const newName = monthNames[jToday.jm - 1];
    setCurrentMonthName(newName);
    fetchOccasions(newName);
  }, [monthNames]);

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

  const todayDate = new Date();
  const todayDay = todayDate.getDate();
  const todayMonth = todayDate.getMonth() + 1;
  const jToday = jalaali.toJalaali(todayDate);
  const todayPersianDayNumber = jToday.jd;
  const todayPersianMonth = jToday.jm;

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
            const [day, month] = event.GeorgianDay.split(' ');
            const eventDay = parseInt(day, 10);
            const eventMonth =
              new Date(Date.parse(month + ' 1, 2000')).getMonth() + 1;
            //𐎥𐎠𐎧 𐏁𐎶𐎠𐎽
            const isToday =
              event.PersianDayNumber.toString() ===
                todayPersianDayNumber.toString() &&
              monthNames.indexOf(event.Month) + 1 === todayPersianMonth;

            const todayStyle = isToday
              ? 'bg-[#4c5494] border-4 border-[#FF8200] shadow-lg text-[#FFFFFF]'
              : 'bg-[#FFFFFF] shadow-md';

            const logo =
              event.Logo ||
              'https://gahshomar.com/wp-content/uploads/2024/08/gahshomar-dark.svg';

            return (
              <div
                key={event.DayNumber}
                onClick={() => handleDayClick(event)}
                className={`relative ${
                  event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                } ${todayStyle} shadow-md rounded-lg p-2 text-center sm:max-w-[150px] sm:h-[140px] md:max-w-[180px] md:h-[145px]`}
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
                  <span
                    className={`text-3xl sm:text-3xl font-bold ${
                      isToday ? 'text-[#FFFFFF] ' : 'text-[#333863]'
                    } text-center`}
                  >
                    {toPersianNum(event.PersianDayNumber.toString())}
                  </span>
                  <span className='text-[#CAB9B9] text-sm sm:text-lg'>
                    {toPersianNum(currentMonthName)}
                  </span>
                  <div
                    className={`relative ${
                      event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                    } ${isToday ? 'text-[#FFFFFF] ' : 'text-[#373636]'} text-center`}
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
                  <div
                    className='relative'
                    style={{ height: '32px', position: 'relative' }}
                  >
                    <div
                      className={`text-[#2a5b71] ${
                        isToday ? 'text-white ' : 'text-[#2a5b71]'
                      } p-2 text-center`}
                    >
                      {event.GeorgianDay}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Advertisement Box */}
          <div
            className='col-span-2 md:col-span-3 lg:col-span-3 shadow-md rounded-lg p-4 text-left sm:max-w-[450px] sm:h-[720px] md:max-w-[540px] md:h-[735px] flex items-center justify-start'
            style={{
              backgroundImage:
                "url('https://gahshomar.com/wp-content/uploads/2024/09/99e2d1a0-7d79-4e20-a91b-dc63a8ac10fb-1.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className='bg-orange-300 rounded-lg  '>
              <p className='text-[#333863] text-center text-lg  p-3 w-full max-w-[7%]'>
                تبلیغات شما
              </p>
            </div>
          </div>
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
            <p
              className='text-sm sm:text-[#707070] mb-4 text-justify'
              dir='rtl'
            >
              {modalContent.Text}
            </p>
            {modalVisible && modalContent.RefLink && (
              <p className='text-center mt-4 p-3 py-4 pb-4'>
                برای اطلاعات بیشتر به
                <a
                  href={modalContent.RefLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-blue-500 underline'
                >
                  لینک زیر
                </a>
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