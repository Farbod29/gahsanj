'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
import Link from 'next/link';

//import logo from 'Users/farbodaprin/Desktop/iranian-gah-shomar2/public/assets/logo-gahshomar-yellow.png';

function toPersianNums(numString: string) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

const jalaaliMonths = [
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
];

const monthIndices: { [key: string]: string } = {
  '۰۱': 'فروردین',
  '۰۲': 'اردیبهشت',
  '۰۳': 'خرداد',
  '۰۴': 'تیر',
  '۰۵': 'اَمُرداد',
  '۰۶': 'شهریور',
  '۰۷': 'مهر',
  '۰۸': 'آبان',
  '۰۹': 'آذر',
  '۱۰': 'دی',
  '۱۱': 'بهمن',
  '۱۲': 'اسفند',
};



const gregorianMonthsPersianText = {
  1: 'ژانویه (Jan)',
  2: 'فوریه (Feb)',
  3: 'مارس (Mar)',
  4: 'آوریل (Apr)',
  5: 'مه (May)',
  6: 'ژوئن (Jun)',
  7: 'ژوئیه (Jul)',
  8: 'اوت (Aug)',
  9: 'سپتامبر (Sep)',
  10: 'اکتبر (Oct)',
  11: 'نوامبر (Nov)',
  12: 'دسامبر (Dec)',
};

function getGregorianMonth(monthNumber) {
  return gregorianMonthsPersianText[monthNumber] || 'Invalid month';
}

const persianMonths = {
  0: 'ژانویه',
  1: 'فوریه',
  2: 'مارس',
  3: 'آوریل',
  4: 'مه',
  5: 'ژوئن',
  6: 'ژوئیه',
  7: 'اوت',
  8: 'سپتامبر',
  9: 'اکتبر',
  10: 'نوامبر',
  11: 'دسامبر',
};

function toPersianNums2(numString) {
  const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
}

function getPersianDate() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  const year = today.getFullYear();

  const persianMonth = persianMonths[month];
  const persianDay = toPersianNums(day.toString());
  const persianYear = toPersianNums(year.toString());

  return `${persianMonth}, ${persianYear}, ${persianDay} `;
}

// console.log(getPersianDate());

const persianWeekdaysBaboli = {
  0: 'یکشنبه',
  1: 'دوشنبه',
  2: 'سه‌شنبه',
  3: 'چهارشنبه',
  4: 'پنج‌شنبه',
  5: 'آدینه',
  6: 'شنبه',
};

function getTodayPersianWeekdayBaboli(): string {
  const today = new Date();
  const weekday = today.getDay(); // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  return persianWeekdaysBaboli[weekday]; // Return the corresponding Persian weekday name
}

const englishWeekdaysShort = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

function getPersianDateText() {
  const today = new Date();
  const month = today.getMonth();
  const day = today.getDate();
  const year = today.getFullYear();
  const weekday = today.getDay();

  const persianMonth = persianMonths[month];
  const persianWeekdaysBaboli2 = persianWeekdaysBaboli[weekday];
  const englishWeekdayShort = englishWeekdaysShort[weekday];
  const persianDayNum = toPersianNums(day.toString());
  const persianYear = toPersianNums(year.toString());

  return `${persianDayNum} ${persianMonth} (${persianWeekdaysBaboli2} - ${englishWeekdayShort}) سال ${persianYear} میلادی`;
}

interface MiladiText {
  line1: string;
  line2: string;
}
function getMiladiText(dates: { europeanDate: string }): MiladiText {
  const today = new Date();
  const month = today.getMonth() + 1; // getMonth() returns month index starting from 0
  const day = today.getDate();
  const year = today.getFullYear();
  const weekday = today.getDay();

  const persianWeekday = persianWeekdaysBaboli[weekday];
  const englishWeekdayShort = englishWeekdaysShort[weekday];
  const europeanDate = dates.europeanDate; // Read the European date from state

  // Convert day and year to Persian numbers
  const persianDay = toPersianNums(day.toString());
  const persianYear = toPersianNums(year.toString());

  // Get Persian month name
  const gregorianMonthsPersianText1 = gregorianMonthsPersianText[month];

  const part1 = ` ${persianWeekday} `;
  const part2 = `(${englishWeekdayShort})`;
  const part3 = `${persianDay}`;
  const part4 = `${gregorianMonthsPersianText1}`;

  const line1 = `${part1} ${part2}, ${part3} ${part4}`;
  const line2 = `سال ${persianYear} میلادی`;

  return { line1, line2 };
}

function getTodayPersianZaratostianDays(day: number): string {
  const ZaratostianDays = {
    1: 'هرمزد روز (نام خداوند، هستی بخش دانا)',
    2: 'بهمن روز (پندار و خرد نیک)',
    3: 'اردیبهشت روز (بهترین راستی)',
    4: 'شهریور  روز(شهریاری نیرومند)',
    5: 'سپندارمذ  روز (فروتنی)',
    6: 'خرداد (تندرستی و رسایی)',
    7: 'اَمُرداد روز (بی‌مرگی)',
    8: 'دی به آذر  روز (آفریدگار)',
    9: 'آذر روز (آتش)',
    10: 'آبان روز (آب)',
    11: 'خور (آفتاب)',
    12: 'ماه روز',
    13: 'تیر روز(ستارهٔ تیشتر)',
    14: 'گوش روز (جهان، هستی و زندگی)',
    15: 'دی به مهر (آفریدگار)',
    16: 'مهر روز (دوستی و پیمان)',
    17: 'سروش روز (فرمانبرداری)',
    18: 'رَشن روز (دادگری)',
    19: 'فروردین روز (فروهر، پیشرو)',
    20: 'ورهرامروز (پیروزی)',
    21: 'رامروز (خوشی)',
    22: 'باد ',
    23: 'دی به دین روز (آفریدگار)',
    24: 'دین روز (وجدان بینش درونی)',
    25: 'ارد روز  (خوشبختی دارائی)',
    26: 'اشتاد روز (راستی)',
    27: 'آسمان روز ',
    28: 'زامیاد روز (زمین)',
    29: 'مهراسپند (گفتار نیک)',
    30: ' انارام روز (نور جاوید، فروغ و روشنایی بی‌پایان)',
    31: 'ایران روز',
  };

  return ZaratostianDays[day] || 'Invalid day';
}

export default function Home() {
  // Helper component for rendering tabs
  const [dateParts, setDateParts] = useState<MiladiText>({
    line1: '',
    line2: '',
  });
  const Tab = ({ name }: { name: string }) => (
    <button
      className={`p-3 rounded-lg  hover:bg-[#32127A] ${
        activeTab === name ? 'bg-[#1C39BB] text-white' : 'bg-gray-200'
      }`}
      onClick={() => setActiveTab(name)}
    >
      {name}
    </button>
  );
  function getMonthName(monthNumber: string): string | null {
    const monthName = monthIndices[String(monthNumber)];
    return typeof monthName === 'string' ? monthName : null;
  }
  const [PersianWeekday, setPersianWeekday] = useState('');
  const [hejriweekday, setHejriWeekday] = useState('');
  const [georgianWeekday, setGeorgianWeekday] = useState('');

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const [currentPersianMonth, setCurrentPersianMonth] = useState('');
  //const [currentPersianMonth, setCurrentPersianMonth] = useState<string | null>(
  const [currentLatinMonth, setCurrentLatinMonth] = useState('');
  const [activeTab, setActiveTab] = useState('گاه سنج'); // State to track active tab

  const [dates, setDates] = useState({
    europeanDate: '',
    Jdate: '',
    pahlaviYear: '',
    IranianDiako: '',
    IraniMithra: '',
    IraniMelli: '',
    ilami: '',
    zoroastrianYear: '',
    ilamiYear: '',
  });

  useEffect(() => {
    const today = new Date();
    setDates({
      europeanDate: today.toLocaleDateString('en-GB'),
      Jdate: convertToJalali(today),
      pahlaviYear: convertToPahlavi(today),
      IranianDiako: convertToIranianDiako(today),
      IraniMithra: convertToIraniMithra(today),
      IraniMelli: convertToIraniMelliSimple(today),
      ilami: convertToIlami(today),
      zoroastrianYear: convertToZoroastrian(today),
      ilamiYear: convertToIlamiYear(today),
    });
  }, []);

  useEffect(() => {
    if (dates.europeanDate) {
      // console.log(getMiladiText(dates));
    }
  }, [dates]);
  function getJanaliMonth(date: Date): string {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const monthName = jalaaliMonths[jm - 1]; // Get the month name
    const JdateString = toPersianNums(
      `${jy}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
    return monthName;
  }

  function convertToIraniMelliYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    const IraniMelliYear = jy - 1396;
    return IraniMelliYear.toString();
  }

  function convertToIraniMelliSimple(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IraniMelli = jy - 1396;
    return toPersianNums(
      `${IraniMelli}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function getTodayZaratustrianName(): string {
    const today = new Date();
    const { jd } = jalaali.toJalaali(today);
    return getTodayPersianZaratostianDays(jd);
  }

  function convertToJalali(date: Date): string {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const JdateString = toPersianNums(
      `${jy}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
    return JdateString;
  }

  function convertToJalaliYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    return jy.toString();
  }

  function convertToPahlavi(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const pYear = jy + 1180;
    return toPersianNums(
      `${pYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToPahlaviYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    const pYear = jy + 1180;
    return pYear.toString();
  }

  function convertToZoroastrian(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const zoroastrianYear = jy + 2359;
    return toPersianNums(
      `${zoroastrianYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToZoroastrianYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    const zoroastrianYear = jy + 2359;
    return zoroastrianYear.toString();
  }

  function convertToIranianDiako(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IranianDiako = jy + 1321;
    return toPersianNums(
      `${IranianDiako}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIranianDiakoYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    const IranianDiako = jy + 1321;
    return IranianDiako.toString();
  }

  function convertToIlami(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IranianILAMI = jy + 3821;
    return toPersianNums(
      `${IranianILAMI}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIlamiYear(date: Date) {
    const { jy } = jalaali.toJalaali(date);
    const IranianILAMI = jy + 3821;
    return IranianILAMI.toString();
  }

  function convertToIraniMithra(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IraniMithraYear = jy + 6359;
    return toPersianNums(
      `${IraniMithraYear}/${jm < 10 ? '0' + jm : jm}/${jd < 10 ? '0' + jd : jd}`
    );
  }

  function convertToIraniMithraYear(date: Date) {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IranianILAMI = jy + 6359;
    return IranianILAMI.toString();
  }

  function convertToIraniMelli(date: Date): {
    persianDay: string;
    monthName: string;
    persianYear: string;
  } {
    const { jy, jm, jd } = jalaali.toJalaali(date);
    const IraniMelli = jy - 1396;
    const persianDay = toPersianNums(jd.toString());
    const persianYear = toPersianNums(IraniMelli.toString());
    const monthName = jalaaliMonths[jm - 1];
    return { persianDay, monthName, persianYear };
  }
  function getFormattedDatIraniMelliYear(date: Date): string {
    const { persianYear } = convertToIraniMelli(date);

    return ` سال ${persianYear} ایران نو`;
  }
  function getFormattedDatIraniMelliMonthAndDay(date: Date): string {
    const { persianDay, monthName } = convertToIraniMelli(date);

    return ` ${persianDay}  ${monthName}  `;
  }

  const persianWeekdays: { [key: string]: string } = {
    Sunday: ' مهر شید ',
    Monday: '  مهشید ',
    Tuesday: ' بهرام شید ',
    Wednesday: ' تیر شید ',
    Thursday: ' اورمزد شید',
    Friday: ' (ناهید شید (آدینه', // or 'ناهید شید' depending on your preference
    Saturday: '  کیوان شید',
  };

  const persianHejriDays: { [key: string]: string } = {
    Sunday: 'یکشنبه',
    Monday: 'دوشنبه',
    Tuesday: 'سه شنبه ',
    Wednesday: 'چهار شنبه',
    Thursday: 'پنج شنبه  ',
    Friday: 'آدینه', // or 'ناهید روز' depending on your preference
    Saturday: 'شنبه',
  };

  function getTodayPersianName(): string {
    const today = new Date();
    const gregorianWeekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = gregorianWeekdays[today.getDay()];
    return persianWeekdays[todayName]; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }

  function getTodayHejriName(): string {
    const today = new Date();
    const gregorianWeekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = gregorianWeekdays[today.getDay()];
    return persianHejriDays[todayName]; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }

  function extractMonth(dateString: string): string | null {
    // Split the date string by "/"
    const components = dateString.split('/');

    // Access the second element (index 1) of the components array
    const monthNumber = components[1];

    // Pass the month number to the getMonthName function
    return getMonthName(monthNumber);
  }

  useEffect(() => {
    const today = new Date();
    const dates = {
      europeanDate: today.toLocaleDateString('en-GB'),
      // other date conversions...
    };
    const miladiText = getMiladiText(dates);
    setDateParts(miladiText);
  }, []);
  useEffect(() => {
    const today = new Date();
    const monthName = getJanaliMonth(today); // This will be an array e.g., ['اردیبهشت']

    setCurrentPersianMonth(monthName);
  }, []);

  function getTodayGeorgianName(): string {
    const today = new Date();
    const gregorianWeekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const todayName = gregorianWeekdays[today.getDay()];
    return todayName; // Now TypeScript knows that todayName is a valid key for persianWeekdays
  }
  useEffect(() => {
    const setVariables = () => {
      setPersianWeekday(getTodayPersianName());
      setGeorgianWeekday(getTodayGeorgianName());
      setHejriWeekday(getTodayHejriName());
    };
    setVariables();
  }); // Empty dependency array means this effect runs once on mount

  return (
    <main className='flex min-h-screen w-full flex-col items-center bg-[#333863] px-2 sm:px-4 md:px-2 pb-14 mb-3'>
      <div className='w-full max-w-4xl mx-auto p-3 pb-1'>
        <h1 className='text-center m- text-sm text-white p-2 pb-2'>
          برای دریافت فرتور امروز، گاه سنجی خود را انتخاب کنید
        </h1>

        {/* // 'iran-nov' ============ مهرروز (دوشنبه) ،۱  اَمُرداد سال ۷ ایران نو =========== > 'ایران نو',  */}

        <Link
          key='iran-nov'
          href={{
            pathname: '/DownloadImage',
            query: {
              paramDates: dates.IraniMelli,
              paramName: 'ایران نو',
              line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
              line2: `سال\u2003${toPersianNums(convertToIraniMelliYear(today))}\u2003 ایران نو`,
            },
          }}
        >
          <div className=' bg-[#FFFFFF] p-1.5 rounded-xl cursor: pointer hover:bg-[#dce4ff]'>
            <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
              {dates.IraniMelli}
            </p>
            <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
              ایران نو
            </p>
            <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
              {getTodayPersianName()}
            </p>
          </div>
        </Link>

        <div className='w-full flex flex-col md:flex-row mt-2 md:mt-8 space-y-2 md:space-y-0 md:space-x-4'>
          <Link
            key='ilami' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.ilami,
                paramName: 'ایلامی',
                line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                line2: `سال\u2003${toPersianNums(convertToIlamiYear(today))}\u2003 ایلامی`,
              },
            }}
          >
            <div
              className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0 md:ml-0'
              // onClick={() => handleBoxClick(dates.ilami, getTodayPersianName())}
            >
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.ilami}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
                ایلامی
              </p>
              <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
                {getTodayPersianName()}
              </p>
            </div>
          </Link>

          <Link
            key='zoroastrian' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.zoroastrianYear,
                paramName: 'زرتشتی',
                line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                line2: `سال\u2003${toPersianNums(convertToZoroastrianYear(today))}\u2003 زرتشتی`,
              },
            }}
          >
            <div
              className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0 md:ml-0'
              // onClick={() => handleBoxClick(dates.ilami, getTodayPersianName())}
            >
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.zoroastrianYear}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
                زرتشتی
              </p>
              <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
                {getTodayZaratustrianName()}
              </p>
            </div>
          </Link>

          <Link
            key='pahlavi' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.pahlaviYear,
                paramName: 'شاهنشاهی',
                line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                line2: `سال\u2003${toPersianNums(convertToPahlaviYear(today))}\u2003 شاهنشاهی`,
              },
            }}
          >
            <div className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0'>
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.pahlaviYear}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
                (شاهنشاهی) هخامنشی
              </p>
              <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
                {getTodayPersianName()}
              </p>
            </div>
          </Link>
        </div>
        <div className='w-full flex flex-col md:flex-row mt-4 space-y-4 md:space-y-0 md:space-x-4'>
          <Link
            key='iranian-diako' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.IranianDiako,
                paramName: 'مادی / کردی',
                line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                line2: `سال\u2003${toPersianNums(convertToIranianDiakoYear(today))}\u2003 مادی`,
              },
            }}
          >
            <div className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0'>
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.IranianDiako}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-0'>
                مادی / کردی
              </p>
              <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
                {getTodayPersianName()}
              </p>
            </div>
          </Link>
          <Link
            key='jalali' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramDates: dates.Jdate,
                paramName: 'هجری خورشیدی',
                line1: `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                line2: `سال\u2003${toPersianNums(convertToJalaliYear(today))}\u2003 هجری خورشیدی`,
              },
            }}
          >
            <div className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0'>
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.Jdate}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-0'>
                هجری خورشیدی
              </p>
              <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
                {getTodayHejriName()}
              </p>
            </div>
          </Link>

          {/* // Miladi ======================= > میلادی  */}

          <Link
            key='miladi-date' // Add unique key
            href={{
              pathname: '/DownloadImage',
              query: {
                paramName: 'میلادی',
                line1: dateParts.line1.split('  ').join('\u2003'),
                line2: dateParts.line2.split(' ').join('\u2003'),
              },
            }}
          >
            <div className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-0 md:mt-0'>
              <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
                {dates.europeanDate}
              </p>
              <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-0'>
                میلادی
              </p>
              <p className='text-sm md:text-2xla lg:text-3xl text-[#1C39BB] pl-3'>
                {georgianWeekday}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
