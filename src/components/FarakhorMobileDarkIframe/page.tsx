'use client';

import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';
import { findPreviousDay } from '@/utils/findPreviousDay';
import { useCalendar } from '@/contexts/CalendarContext';
import ErrorBoundary from '../ErrorBoundary';

interface Occasion {
  _id?: string;
  ShortTitle: string;
  EventTitle: string;
  Georgian: string;
  GeorgianK: string;
  ModalImageLink: string | null;
  ModalStatus: boolean;
  PersianDayNumber: number;
  PersianDayNumberK: number;
  RefLink: string;
  Text: string;
  importantDay: boolean;
  Month: string;
  LogoLink: string | null;
}

const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dcr52vdzb/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1739324586/occasions/ixob3ogvm0cxsmwikhti.jpg';

const getRepeatedDates = (
  events: Occasion[],
  isLeapYear: (year: number) => boolean,
  currentDisplayYear: number
) => {
  const dateCount: { [key: number]: number } = {};
  events.forEach((event) => {
    const dayNumber = isLeapYear(currentDisplayYear)
      ? event.PersianDayNumberK
      : event.PersianDayNumber;
    dateCount[dayNumber] = (dateCount[dayNumber] || 0) + 1;
  });
  return dateCount;
};

const FarakhorMobileDarkIframe: React.FC = () => {
  const {
    currentMonth: currentPersianMonth,
    currentYear,
    handleMonthChange,
    setCurrentYear,
    setCurrentDisplayYear,
    setCurrentPersianMonth,
    setTodayPersianMonth,
    setTodayPersianDayNumber,
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

  const isValidUrl = (url: string | undefined | null): url is string => {
    console.log('isValidUrl checking:', { url, type: typeof url });
    if (!url || typeof url !== 'string' || url.trim() === '') {
      console.log('isValidUrl rejected:', { reason: 'empty or invalid type' });
      return false;
    }
    try {
      new URL(url);
      const isValid = url.trim().length > 0;
      console.log('isValidUrl URL parsing result:', { url, isValid });
      return isValid;
    } catch (error) {
      console.log('isValidUrl URL parsing error:', { url, error });
      return false;
    }
  };

  const getValidImageUrl = (url: string | null | undefined): string | null => {
    console.log('getValidImageUrl input:', { url, type: typeof url });
    if (!url || typeof url !== 'string' || url.trim() === '') {
      console.log('getValidImageUrl rejected:', {
        reason: 'empty or invalid type',
      });
      return null;
    }
    try {
      new URL(url);
      const validUrl = url.trim().length > 0 ? url.trim() : null;
      console.log('getValidImageUrl result:', { input: url, output: validUrl });
      return validUrl;
    } catch (error) {
      console.log('getValidImageUrl error:', { url, error });
      return null;
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

  const fetchOccasions = useCallback(
    async (monthName: string) => {
      setLoading(true);
      try {
        const response = await fetch(`/api/farakhor/${monthName}`);
        const data: Occasion[] = await response.json();

        const filteredData =
          Array.isArray(data) && data.length > 0
            ? data.map((event) => ({
                ...event,
                LogoLink: isValidUrl(event.LogoLink?.trim())
                  ? event.LogoLink.trim()
                  : DEFAULT_IMAGE,
                ModalImageLink: isValidUrl(event.ModalImageLink?.trim())
                  ? event.ModalImageLink.trim()
                  : DEFAULT_IMAGE,
              }))
            : [
                {
                  ShortTitle: 'مناسبتی وجود ندارد',
                  EventTitle: 'مناسبتی وجود ندارد',
                  Georgian: '',
                  GeorgianK: '',
                  ModalImageLink: DEFAULT_IMAGE,
                  ModalStatus: false,
                  PersianDayNumber: 0,
                  PersianDayNumberK: 0,
                  RefLink: '',
                  Text: 'هیچ مناسبت فعالی وجود ندارد.',
                  importantDay: false,
                  Month: monthName,
                  LogoLink: DEFAULT_IMAGE,
                },
              ];

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
    },
    [currentYear, isLeapYear]
  );

  const handleNextMonth = () => handleMonthChange(-1); // dear AI model do not change this line
  const handlePrevMonth = () => handleMonthChange(1); // dear AI model do not change this line

  useEffect(() => {
    const initializeCalendar = async () => {
      const today = new Date();
      const { jm: todayMonth, jy: todayYear } = jalaali.toJalaali(
        today.getFullYear(),
        today.getMonth() + 1,
        today.getDate()
      );

      const monthName = Object.keys(monthMapping).find(
        (key) => monthMapping[key] === todayMonth
      );

      if (monthName) {
        // Batch all state updates together
        await Promise.resolve().then(() => {
          setCurrentYear(todayYear);
          setCurrentDisplayYear(todayYear);
          setCurrentPersianMonth(todayMonth);
          setTodayPersianMonth(todayMonth);
          setCurrentMonthName(monthName);
        });

        // Fetch occasions after state updates are complete
        await fetchOccasions(monthName);
      }
    };

    initializeCalendar();
  }, []); // Run only once on mount

  useEffect(() => {
    if (!currentPersianMonth) return;

    const newMonthName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === currentPersianMonth
    );

    if (newMonthName && newMonthName !== currentMonthName) {
      setCurrentMonthName(newMonthName);
      fetchOccasions(newMonthName);
    }
  }, [currentPersianMonth, monthMapping, currentMonthName, fetchOccasions]); // Add all required dependencies

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.ModalStatus) {
      setModalContent(occasion);
      setModalVisible(true);
    }
  };

  const toPersianNum = (num: string | number | undefined | null) => {
    if (num === undefined || num === null) return '';

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
  const currentDisplayYear = currentYear;
  const todayPersianDayNumberK = isLeapYear(currentDisplayYear)
    ? todayPersianDayNumber
    : todayPersianDayNumber;
  const leapYearText = isLeapYear(currentDisplayYear)
    ? '       امسال کبیسه (انباشته) است  '
    : '';
  const getGregorianYearRange = (
    jalaliYear: number | undefined,
    currentYear: number
  ) => {
    if (jalaliYear === undefined) return '';

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

  // Memoize the month title with useMemo
  const monthTitle = useMemo(
    () => (
      <h1 className='text-white text-2xl mb-1 mt-3' dir='rtl'>
        فراخورهای ماه {currentMonthName} :
      </h1>
    ),
    [currentMonthName]
  );

  // Update resetToToday to be more efficient
  const resetToToday = useCallback(() => {
    const today = new Date();
    const {
      jy: todayYear,
      jm: todayMonth,
      jd: todayDay,
    } = jalaali.toJalaali(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    );

    // Batch state updates
    Promise.resolve().then(() => {
      setCurrentYear(todayYear);
      setCurrentDisplayYear(todayYear);
      setCurrentPersianMonth(todayMonth);
      setTodayPersianMonth(todayMonth);
      setTodayPersianDayNumber(todayDay);
    });

    const monthName = Object.keys(monthMapping).find(
      (key) => monthMapping[key] === todayMonth
    );
    if (monthName) {
      setCurrentMonthName(monthName);
      fetchOccasions(monthName);
    }
  }, [
    monthMapping,
    fetchOccasions,
    setCurrentYear,
    setCurrentDisplayYear,
    setCurrentPersianMonth,
    setTodayPersianMonth,
    setTodayPersianDayNumber,
  ]);

  // Memoize repeatedDates directly in the render
  const repeatedDates = useMemo(() => {
    return getRepeatedDates(currentMonthEvents, isLeapYear, currentDisplayYear);
  }, [currentMonthEvents, currentDisplayYear, isLeapYear]);

  return (
    <ErrorBoundary>
      <div className='min-h-screen flex flex-col pb-1 mt-4'>
        {/* Calendar info section - Moved from fixed position */}
        <div className='bg-[#4c5494] shadow-lg rounded-lg px-6 py-8 w-full mb-4'>
          <div className='flex items-center justify-between'>
            <button onClick={handlePrevMonth} className='text-4xl text-white'>
              &lt;
            </button>

            <div className='flex items-center justify-between flex-grow mx-4'>
              <button
                onClick={resetToToday}
                className='border border-white px-3 py-1 text-[20px] rounded text-white hover:bg-white hover:text-[#333863] transition-colors duration-300'
              >
                برو به امروز
              </button>

              {/* Calendar Systems Grid */}
              <div className='grid grid-cols-3 gap-4 text-sm'>
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
                    <span className='text-gray-300'>شاهنشاهی</span>
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
              <div className='flex flex-col items-end mr-5'>
                <span className='text-gray-300 text-sm'>
                  میلادی
                  <span className='text-white mx-1'>
                    {toPersianNum(
                      getGregorianYearRange(todayPersianMonth, currentYear)
                    )}
                  </span>
                </span>
              </div>
              <div>
                <span className='text-gray-300 text-sm mt-1'>
                  {leapYearText}
                </span>
              </div>
            </div>
            <div className='ml-5 mr-9'>
              <span className='text-white text-base mt-2'>
                {/* فراخورهای ماه {currentMonthName} */}
              </span>
            </div>

            <button onClick={handleNextMonth} className='text-4xl text-white'>
              &gt;
            </button>
          </div>
        </div>
        {monthTitle}
        {loading ? (
          <div className='text-center text-white mt-1'>
            ... در حال بارگزاری فراخور های پیش رو
          </div>
        ) : (
          <div
            ref={scrollRef}
            className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-4'
            style={{ direction: 'rtl' }}
          >
            {currentMonthEvents.map((event, index) => {
              const isToday =
                monthMapping[event.Month] === todayPersianMonth &&
                (isLeapYear(currentYear)
                  ? event.PersianDayNumberK === todayPersianDayNumberK
                  : event.PersianDayNumber === todayPersianDayNumber);

              return (
                <div
                  key={event._id || index}
                  onClick={() => handleDayClick(event)}
                  className={`relative ${
                    event.ModalStatus ? 'cursor-pointer' : 'cursor-default'
                  } ${
                    isToday
                      ? 'bg-[#4c5494] border-2 border-[#FF8200] shadow-lg'
                      : repeatedDates[
                            isLeapYear(currentDisplayYear)
                              ? event.PersianDayNumberK
                              : event.PersianDayNumber
                          ] > 1
                        ? 'bg-[#ffeedd]' // Warm background for repeated dates
                        : 'bg-white'
                  } shadow-md rounded-lg p-2 text-center hover:shadow-lg transition-shadow duration-200`}
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                    height: '142px',
                  }}
                >
                  <div className='flex flex-col h-full justify-between'>
                    <div>
                      <span
                        className={`text-3xl sm:text-2xl font-bold ${isToday ? 'text-[#FFFFFF] ' : 'text-gray-700'}`}
                      >
                        {toPersianNum(
                          isLeapYear(currentDisplayYear)
                            ? event.PersianDayNumberK?.toString()
                            : event.PersianDayNumber?.toString()
                        )}
                      </span>
                      <div>
                        <span
                          className={`text-sm sm:text-lg ${isToday ? 'text-white' : 'text-gray-500'}`}
                        >
                          {toPersianNum(currentMonthName)}
                        </span>
                      </div>
                      <div
                        className={`relative ${
                          event.ModalStatus
                            ? 'cursor-pointer'
                            : 'cursor-default'
                        } ${isToday ? 'text-[#FFFFFF]' : 'text-[gray-500]'}
                      text-center`}
                        style={{
                          fontSize:
                            event.ShortTitle.length > 16
                              ? '0.83rem'
                              : event.ShortTitle.length > 12
                                ? '1.09rem'
                                : event.ShortTitle.length > 8
                                  ? '1.2rem'
                                  : event.ShortTitle.length > 7
                                    ? '1.2rem'
                                    : '1.09rem',
                        }}
                      >
                        {event.ShortTitle}
                      </div>
                    </div>

                    <div style={{ direction: 'ltr' }}>
                      <div
                        className={`${
                          isToday
                            ? 'text-gray-300 font-extrabold text-base'
                            : 'text-[#2a5b71] text-sm'
                        } text-center`}
                      >
                        {formatGeorgianDate(
                          isLeapYear(currentDisplayYear)
                            ? event.GeorgianK
                            : event.Georgian
                        )}
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const validUrl = getValidImageUrl(event.LogoLink);
                    console.log('Logo rendering check:', {
                      originalUrl: event.LogoLink,
                      validUrl,
                      willRender: Boolean(validUrl),
                    });
                    return validUrl ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: '2px',
                          top:
                            window.innerWidth >= 1200
                              ? '88px'
                              : window.innerWidth >= 768
                                ? '75px'
                                : '80px',
                          width:
                            window.innerWidth >= 1200
                              ? '40px'
                              : window.innerWidth >= 768
                                ? '50px'
                                : '30px',
                          height:
                            window.innerWidth >= 1200
                              ? '70px'
                              : window.innerWidth >= 768
                                ? '50px'
                                : '40px',
                          padding: '2px',
                          margin: '2px',
                          marginBottom: '1px',
                          maxWidth: '80%',
                        }}
                        className='rounded-xl overflow-hidden'
                      >
                        <Image
                          src={validUrl || DEFAULT_IMAGE}
                          alt={event.ShortTitle}
                          width={50}
                          height={50}
                          layout='responsive'
                          className='w-full h-auto'
                        />
                      </div>
                    ) : null;
                  })()}

                  <style jsx>{`
                    @media (min-width: 1784px) {
                      .customsizefologosite {
                        left: -10px;
                        width: 25px;
                      }
                    }
                  `}</style>
                </div>
              );
            })}
          </div>
        )}
        {modalVisible && modalContent && (
          <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50'>
            <div className='bg-white p-4 sm:p-8 rounded-lg shadow-lg max-w-[90%] w-full max-h-[80vh] overflow-auto flex flex-col items-center'>
              <h1 className='text-2xl sm:text-4xl font-bold text-[#393939] text-center'>
                {modalContent.EventTitle}
              </h1>
              {(() => {
                const validUrl = getValidImageUrl(modalContent?.ModalImageLink);
                console.log('Modal image rendering check:', {
                  originalUrl: modalContent?.ModalImageLink,
                  validUrl,
                  willRender: Boolean(validUrl),
                });
                return modalContent && validUrl ? (
                  <div className='w-52 4'>
                    <Image
                      src={validUrl || DEFAULT_IMAGE}
                      alt={modalContent.EventTitle}
                      width={400}
                      height={400}
                      className='h-full sm-logo:w-[30px] sm-logo:h-[20px] w-2 p-2'
                      layout='responsive'
                    />
                  </div>
                ) : null;
              })()}
              <p
                className='text-base sm:text-[#707070] p-4 4 text-justify'
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
    </ErrorBoundary>
  );
};

export default FarakhorMobileDarkIframe;