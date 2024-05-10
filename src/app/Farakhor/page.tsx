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
    return `${gd} ${monthName}`;
  };

  return (
    <div className="bg-white flex flex-col items-center justify-center p-2">
      <div className="bg-[#FF7F50] shadow-lg rounded-lg p-12 w-full text-center text-2xl font-bold text-white fixed top-0 flex justify-between items-center">
        <button
          onClick={() =>
            updateMonth(
              (monthNames.indexOf(currentMonthName) - 1 + monthNames.length) %
                monthNames.length
            )
          }
        >
          &lt;
        </button>
        <h1>{`فراخورهای ماه ${currentMonthName}`}</h1>
        <button
          onClick={() =>
            updateMonth(
              (monthNames.indexOf(currentMonthName) + 1) % monthNames.length
            )
          }
        >
          &gt;
        </button>
      </div>
      <div
        className="grid grid-cols-3 gap-5 mt-32 ml-3 w-full p-2"
        style={{ direction: 'rtl' }}

        //////////////////////////////////BOXEX///////////////
      >
        {Object.entries(currentMonthEvents).map(([day, event]) => (
          <div
            key={day}
            onClick={() => handleDayClick(event)}
            className="relative cursor-pointer bg-[#E0E0E0] shadow-md rounded-lg p-2 text-center"
            style={{ width: '130px', height: '130px' }}
          >
            <div className="absolute bottom-0 left-2 w-[50px] h-[50px] flex items-center justify-center pb-2 ">
              {event.logo && ( // Check if `event.logo` is not an empty string
                <Image
                  src={event.logo}
                  alt=""
                  width={30} // Specify width
                  height={30} // Specify height
                  layout="responsive"
                />
              )}
            </div>
            <div className="absolute top-0 left-0 pt-2 pl-7 flex items-center">
              <span className="text-[#FF8200] font-semibold text-3xl">
                {toPersianNum(day)}
              </span>
              <span className="text-[#707070] text-lg ml-1 mr-1">
                {/* Margin left for spacing */}
                {toPersianNum(currentMonthName)}
              </span>
            </div>
            <div className="text-[#373636] mt-7 text-xl pb-1 mb-1">
              <div
                style={{
                  fontSize:
                    event.shortTitle.length > 16
                      ? '0.69rem'
                      : event.shortTitle.length > 12
                      ? '0.79rem'
                      : event.shortTitle.length > 8
                      ? '0.875rem'
                      : event.shortTitle.length > 7
                      ? '1.275rem'
                      : '1.3rem',
                }}
              >
                {event.shortTitle}
              </div>
            </div>
            <div className="text-[#2a5b71] ml-2 mb-[40px] absolute top-24 left-1/2  ">
              {getGregorianDate(
                new Date().getFullYear(),
                monthNames.indexOf(currentMonthName) + 1,
                parseInt(day)
              )}
            </div>
          </div>
        ))}
      </div>
      {modalVisible && modalContent && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-lg"
          style={{ width: '600px', height: '600px' }}
        >
          <h1 className="text-xl font-bold text-[#393939]">
            {modalContent.title}
          </h1>
          <p className="text-[#707070]">{modalContent.text}</p>
          <button
            className="mt-4 px-4 py-2 bg-[#FF8200] text-white rounded"
            onClick={() => setModalVisible(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Occasions;
