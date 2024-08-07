'use client';
import { useEffect, useState } from 'react';
import jalaali from 'jalaali-js';
import Modal from 'react-modal';
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
    22: 'باد روز',
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: '',
    line1: '',
    line2: '',
    description: '',
  });

  const openModal = (title, line1, line2, yearType) => {
    const description = getDescription(yearType);
    setModalContent({ title, line1, line2, description });
    setModalIsOpen(true);
  };
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
  const [activeTab, setActiveTab] = useState('گاهشمار'); // State to track active tab

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
    const timer = setTimeout(() => {
      Modal.setAppElement(document.getElementById('__next'));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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

  const ElamiYearDescription = () => {
    return (
      <div>
        <h1 className='text-xl font-bold mb-4'>ایلامی</h1>
        <p className='text-lg mb-4'>
          گاه‌شمارایلامی یکی از قدیمی‌ترین گاه‌شمارهای ایرانی است که در دوران
          ایلام باستان (حدود 3200 تا 539 قبل از میلاد) مورد استفاده قرار
          می‌گرفت. ایلامیان که یکی از تمدن‌های باستانی در جنوب غربی ایران بودند،
          از این گاه‌شمار برای تعیین تاریخ و زمان استفاده می‌کردند.
          <br />
          از دیدگاه دکتر مجید ارفعی آقای دکتر عبدالمجید ارفعی باستان شناس و
          مترجم زبان های اکدی: «ایلام را نباید با «ع» نوشت بلکه باید با «الف»
          .نوشت، زیرا در زبان ایلامی «ع» نداریم.
        </p>

        <h2 className='text-3xl font-semibold mt-6 mb-2 '>
          ویژگی‌های گاه‌شمار ایلامی
        </h2>
        <ul className='list-disc list-inside mb-4'>
          <li className='text-lg'>
            <strong>ماه‌ها و روزها</strong>: ایلامیان نیز مانند بسیاری از
            تمدن‌های باستانی، از یک تقویم قمری-خورشیدی استفاده می‌کردند. ماه‌های
            تقویم ایلامی احتمالاً 29 یا 30 روز داشتند که بر اساس مشاهدات ماه
            تنظیم می‌شدند.
          </li>
          <li className='text-lg'>
            <strong>سالیانه</strong>: سال ایلامی احتمالاً 12 ماه داشته است که
            مجموعاً حدود 354 روز می‌شد. برای تنظیم تفاوت بین سال قمری و سال
            خورشیدی، هر چند سال یکبار ماه کبیسه‌ای به سال اضافه می‌کردند.
          </li>
          <li className='text-lg'>
            <strong>کاربرد</strong>: گاه‌شمار ایلامی به‌ویژه در مراسم دینی،
            کشاورزی و امور دولتی کاربرد داشت. برخی از متون مذهبی و اداری ایلامی
            که بر روی لوح‌های گلی نگاشته شده‌اند، تاریخ‌گذاری شده‌اند که
            نشان‌دهنده استفاده گسترده از این تقویم است.
          </li>
          <li className='text-lg'>
            <strong>متون و لوح‌ها</strong>: ایلامیان بر روی لوح‌های گلی به خط
            میخی، تاریخ‌ها و رویدادهای مهم را ثبت می‌کردند. این لوح‌ها حاوی
            اطلاعاتی درباره فعالیت‌های دولتی، مراسم مذهبی و معاملات تجاری هستند.
          </li>
          <li className='text-lg'>
            <strong>خط و زبان</strong>: زبان ایلامی که یکی از زبان‌های باستانی
            ایران است، به خط میخی نگاشته می‌شد. این خط از خطوط بسیار پیچیده و
            باستانی است که کشف و رمزگشایی آن اطلاعات زیادی درباره تقویم ایلامی
            به‌دست آورده است.
          </li>
        </ul>

        <h2 className='text-3xl font-semibold mt-6 mb-2'>
          نمونه‌هایی از آثار ایلامی
        </h2>
        <ul className='list-disc list-inside mb-4'>
          <li className='text-lg'>
            <strong>مجسمه‌ها و سنگ‌نگاره‌ها</strong>: ایلامیان آثار هنری بسیار
            زیبایی مانند مجسمه‌های سنگی و فلزی خلق کرده‌اند که برخی از آن‌ها
            دارای کتیبه‌هایی با تاریخ‌های ایلامی هستند.
          </li>
          <li className='text-lg'>
            <strong>لوح‌های گلی</strong>: بسیاری از این لوح‌ها در حفاری‌های
            باستان‌شناسی کشف شده‌اند و حاوی متون حقوقی، اداری و مذهبی هستند که
            تاریخ‌گذاری شده‌اند.
          </li>
        </ul>

        <h2 className='text-3xl font-semibold mt-6 mb-2'>
          اهمیت گاه‌شمار ایلامی
        </h2>
        <p className='text-lg mb-4'>
          گاه‌شمار ایلامی نقش مهمی در تاریخ‌نگاری و مطالعه تاریخ باستان ایران
          دارد. با بررسی این گاه‌شمار، می‌توان به اطلاعات دقیق‌تری درباره
          رویدادها و تحولات تاریخی ایلام و دیگر تمدن‌های همجوار دست یافت.
        </p>
        <ul className='list-disc list-inside mb-4'>
          <li className='text-lg'>
            <strong>لوح‌های گلی</strong>: بسیاری از اطلاعات ما درباره گاه‌شمار
            ایلامی از طریق لوح‌های گلی به دست آمده است.
          </li>
          <li className='text-lg'>
            <strong>آثار باستان‌شناسی</strong>: حفاری‌های باستان‌شناسی در مناطق
            مختلف ایلام باستان، مانند شوش و سیلک، اطلاعات مهمی درباره این
            گاه‌شمار فراهم کرده‌اند.
          </li>
        </ul>

        <h2 className='text-3xl font-semibold mt-6 mb-2'>منابع:</h2>
        <ul className='list-disc list-inside mb-4'>
          <li className='text-lg'>
            <a
              href='https://kherada.com/Dman.aspx?Id=2007'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              ارفعی، عبدالمجید. «بخشی از گفتگوهای چند سال پیش دربارهٔ ایلام /
              ایلام با دکتر عبدالمجید ارفعی». وبگاه خردگان. دریافت‌شده در ۱۹ اوت
              ۲۰۲۰. عیلام را
            </a>
            نباید با «ع» نوشت بلکه باید با «الف» نوشت، زیرا در زبان ایلامی «ع»
            نداریم.
          </li>
          <li className='text-lg'>
            <a
              href='https://ensani.ir/fa/article/376461/%D9%86%D9%82%D8%B4-%D8%B3%D8%B1%D8%B2%D9%85%DB%8C%D9%86-%D9%87%D8%A7%DB%8C-%D8%B4%D8%B1%D9%82%DB%8C-%D8%A7%DB%8C%D9%84%D8%A7%D9%85-%D8%A7%D9%8E%D8%B1%D8%AC%D8%A7%D9%86-%D9%88-%D8%A7%DB%8C%D8%B0%D9%87-%D8%AF%D8%B1-%D8%A7%D9%86%D8%AA%D9%82%D8%A7%D9%84-%D9%81%D8%B1%D9%87%D9%86%DA%AF-%D8%A7%DB%8C%D9%84%D8%A7%D9%85-%D9%86%D9%88-%D8%A8%D9%87-%D9%BE%D8%A7%D8%B1%D8%B3'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              ↑ «نقش سرزمین‌های شرقی ایلام: اَرجان و ایذه، در انتقال فرهنگ ایلام
              نو به پارس». پرتال جامع علوم انسانی.
            </a>
          </li>
          <li className='text-lg'>
            <a
              href='https://ensani.ir/fa/article/346108/%D9%88%D8%B6%D8%B9%DB%8C%D8%AA-%D8%B3%DB%8C%D8%A7%D8%B3%DB%8C-%D8%A7%DB%8C%D9%84%D8%A7%D9%85-%D8%A8%D8%B9%D8%AF-%D8%A7%D8%B2-%D8%B3%D9%82%D9%88%D8%B7-%D8%AA%D8%A7-%D8%A8%D8%B1%D8%A2%D9%85%D8%AF%D9%86-%D9%87%D8%AE%D8%A7%D9%85%D9%86%D8%B4%DB%8C%D8%A7%D9%86-550-646-%D9%BE.%D9%85-'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              ↑ «وضعیت سیاسی ایلام بعد از سقوط تا برآمدن هخامنشیان (۵۵۰–۶۴۶ پ.
              م)». پرتال جامع علوم انسانی.
            </a>
          </li>
          <li className='text-lg'>
            <a
              href='https://ensani.ir/fa/article/357348/%D8%AF%DA%AF%D8%B1%D8%AF%DB%8C%D8%B3%DB%8C-%D8%AE%D8%AF%D8%A7%DB%8C%D8%A7%D9%86-%D8%AF%D8%B1-%D8%A7%DB%8C%D9%84%D8%A7%D9%85-%D8%A8%D8%A7%D8%B3%D8%AA%D8%A7%D9%86'
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:underline'
            >
              ↑ «دگردیسی خدایان در عیلام باستان». پرتال جامع علوم انسانی.
            </a>
          </li>
          <li className='text-lg text-left' dir='ltr'>
            Alden, J. R., & Mince, L. (2016). `Itinerant potters and the
            transmission of ceramic technologies and styles during the
            Proto-Elamite period in Iran`. Journal of Archaeological Science:
            Reports, 5, 471-481.
          </li>
        </ul>
      </div>
    );
  };

  function getDescription(yearType) {
    const descriptions = {
      ilami: <ElamiYearDescription />,
      madi: 'توضیحات برای سال مادی',
      pahlavi: 'توضیحات برای سال پادشاهی',
      jalali: 'توضیحات برای سال هجری خورشیدی',
      miladi: 'توضیحات برای سال میلادی',
      iraniMelli: 'توضیحات برای سال ایران نو',
      zoroastrian: 'توضیحات برای سال زرتشتی',
    };
    return descriptions[yearType] || 'توضیحات موجود نیست';
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
    <main className='flex min-h-screen w-full flex-col items-center bg-[#333863] px-2 sm:px-4 md:px-2 pb-14'>
      <div className='w-full max-w-4xl mx-auto p-3 pb-1'>
        <h1 className='text-center text-sm text-white p-2 pb-2'>
          برای دریافت فرتور امروز، گاهشماری خود را انتخاب کنید
        </h1>
        {/* 'iran-nov' ============ مهرروز (دوشنبه) ،۱  اَمُرداد سال ۷ ایران نو =========== > 'ایران نو',  */}
        <div className='w-full flex flex-col md:flex-row mt-2 md:mt-8 space-y-2 md:space-y-0 md:space-x-4'>
          <button
            key='iran-nov'
            onClick={() =>
              openModal(
                'ایران نو',
                `${PersianWeekday} (${getTodayPersianWeekdayBaboli()}) ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                `سال ${toPersianNums(convertToIraniMelliYear(today))} ایران نو`,
                'iraniMelli'
              )
            }
            className='bg-[#FFFFFF] p-1.5 rounded-xl cursor-pointer hover:bg-[#dce4ff]'
          >
            <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
              {dates.IraniMelli}
            </p>
            <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
              ایران نو
            </p>
            <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
              {getTodayPersianName()}
            </p>
          </button>
          {/* Other buttons here */}
        </div>

        <div className='w-full flex flex-col md:flex-row mt-2 md:mt-8 space-y-2 md:space-y-0 md:space-x-4'>
          <button
            key='ilami'
            onClick={() =>
              openModal(
                'ایلامی',
                `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                `سال\u2003${toPersianNums(convertToIlamiYear(today))}\u2003 ایلامی`,
                'ilami'
              )
            }
            className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0 md:ml-0'
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
          </button>

          <button
            key='zoroastrian'
            onClick={() =>
              openModal(
                'زرتشتی',
                `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                `سال\u2003${toPersianNums(convertToZoroastrianYear(today))}\u2003 زرتشتی`,
                'zoroastrian'
              )
            }
            className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0 md:ml-0'
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
          </button>

          <button
            key='pahlavi'
            onClick={() =>
              openModal(
                'پادشاهی',
                `${PersianWeekday}\u2003(${getTodayPersianWeekdayBaboli()})\u2003 ${getFormattedDatIraniMelliMonthAndDay(today)}`,
                `سال\u2003${toPersianNums(convertToPahlaviYear(today))}\u2003 پادشاهی`,
                'pahlavi'
              )
            }
            className='bg-[#FFFFFF] p-1.5 rounded-xl flex-1 cursor-pointer hover:bg-[#dce4ff] mt-2 md:mt-0'
          >
            <p className='text-sm md:text-lg lg:text-sm text-[#1C39BB] text-center mt-1'>
              {dates.pahlaviYear}
            </p>
            <p className='text-lg md:text-sm lg:text-2xl text-[#32127A] text-center mt-1'>
              (پادشاهی) هخامنشی
            </p>
            <p className='text-sm md:text-2xl lg:text-3xl text-[#1C39BB] pl-3'>
              {getTodayPersianName()}
            </p>
          </button>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel='Example Modal'
        className='bg-white p-4 rounded-lg shadow-lg max-w-lg max-h-[90vh] overflow-y-auto mx-auto mt-10'
      >
        <h1 className='text-3xl font-bold mb-4 text-center'>
          {modalContent.title}
        </h1>
        <div className='text-right ' dir='rtl'>
          <h2 className='text-xl font-bold '>{modalContent.line1}</h2>
          <h2 className='text-xl font-bold '>{modalContent.line2}</h2>
          <br />
          <p>{modalContent.description}</p>
        </div>
        <button
          onClick={() => setModalIsOpen(false)}
          className='mt-4 bg-blue-950 text-white px-4 py-2 rounded'
        >
          بستن
        </button>
      </Modal>
    </main>
  );
}