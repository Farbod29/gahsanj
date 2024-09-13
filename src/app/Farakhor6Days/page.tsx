'use client';

import React, { useState, useEffect, useMemo } from 'react';
import jalaali from 'jalaali-js';
import Image from 'next/image';

interface Occasion {
  RefLink: string;
  DayNumber: number;
  PersianDayNumber: number;
  Georgian: string;
  GeorgianK: string;
  Month: string;
  EventTitle: string;
  ShortTitle: string;
  ModalStatus: boolean;
  Text: string;
  LogoLink: string;
  ModalImageLink: string;
  importantDay: boolean;
  PersianDayNumberK: number;
  PersianMonthNumberK: number;
}

// Helper to format the Georgian Date
const formatGeorgianDate = (dateString: string) => {
  const [day, month] = dateString.split(',');
  const months = [
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
  return `${day} ${months[parseInt(month, 10) - 1]}`;
};

const Occasions6Days: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(
    jalaali.toJalaali(new Date()).jy
  );
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<Occasion | null>(null);

  const today = new Date();
  const jToday = jalaali.toJalaali(today);
  const todayPersianDayNumber = jToday.jd;
  const todayPersianMonth = jToday.jm;

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

  const getPersianMonthName = () => {
    const today = new Date();
    const persianDate = jalaali.toJalaali(today);
    const persianMonthNumber = persianDate.jm;
    const persianMonths = [
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
    return persianMonths[persianMonthNumber - 1];
  };

  const fetchOccasions = async () => {
    setLoading(true);
    try {
      const currentMonth = getPersianMonthName();
      const response = await fetch(`/api/farakhor6Days/${currentMonth}`);
      const data: Occasion[] = await response.json();
      setCurrentMonthEvents(data);
    } catch (error) {
      console.error('Error fetching occasions:', error);
      setCurrentMonthEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccasions();
  }, []);

  const handleDayClick = (occasion: Occasion) => {
    if (occasion.ModalStatus) {
      setModalContent(occasion);
      setModalVisible(true);
    }
  };

  const toPersianNum = (num: number | string) => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return num
      .toString()
      .split('')
      .map((digit) => persianNumbers[+digit] || digit)
      .join('');
  };

  return <div></div>;
};

export default Occasions6Days;