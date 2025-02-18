import { MongoClient } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import jalaali from 'jalaali-js'; // Persian date handling

const leapYears = [
  1403, 1407, 1411, 1415, 1419, 1423, 1427, 1431, 1435, 1439, 1443, 1447, 1451,
  1455, 1459, 1463, 1467, 1471, 1475, 1479, 1483, 1487, 1491, 1495, 1499, 1503,
  1507, 1511, 1515, 1519, 1523, 1527, 1531, 1535, 1539, 1543, 1547, 1551, 1555,
  1559, 1563, 1567, 1571, 1575, 1579, 1583, 1587, 1591, 1595, 1599,
];

export async function GET(req: NextRequest) {
  try {
    // Fetch MongoDB URI from environment
    const uri = process.env.MONGODB_URI2;

    if (!uri) {
      throw new Error('Please define the MONGODB_URI2 environment variable');
    }

    const client = new MongoClient(uri);

    // Connect to MongoDB
    await client.connect();
    const db = client.db('farakhor');
    const collection = db.collection('farakhorCollection');

    // Get the current Persian (Jalaali) date
    const currentDate = new Date();
    const currentJalaaliDate = jalaali.toJalaali(currentDate);
    const todayPersianDay = currentJalaaliDate.jd;
    const todayPersianMonth = currentJalaaliDate.jm;
    const currentYear = currentJalaaliDate.jy;

    console.log(
      `Today in Persian Calendar: Day ${todayPersianDay}, Month ${todayPersianMonth}, Year ${currentYear}`
    );

    // Check if the current year is a leap year
    const isLeapYear = leapYears.includes(currentYear);
    const dayField = isLeapYear ? 'PersianDayNumberK' : 'PersianDayNumber';
    const georgianField = isLeapYear ? 'GeorgianK' : 'Georgian';

    // Query for the current month's important events after today's day
    let currentMonthEvents = await collection
      .find({
        Month: getJalaaliMonthName(todayPersianMonth),
        importantDay: true,
        [dayField]: { $gte: todayPersianDay },
      })
      .toArray();

    // Clean the data - remove unnecessary fields
    currentMonthEvents = currentMonthEvents.map((event) => {
      const {
        PersianDayNumberK,
        PersianDayNumber,
        GeorgianK,
        Georgian,
        ...rest
      } = event;
      if (isLeapYear) {
        return { ...rest, PersianDayNumberK, GeorgianK };
      } else {
        return { ...rest, PersianDayNumber, Georgian };
      }
    });

    console.log('Important events for the current month:', currentMonthEvents);

    // Count remaining events to fetch from the next month (if necessary)
    let remainingEventsNeeded = 6 - currentMonthEvents.length;
    console.log('Remaining important days needed:', remainingEventsNeeded);

    let importantEvents = [...currentMonthEvents];

    // If fewer than 6 events, fetch from the next month
    if (remainingEventsNeeded > 0) {
      let nextMonthName;
      let nextYear = currentYear;

      // If we are in Esfand, move to Farvardin of next year
      if (todayPersianMonth === 12) {
        nextMonthName = getJalaaliMonthName(1); // Farvardin
        nextYear += 1; // Increment year to the next year
      } else {
        nextMonthName = getJalaaliMonthName(todayPersianMonth + 1);
      }

      // Check if the next year is a leap year
      const isNextYearLeap = leapYears.includes(nextYear);
      const nextDayField = isNextYearLeap
        ? 'PersianDayNumberK'
        : 'PersianDayNumber';
      const nextGeorgianField = isNextYearLeap ? 'GeorgianK' : 'Georgian';

      // Fetch next month events
      let nextMonthEvents = await collection
        .find({
          Month: nextMonthName,
          importantDay: true,
        })
        .toArray();

      // Clean the data for the next month
      nextMonthEvents = nextMonthEvents.map((event) => {
        const {
          PersianDayNumberK,
          PersianDayNumber,
          GeorgianK,
          Georgian,
          ...rest
        } = event;
        if (isNextYearLeap) {
          return { ...rest, PersianDayNumberK, GeorgianK };
        } else {
          return { ...rest, PersianDayNumber, Georgian };
        }
      });

      // Combine current and next month events
      importantEvents = [...importantEvents, ...nextMonthEvents];
    }

    // Sort events by the Persian day number for both current and next month events
    importantEvents.sort(
      (a, b) =>
        (a.PersianDayNumber || a.PersianDayNumberK) -
        (b.PersianDayNumber || b.PersianDayNumberK)
    );

    // Slice to only keep the next 6 upcoming events
    importantEvents = importantEvents.slice(0, 6);

    console.log('Final important events:', importantEvents);

    return NextResponse.json(importantEvents);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Helper function to get the Persian month name
function getJalaaliMonthName(monthIndex: number) {
  const monthNames = [
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
  return monthNames[(monthIndex - 1) % 12]; // Month index is 1-based
}
