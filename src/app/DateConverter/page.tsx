'use client';
import React, { useState, useCallback, useEffect } from 'react';
import jalaali from 'jalaali-js';
import Footer from '@/components/Footer/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { convertDate as convertDateUtil } from './utils';

// Function to convert English numbers to Persian
const toPersianNum = (num: string | number): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .split('')
    .map((char) => persianNumbers[Number(char)] || char)
    .join('');
};

const DirectionToggle = ({
  direction,
  setDirection,
  setPersianInput,
}: {
  direction: 'g2p' | 'p2g';
  setDirection: (dir: 'g2p' | 'p2g') => void;
  setPersianInput: (value: boolean) => void;
}) => {
  return (
    <div className='relative w-full bg-[#0f2439]/50 rounded-xl p-1.5'>
      {/* Background slider */}
      <motion.div
        className='absolute top-1.5 bottom-1.5 rounded-lg bg-blue-500/20 backdrop-blur-sm'
        initial={false}
        animate={{
          x: direction === 'g2p' ? '0%' : '100%',
          width: '50%',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      />

      {/* Toggle buttons */}
      <div className='relative flex justify-between gap-2'>
        <motion.button
          className={`flex-1 py-3 px-4 rounded-lg text-sm sm:text-base transition-colors
                     ${direction === 'g2p' ? 'text-white' : 'text-blue-200/70 hover:text-blue-100'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDirection('g2p');
            setPersianInput(false);
          }}
        >
          میلادی به خورشیدی
        </motion.button>

        <motion.button
          className={`flex-1 py-3 px-4 rounded-lg text-sm sm:text-base transition-colors
                     ${direction === 'p2g' ? 'text-white' : 'text-blue-200/70 hover:text-blue-100'}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDirection('p2g');
            setPersianInput(true);
          }}
        >
          خورشیدی به میلادی
        </motion.button>
      </div>
    </div>
  );
};

const getToday = () => {
  const today = new Date();
  const { jy, jm, jd } = jalaali.toJalaali(today);
  return {
    jy: jy.toString(),
    jm: jm.toString().padStart(2, '0'),
    jd: jd.toString().padStart(2, '0'),
  };
};

// Add helper function to get today's Gregorian date
const getTodayGregorian = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return { year: year.toString(), month, day };
};

// Add VirtualKeyboard component
const VirtualKeyboard = ({
  isOpen,
  onClose,
  onConfirm,
  initialValue,
  direction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  initialValue: string;
  direction: 'g2p' | 'p2g';
}) => {
  const [inputValue, setInputValue] = useState(() => {
    // If converting from Persian to Gregorian, start with current Persian year
    if (direction === 'p2g') {
      const { jy } = jalaali.toJalaali(new Date());
      return jy.toString();
    }
    return initialValue;
  });

  // Reset input value when keyboard is opened
  useEffect(() => {
    if (isOpen) {
      if (direction === 'p2g') {
        const { jy } = jalaali.toJalaali(new Date());
        setInputValue(jy.toString());
      } else {
        setInputValue(initialValue);
      }
    }
  }, [isOpen, direction, initialValue]);

  const handleNumberClick = (num: string) => {
    if (
      inputValue.length < 4 ||
      (inputValue.startsWith('-') && inputValue.length < 5)
    ) {
      setInputValue((prev) => {
        if (prev === '0') return num;
        return prev + num;
      });
    }
  };

  const handleBackspace = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleNegative = () => {
    setInputValue((prev) => {
      if (prev.startsWith('-')) {
        return prev.slice(1);
      }
      return '-' + prev;
    });
  };

  // Add clear handler
  const handleClear = () => {
    setInputValue('0');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'
          onClick={onClose}
        >
          <motion.div
            className='bg-[#1f4e7a] p-6 rounded-xl shadow-2xl border border-blue-400/20 w-full max-w-xs'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='mb-4'>
              <input
                type='text'
                value={toPersianNum(inputValue)}
                readOnly
                className='w-full text-center p-3 rounded-lg bg-[#0f2439] border border-blue-400/30 text-xl'
                dir='ltr'
              />
            </div>
            <div className='grid grid-cols-3 gap-2'>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num.toString())}
                  className='p-4 bg-[#0f2439] rounded-lg hover:bg-blue-500/20 text-xl transition-colors'
                >
                  {toPersianNum(num.toString())}
                </button>
              ))}
              <button
                onClick={handleNegative}
                className='p-4 bg-[#0f2439] rounded-lg hover:bg-blue-500/20 text-xl transition-colors'
              >
                ±
              </button>
              <button
                onClick={() => handleNumberClick('0')}
                className='p-4 bg-[#0f2439] rounded-lg hover:bg-blue-500/20 text-xl transition-colors'
              >
                {toPersianNum('0')}
              </button>
              <div className='grid grid-cols-2 gap-1'>
                <button
                  onClick={handleBackspace}
                  className='p-4 bg-[#0f2439] rounded-lg hover:bg-blue-500/20 text-xl transition-colors'
                >
                  ←
                </button>
                <button
                  onClick={handleClear}
                  className='p-4 bg-[#0f2439] rounded-lg hover:bg-blue-500/20 text-sm transition-colors text-red-400'
                >
                  C
                </button>
              </div>
            </div>
            <div className='mt-4 grid grid-cols-2 gap-2'>
              <button
                onClick={onClose}
                className='p-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors'
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  onConfirm(inputValue);
                  onClose();
                }}
                className='p-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors'
              >
                تایید
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const DateConverter = () => {
  // Conversion direction: "g2p" = Gregorian to Persian, "p2g" = Persian to Gregorian
  const [direction, setDirection] = useState<'g2p' | 'p2g'>('g2p');

  // For Gregorian-to-Persian conversion
  const [gregYear, setGregYear] = useState(() => getTodayGregorian().year);
  const [gregMonth, setGregMonth] = useState(() => getTodayGregorian().month);
  const [gregDay, setGregDay] = useState(() => getTodayGregorian().day);

  // Update the gregDate default value
  const [gregDate, setGregDate] = useState(() => {
    const { year, month, day } = getTodayGregorian();
    return `${year}-${month}-${day}`;
  });

  // For Persian-to-Gregorian conversion
  const [persianYear, setPersianYear] = useState(() => getToday().jy);
  const [persianMonth, setPersianMonth] = useState(() => getToday().jm);
  const [persianDay, setPersianDay] = useState(() => getToday().jd);

  // Conversion result – if direction is "g2p", this is { jy, jm, jd }; if "p2g", then { gy, gm, gd }
  const [conversionResult, setConversionResult] = useState<any>(null);

  // New state for manual Gregorian date input

  // Add state for animation trigger
  const [flashTrigger, setFlashTrigger] = useState(0);

  // Add state for virtual keyboard
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<
    'persian' | 'gregorian' | null
  >(null);

  // Add new state for persianInput
  const [persianInput, setPersianInput] = useState<boolean>(false);

  // Add a simple conversion function for dates before common era
  const approximateJalaliBeforeCommonEra = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Convert to 1-based month
    const day = date.getDate();

    // Check if date is before Persian New Year (March 21st)
    const isBeforePersianNewYear = month < 3 || (month === 3 && day <= 20);

    // Calculate Persian year based on whether date is before or after March 21st
    const persianYear = isBeforePersianNewYear
      ? -year + 622 // Before March 21st
      : -year + 621; // After March 21st

    return {
      jy: persianYear,
      jm: month,
      jd: day,
      isBeforeCommonEra: true,
    };
  };

  const convertDate = useCallback(() => {
    // Handle empty or invalid inputs
    if (direction === 'g2p') {
      if (
        gregYear === '' ||
        gregMonth === '' ||
        gregDay === '' ||
        gregYear === '-' ||
        (gregYear !== '' && isNaN(parseInt(gregYear))) ||
        (gregMonth !== '' && isNaN(parseInt(gregMonth))) ||
        (gregDay !== '' && isNaN(parseInt(gregDay)))
      ) {
        setConversionResult(null);
        return;
      }

      const yearNum = parseInt(gregYear);
      const monthNum = parseInt(gregMonth);
      const dayNum = parseInt(gregDay);

      try {
        const result = convertDateUtil(yearNum, monthNum, dayNum, 'g2p');
        setConversionResult(result);
        setFlashTrigger((prev) => prev + 1);
      } catch (error) {
        console.error('Conversion error:', error);
        setConversionResult({ error: true });
      }
    } else {
      // Persian to Gregorian conversion
      if (
        persianYear === '' ||
        persianMonth === '' ||
        persianDay === '' ||
        persianYear === '-'
      ) {
        setConversionResult(null);
        return;
      }

      const jyNum = parseInt(persianYear);
      const jmNum = parseInt(persianMonth);
      const jdNum = parseInt(persianDay);

      if (!isNaN(jyNum) && !isNaN(jmNum) && !isNaN(jdNum)) {
        try {
          const result = convertDateUtil(jyNum, jmNum, jdNum, 'p2g');
          setConversionResult(result);
          setFlashTrigger((prev) => prev + 1);
        } catch (error) {
          console.error('Conversion error:', error);
          setConversionResult({ error: true });
        }
      } else {
        setConversionResult(null);
      }
    }
  }, [
    direction,
    gregYear,
    gregMonth,
    gregDay,
    persianYear,
    persianMonth,
    persianDay,
  ]);

  useEffect(() => {
    convertDate();
  }, [convertDate]);

  // Update the era calculations to handle negative years correctly
  const calculateEraYears = (
    year: number,
    isBeforeCommonEra: boolean = false
  ) => {
    console.log('calculateEraYears called with:', {
      year,
      isBeforeCommonEra,
      persianInput,
    }); // Debug log

    const numericYear = Number(year);
    const isNegative = numericYear < 0;
    console.log('After conversion:', { numericYear, isNegative }); // Debug log

    if (!persianInput) {
      // For Gregorian years (میلادی)
      console.log('Processing Gregorian year calculation'); // Debug log

      if (isNegative) {
        const absYear = Math.abs(numericYear);
        return {
          شاهنشاهی: -absYear + 2583,
          مادی: -absYear + 2724,
          ایلامی: -absYear + 5224,
          زردشتی: -absYear + 3762,
        };
      } else {
        return {
          شاهنشاهی: numericYear + 558,
          مادی: numericYear + 698,
          ایلامی: numericYear + 3198,
          زردشتی: numericYear + 1736,
        };
      }
    } else {
      // For Persian years (خورشیدی)
      console.log('Processing Persian year calculation'); // Debug log
      if (isNegative) {
        return {
          شاهنشاهی: year + 2583,
          مادی: year + 2724,
          ایلامی: year + 5224,
          زردشتی: year + 3762,
        };
      } else {
        return {
          شاهنشاهی: year + 1180,
          مادی: year + 1321,
          ایلامی: year + 3821,
          زردشتی: year + 2359,
        };
      }
    }
  };

  // Update era results calculation
  let eraResults: { [key: string]: number } | null = null;
  if (conversionResult && !conversionResult.error) {
    console.log('Direction:', direction); // Debug log
    console.log('ConversionResult:', conversionResult); // Debug log

    if (direction === 'g2p' && conversionResult.jy !== undefined) {
      console.log('Calculating era for Gregorian input:', gregYear); // Debug log
      eraResults = calculateEraYears(
        parseInt(gregYear),
        conversionResult.isBeforeCommonEra
      );
    } else if (direction === 'p2g' && persianYear) {
      console.log('Calculating era for Persian input:', persianYear); // Debug log
      const jyNum = parseInt(persianYear, 10);
      if (!isNaN(jyNum)) {
        eraResults = calculateEraYears(
          jyNum,
          conversionResult.isBeforeCommonEra
        );
      }
    }
  }

  // Helper function to format date with slashes
  const formatWithSlashes = (input: string) => {
    input = input.replace(/\D/g, ''); // Remove non-digits
    if (input.length > 8) input = input.slice(0, 8);

    let formatted = '';
    if (input.length > 4) {
      formatted = input.slice(0, 4) + '/' + input.slice(4);
      if (input.length > 6) {
        formatted = formatted.slice(0, 7) + '/' + input.slice(6);
      }
    } else {
      formatted = input;
    }
    return formatted;
  };

  // Enhanced date input handler
  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    if (e.target.type === 'date') {
      // Handle calendar selection
      setGregDate(input);
      setManualGregDate(input.replace(/-/g, '/'));
    } else {
      // Handle manual input
      const formatted = formatWithSlashes(input);
      setManualGregDate(formatted);

      if (formatted.length === 10) {
        // YYYY/MM/DD
        const [year, month, day] = formatted.split('/').map(Number);
        if (year && month && day) {
          const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          setGregDate(dateStr);
        }
      }
    }
  };

  // Handle Persian date input with auto-formatting
  const handlePersianDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'year' | 'month' | 'day'
  ) => {
    let value = e.target.value.replace(/\D/g, '');

    switch (type) {
      case 'year':
        // Allow empty value for year
        if (value === '' || value.length <= 4) setPersianYear(value);
        break;
      case 'month':
        // Allow empty value for month
        if (value === '' || parseInt(value) <= 12) setPersianMonth(value);
        break;
      case 'day':
        // Allow empty value for day
        if (value === '' || parseInt(value) <= 31) setPersianDay(value);
        break;
    }
  };

  // Update the formatDate function
  const formatDate = (date: any, type: 'persian' | 'gregorian') => {
    if (date.error) return 'تاریخ نامعتبر';

    const year = type === 'persian' ? date.jy : date.gy;
    const month = type === 'persian' ? date.jm : date.gm;
    const day = type === 'persian' ? date.jd : date.gd;
    const isBeforeEra = date.isBeforeCommonEra;

    const formattedDate = `${Math.abs(year)}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
    const persianDate = toPersianNum(formattedDate);

    return `${persianDate} ${isBeforeEra ? '-' : ''}`;
  };

  // Update the increment/decrement functions to handle negative numbers
  const incrementValue = (type: 'year' | 'month' | 'day') => {
    switch (type) {
      case 'year':
        setPersianYear((prev) => {
          if (prev === '') return '1'; // Start from 1 if empty
          const currentYear = parseInt(prev);
          return (currentYear + 1).toString();
        });
        break;
      case 'month':
        setPersianMonth((prev) => {
          if (prev === '') return '01'; // Start from 01 if empty
          const newMonth = parseInt(prev) + 1;
          return newMonth > 12 ? '01' : newMonth.toString().padStart(2, '0');
        });
        break;
      case 'day':
        setPersianDay((prev) => {
          if (prev === '') return '01'; // Start from 01 if empty
          const newDay = parseInt(prev) + 1;
          return newDay > 31 ? '01' : newDay.toString().padStart(2, '0');
        });
        break;
    }
  };

  const decrementValue = (type: 'year' | 'month' | 'day') => {
    switch (type) {
      case 'year':
        setPersianYear((prev) => {
          if (prev === '') return '-1'; // Start from -1 if empty
          const currentYear = parseInt(prev);
          return (currentYear - 1).toString();
        });
        break;
      case 'month':
        setPersianMonth((prev) => {
          if (prev === '') return '12'; // Start from 12 if empty
          const newMonth = parseInt(prev) - 1;
          return newMonth < 1 ? '12' : newMonth.toString().padStart(2, '0');
        });
        break;
      case 'day':
        setPersianDay((prev) => {
          if (prev === '') return '31'; // Start from 31 if empty
          const newDay = parseInt(prev) - 1;
          return newDay < 1 ? '31' : newDay.toString().padStart(2, '0');
        });
        break;
    }
  };

  // Add helper function to update gregDate when individual parts change
  const updateGregDate = (day: string, month: string, year: string) => {
    const dateStr = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    setGregDate(dateStr);
  };

  // Update calendar picker onChange
  const handleCalendarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGregDate(value);
    const [year, month, day] = value.split('-');
    setGregYear(year);
    setGregMonth(month);
    setGregDay(day);
  };

  return (
    <div className='min-h-screen bg-[#0f2439] flex flex-col items-center justify-center p-6 text-white'>
      <h1 className='text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300'>
        گاه گردانی تاریخ میلادی به خورشیدی
      </h1>
      <div
        className='bg-[#1f4e7a]/80 backdrop-blur-sm rounded-xl p-8 w-full max-w-md shadow-2xl 
                      border border-blue-400/20 transition-all duration-300'
      >
        <div className='mb-6'>
          <span className='block mb-3 text-lg text-blue-200 font-semibold direction-rtl text-right'>
            : جهت تبدیل
          </span>
          <DirectionToggle
            direction={direction}
            setDirection={setDirection}
            setPersianInput={setPersianInput}
          />
        </div>

        {direction === 'g2p' ? (
          <div className='mb-6'>
            <label className='block mb-3 text-lg text-blue-200 font-semibold text-right'>
              : تاریخ میلادی
            </label>
            <div className='flex justify-between gap-2 rtl'>
              {/* Year Input - سمت چپ */}
              <div className='relative flex-1'>
                <button
                  onClick={() => {
                    if (gregYear !== '') {
                      const newYear = parseInt(gregYear) + 1;
                      setGregYear(newYear.toString());
                      updateGregDate(gregDay, gregMonth, newYear.toString());
                    }
                  }}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <div
                  onClick={() => {
                    setActiveInput('gregorian');
                    setShowVirtualKeyboard(true);
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2 cursor-pointer'
                >
                  {toPersianNum(gregYear)}
                </div>
                <button
                  onClick={() => {
                    const newYear = parseInt(gregYear) - 1;
                    setGregYear(newYear.toString());
                    updateGregDate(gregDay, gregMonth, newYear.toString());
                  }}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>

              <span className='text-2xl self-center'>/</span>

              {/* Month Input - وسط */}
              <div className='relative flex-1'>
                <button
                  onClick={() => {
                    const newMonth = (parseInt(gregMonth) % 12) + 1;
                    const monthStr = newMonth.toString().padStart(2, '0');
                    setGregMonth(monthStr);
                    updateGregDate(gregDay, monthStr, gregYear);
                  }}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <input
                  type='text'
                  value={toPersianNum(gregMonth)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^۰-۹]/g, '');
                    const englishValue = value.replace(/[۰-۹]/g, (d) =>
                      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    );
                    if (
                      englishValue === '' ||
                      (parseInt(englishValue) <= 12 && englishValue.length <= 2)
                    ) {
                      const newValue = englishValue || '01';
                      setGregMonth(newValue);
                      updateGregDate(gregDay, newValue, gregYear);
                    }
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2'
                  placeholder='ماه'
                  dir='rtl'
                />
                <button
                  onClick={() => {
                    const newMonth =
                      parseInt(gregMonth) <= 1 ? 12 : parseInt(gregMonth) - 1;
                    const monthStr = newMonth.toString().padStart(2, '0');
                    setGregMonth(monthStr);
                    updateGregDate(gregDay, monthStr, gregYear);
                  }}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>

              <span className='text-2xl self-center'>/</span>

              {/* Day Input - سمت راست */}
              <div className='relative flex-1'>
                <button
                  onClick={() => {
                    const newDay = (parseInt(gregDay) % 31) + 1;
                    const dayStr = newDay.toString().padStart(2, '0');
                    setGregDay(dayStr);
                    updateGregDate(dayStr, gregMonth, gregYear);
                  }}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <input
                  type='text'
                  value={toPersianNum(gregDay)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^۰-۹]/g, '');
                    const englishValue = value.replace(/[۰-۹]/g, (d) =>
                      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    );
                    if (
                      englishValue === '' ||
                      (parseInt(englishValue) <= 31 && englishValue.length <= 2)
                    ) {
                      const newValue = englishValue || '01';
                      setGregDay(newValue);
                      updateGregDate(newValue, gregMonth, gregYear);
                    }
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2'
                  placeholder='روز'
                  dir='rtl'
                />
                <button
                  onClick={() => {
                    const newDay =
                      parseInt(gregDay) <= 1 ? 31 : parseInt(gregDay) - 1;
                    const dayStr = newDay.toString().padStart(2, '0');
                    setGregDay(dayStr);
                    updateGregDate(dayStr, gregMonth, gregYear);
                  }}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className='mb-6'>
            <label className='block mb-3 text-lg text-blue-200 font-semibold text-right'>
              : تاریخ خورشیدی
            </label>
            <div className='flex justify-between gap-2 rtl'>
              {/* Year Input - سمت چپ */}
              <div className='relative flex-1'>
                <button
                  onClick={() => incrementValue('year')}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <div
                  onClick={() => {
                    setActiveInput('persian');
                    setShowVirtualKeyboard(true);
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2 cursor-pointer'
                >
                  {toPersianNum(persianYear)}
                </div>
                <button
                  onClick={() => decrementValue('year')}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>

              <span className='text-2xl self-center'>/</span>

              {/* Month Input - وسط */}
              <div className='relative flex-1'>
                <button
                  onClick={() => incrementValue('month')}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <input
                  type='text'
                  value={toPersianNum(persianMonth)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^۰-۹]/g, '');
                    const englishValue = value.replace(/[۰-۹]/g, (d) =>
                      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    );
                    if (
                      englishValue === '' ||
                      (parseInt(englishValue) <= 12 && englishValue.length <= 2)
                    ) {
                      setPersianMonth(englishValue || '01');
                    }
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2'
                  placeholder='ماه'
                  dir='ltr'
                  style={{
                    textAlign: 'center',
                    direction: 'ltr',
                    unicodeBidi: 'plaintext',
                  }}
                />
                <button
                  onClick={() => decrementValue('month')}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>

              <span className='text-2xl self-center'>/</span>

              {/* Day Input - سمت راست */}
              <div className='relative flex-1'>
                <button
                  onClick={() => incrementValue('day')}
                  className='absolute top-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-t-lg'
                >
                  ▲
                </button>
                <input
                  type='text'
                  value={toPersianNum(persianDay)}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^۰-۹]/g, '');
                    const englishValue = value.replace(/[۰-۹]/g, (d) =>
                      String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
                    );
                    if (
                      englishValue === '' ||
                      (parseInt(englishValue) <= 31 && englishValue.length <= 2)
                    ) {
                      setPersianDay(englishValue || '01');
                    }
                  }}
                  className='w-full text-center p-3 mt-8 mb-8 rounded-lg bg-[#0f2439] 
                     border border-blue-400/30 focus:outline-none focus:ring-2'
                  placeholder='روز'
                  dir='ltr'
                  style={{
                    textAlign: 'center',
                    direction: 'ltr',
                    unicodeBidi: 'plaintext',
                  }}
                />
                <button
                  onClick={() => decrementValue('day')}
                  className='absolute bottom-0 right-0 w-full h-8 flex items-center justify-center 
                     text-blue-200 hover:text-white hover:bg-blue-500/20 rounded-b-lg'
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode='wait'>
          <motion.div
            key={flashTrigger}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className='p-6 bg-[#16314c]/80 rounded-lg mt-6 border border-blue-400/10 shadow-lg text-right'
          >
            <h2 className='text-xl font-semibold mb-2'>:نتیجه تبدیل</h2>
            {direction === 'g2p' &&
            conversionResult &&
            typeof conversionResult.jm !== 'undefined' ? (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                dir='rtl'
              >
                <div className='flex flex-col gap-2'>
                  <p className='text-lg text-blue-200'>تاریخ خورشیدی :</p>
                  <p className='text-xl font-bold pr-4'>
                    {formatDate(conversionResult, 'persian')}
                  </p>
                </div>
                {eraResults && (
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>:سال‌های مختلف</h3>
                    <ul className='mt-2 space-y-1'>
                      {Object.entries(eraResults).map(([era, value], index) => (
                        <motion.li
                          key={era}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className='flex justify-between items-center'
                        >
                          <span className='text-gray-300'>{era}</span>
                          <span className='font-bold text-xl'>
                            {toPersianNum(value)}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : direction === 'p2g' &&
              conversionResult &&
              typeof conversionResult.gm !== 'undefined' ? (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
                dir='rtl'
              >
                <div className='flex flex-col gap-2'>
                  <p className='text-lg text-blue-200'>تاریخ میلادی :</p>
                  <p className='text-xl font-bold pr-4'>
                    {formatDate(conversionResult, 'gregorian')}
                  </p>
                </div>
                {eraResults && (
                  <div className='mt-4'>
                    <h3 className='text-lg font-semibold'>:سال‌های مختلف</h3>
                    <ul className='mt-2 space-y-1'>
                      {Object.entries(eraResults).map(([era, value], index) => (
                        <motion.li
                          key={era}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className='flex justify-between items-center'
                        >
                          <span className='text-gray-300'>{era}</span>
                          <span className='font-bold text-xl'>
                            {toPersianNum(value)}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className='text-lg'>ورودی نامعتبر</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
      <VirtualKeyboard
        isOpen={showVirtualKeyboard}
        onClose={() => {
          setShowVirtualKeyboard(false);
          setActiveInput(null);
        }}
        onConfirm={(value) => {
          if (activeInput === 'persian') {
            setPersianYear(value);
          } else if (activeInput === 'gregorian') {
            setGregYear(value);
            updateGregDate(gregDay, gregMonth, value);
          }
        }}
        initialValue={activeInput === 'persian' ? persianYear : gregYear}
        direction={direction}
      />
    </div>
  );
};

export default DateConverter;

function setManualGregDate(arg0: string) {
  throw new Error('Function not implemented.');
}
