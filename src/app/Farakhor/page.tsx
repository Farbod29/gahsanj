// First line in the file
'use client';
import React, { useState, useEffect, useMemo } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';

interface Occasion {
  NumberOfTheDay: string;
  shortTitle: string;
  title: string;
  modalStatus: boolean;
  text: string;
  logo: string;
  imagesLink: string;
  extraLinks: string[];
}

interface Occasions {
  [key: string]: {
    [key: string]: Occasion;
  };
}

const Occasions: React.FC = () => {
  const [currentMonthEvents, setCurrentMonthEvents] = useState<
    Record<string, Occasion>
  >({});
  const [currentMonthName, setCurrentMonthName] = useState<string>('');
  const [allOccasions, setAllOccasions] = useState<Occasions | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);

  const monthNames = useMemo(
    () => [
      'فروردین',
      'اردیبهشت',
      'خرداد',
      'تیر',
      'مرداد',
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

  const getTodayGregorian = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1; // getMonth() returns 0-based index
    const year = today.getFullYear();
    return `${day} ${gregorianMonthNames[month - 1]}`; // Assuming you want to match the format "day monthName"
  };

  useEffect(() => {
    const fetchOccasions = async () => {
      if (!allOccasions) {
        const response = await fetch(
          'https://raw.githubusercontent.com/GahshomarFar/Gahshomar-Database/main/Farakhor.JSON'
        );
        const data: Occasions = await response.json();
        setAllOccasions(data);

        const today = new Date();
        const jToday = jalaali.toJalaali(today);
        const newName = monthNames[jToday.jm - 1];
        setCurrentMonthEvents(data[newName] || {});
        setCurrentMonthName(newName);
      }
    };

    fetchOccasions();
  }, [allOccasions, monthNames]);

  const updateMonth = (monthIndex: number) => {
    const newName = monthNames[monthIndex];
    if (allOccasions) {
      setCurrentMonthEvents(allOccasions[newName] || {});
      setCurrentMonthName(newName);
    }
  };

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.modalStatus) {
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

  const gregorianMonthNames = [
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

  const getGregorianDate = (jYear: number, jMonth: number, jDay: number) => {
    // Convert Jalaali date to Gregorian
    const { gy, gm, gd } = jalaali.toGregorian(jYear, jMonth, jDay);

    // Fetch the Gregorian month name using the gm (1-based index)
    const monthName = gregorianMonthNames[gm - 1];

    // Return the formatted date with day and month name
    return `${gd - 1} ${monthName}`;
  };

  const todayGregorian = getTodayGregorian(); // Call this outside the render loop to avoid recomputation

  return (
    <div className="bg-white flex flex-col items-center justify-center pt-24">
      <div className="bg-[#FF7F50] shadow-lg rounded-lg px-4 py-7 w-full text-center text-xl md:text-2xl font-bold text-white fixed top-0 flex justify-between items-center z-10">
        <button
          onClick={() =>
            updateMonth(
              (monthNames.indexOf(currentMonthName) - 1 + monthNames.length) %
                monthNames.length
            )
          }
          className="text-4xl md:text-5xl" // Make the buttons larger
        >
          &lt;
        </button>
        <h1>فراخورهای ماه {currentMonthName}</h1>
        <button
          onClick={() =>
            updateMonth(
              (monthNames.indexOf(currentMonthName) + 1) % monthNames.length
            )
          }
          className="text-4xl md:text-5xl" // Make the buttons larger
        >
          &gt;
        </button>
      </div>

      {/* /////////////GRIDS//////////////// */}
      <div
        className="grid grid-cols-2 se:grid-cols-2 iphone14:grid-cols-3 lg:grid-cols-6 gap-4 mt-3 mr-1 w-full p-3 lg:mt-8 mt:p-10"
        style={{ direction: 'rtl' }}
      >
        {Object.entries(currentMonthEvents).map(([day, event]) => {
          const eventDate = getGregorianDate(
            new Date().getFullYear(),
            monthNames.indexOf(currentMonthName) + 1,
            parseInt(day)
          );
          const isToday = eventDate === todayGregorian; // Compare event date with today's date

          return (
            <div
              key={day}
              onClick={() => handleDayClick(event)}
              className={`relative cursor-pointer ${
                isToday
                  ? 'bg-[#e7e1b5] border-2 border-[#8a5d25] shadow-lg'
                  : 'bg-[#E0E0E0]'
              } shadow-md rounded-lg p-2 text-center`}
              style={{ width: '100%', maxWidth: '300px', height: 'auto' }}
            >
              <div className="absolute bottom-0 left-3 sm-logo:left-2 w-[30px] lg:h-[70px]  logoSsize sm:w-16 xs:w-8  customsizefologosite xs:left-0 sm:h-[70px] h-[40px] flex items-center justify-center pb-2 pl:2 customsizefologosite">
                {event.logo && (
                  <Image
                    src={event.logo}
                    alt="Logo Of the Day"
                    width={50} // Default width
                    height={50} // Default height
                    className="w-full h-full sm-logo:w-[20px] sm-logo:h-[20px]" // Make logo smaller at 572px breakpoint
                    layout="responsive"
                  />
                )}
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[#FF8200] text-3xl sm:text-3xl font-bold">
                  {toPersianNum(day)}
                </span>
                <span className="text-[#707070] text-sm sm:text-lg ">
                  {toPersianNum(currentMonthName)}
                </span>
                <div
                  className="text-[#373636] text-xl sm:text-xl font-bold B14-SE2"
                  style={{
                    fontSize:
                      event.shortTitle.length > 16
                        ? '0.79rem'
                        : event.shortTitle.length > 12
                        ? '0.99rem'
                        : event.shortTitle.length > 8
                        ? '1.0rem'
                        : event.shortTitle.length > 7
                        ? '1.175rem'
                        : '1.3rem',
                  }}
                >
                  {event.shortTitle}
                </div>

                <div
                  className="relative"
                  style={{ height: '32px', position: 'relative' }}
                >
                  <div className="text-[#2a5b71] B14-SE1 absluteEnmonth ">
                    {eventDate}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {modalVisible && modalContent && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 sm:p-8 rounded-lg shadow-lg"
          style={{
            width: '90%',
            maxWidth: '600px',
            height: 'auto',
            maxHeight: '600px',
          }}
        >
          <h1 className="text-lg sm:text-xl font-bold text-[#393939]">
            {modalContent.title}
          </h1>
          <p className="text-sm sm:text-[#707070]">{modalContent.text}</p>
          <button
            className="mt-2 sm:mt-4 px-3 sm:px-4 py-1 sm:py-2 bg-[#FF8200] text-white rounded"
            onClick={() => setModalVisible(false)}
          >
            بستن
          </button>
        </div>
      )}
    </div>
  );
};

export default Occasions;
