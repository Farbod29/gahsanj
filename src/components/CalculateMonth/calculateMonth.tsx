import React, { useState, useEffect } from 'react';
import jalaali from 'jalaali-js';

const persianWeekdays: Record<string, string> = {
  Saturday: 'شنبه',
  Sunday: 'یک‌شنبه',
  Monday: 'دوشنبه',
  Tuesday: 'سه‌شنبه',
  Wednesday: 'چهارشنبه',
  Thursday: 'پنج‌شنبه',
  Friday: 'جمعه',
};

const jalaaliMonths: string[] = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'امرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

type WeekdayKey = keyof typeof persianWeekdays;

interface Dates {
  monthName: string;
  weekday: string;
}

interface CalculateMonthProps {
  onDatesChange: (dates: Dates) => void;
}

const CalculateMonth: React.FC<CalculateMonthProps> = ({ onDatesChange }) => {
  useEffect(() => {
    const today = new Date();
    const { jm } = jalaali.toJalaali(today);
    const weekdayKey: WeekdayKey = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
    }) as WeekdayKey;
    const weekday = persianWeekdays[weekdayKey];
    const updatedDates = {
      monthName: jalaaliMonths[jm - 1],
      weekday,
    };

    // Pass the updated dates to the parent component
    onDatesChange(updatedDates);
  }, [onDatesChange]);

  return null; // Since this component doesn't render anything visible
};

export default CalculateMonth;
