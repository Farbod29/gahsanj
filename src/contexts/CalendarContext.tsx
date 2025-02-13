'use client';

import React, { createContext, useContext, useState } from 'react';
import jalaali from 'jalaali-js';

interface CalendarContextType {
  currentMonth: number;
  currentYear: number;
  setCurrentPersianMonth: (month: number) => void;
  setCurrentYear: (year: number) => void;
  setCurrentDisplayYear: (year: number) => void;
  setTodayPersianMonth: (month: number) => void;
  setTodayPersianDayNumber: (day: number) => void;
  handleMonthChange: (increment: number) => void;
  resetToToday: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [currentMonth, setCurrentMonth] = useState(
    jalaali.toJalaali(new Date()).jm
  );
  const [currentYear, setCurrentYear] = useState(
    jalaali.toJalaali(new Date()).jy
  );
  const [currentDisplayYear, setCurrentDisplayYear] = useState(currentYear);
  const [todayPersianMonth, setTodayPersianMonth] = useState(currentMonth);
  const [todayPersianDayNumber, setTodayPersianDayNumber] = useState(
    jalaali.toJalaali(new Date()).jd
  );

  const handleMonthChange = (increment: number) => {
    let newMonth = currentMonth;
    let newYear = currentYear;

    if (increment > 0) {
      if (newMonth === 12) {
        newMonth = 1;
        newYear++;
      } else {
        newMonth++;
      }
    } else {
      if (newMonth === 1) {
        newMonth = 12;
        newYear--;
      } else {
        newMonth--;
      }
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const resetToToday = () => {
    const today = new Date();
    const jToday = jalaali.toJalaali(today);
    setCurrentMonth(jToday.jm);
    setCurrentYear(jToday.jy);
  };

  return (
    <CalendarContext.Provider
      value={{
        currentMonth,
        currentYear,
        handleMonthChange,
        resetToToday,
        setCurrentYear,
        setCurrentDisplayYear,
        setCurrentPersianMonth: setCurrentMonth,
        setTodayPersianMonth,
        setTodayPersianDayNumber,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (undefined === context) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
