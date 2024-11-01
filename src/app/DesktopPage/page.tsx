'use client';

import { useState, useEffect } from 'react';

const Clocks = () => {
  const [localTime, setLocalTime] = useState<Date | null>(null);
  const [internationalTime, setInternationalTime] = useState<Date | null>(null);
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Tehran');

  // Delay rendering until after the component mounts
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(now);
      const intlTime = new Date(
        now.toLocaleString('en-US', { timeZone: selectedTimezone })
      );
      setInternationalTime(intlTime);
    };

    updateTime(); // Set initial time
    const timer = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(timer);
  }, [selectedTimezone]);

  if (!localTime || !internationalTime) return null; // Return null until component mounts

  const getRotation = (date, unit) => {
    switch (unit) {
      case 'hours':
        return (date.getHours() % 12) * 30 + date.getMinutes() * 0.5;
      case 'minutes':
        return date.getMinutes() * 6;
      case 'seconds':
        return date.getSeconds() * 6;
      default:
        return 0;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '40px',
        backgroundColor: '#1a2b4c',
        height: '100vh',
        color: 'white',
      }}
    >
      {/* Local Time Clock */}
      <div
        style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          border: '2px solid #3a3f5c',
          borderRadius: '50%',
          backgroundColor: '#33456b',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage:
            'url("https://gahshomar.com/wp-content/uploads/2024/08/background-clockface-darkmode-01.svg")',
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            width: '4px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(localTime, 'hours')}deg)`,
            borderRadius: '2px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            width: '3px',
            height: '65px',
            backgroundColor: '#ffffff',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(localTime, 'minutes')}deg)`,
            borderRadius: '2px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            width: '2px',
            height: '70px',
            backgroundColor: '#ff4b4b',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(localTime, 'seconds')}deg)`,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: "'Digi Hamishe', sans-serif",
            fontSize: '0.9em',
          }}
        >
          {localTime.toLocaleTimeString()}
        </div>
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: '#3a3f5c',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}
        />
      </div>

      {/* International Time Clock */}
      <div
        style={{
          position: 'relative',
          width: '150px',
          height: '150px',
          border: '2px solid #3a3f5c',
          borderRadius: '50%',
          backgroundColor: '#33456b',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage:
            'url("https://gahshomar.com/wp-content/uploads/2024/08/background-clockface-darkmode-01.svg")',
          backgroundSize: 'cover',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '29px',
            color: '#ffffff',
            fontFamily: "'Digi Hamishe', sans-serif",
            fontSize: '1em',
          }}
        >
          {selectedTimezone === 'Asia/Tehran'
            ? 'ایران: تهران'
            : selectedTimezone}
        </div>
        <div
          style={{
            width: '4px',
            height: '50px',
            backgroundColor: '#e0e0e0',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(internationalTime, 'hours')}deg)`,
            borderRadius: '2px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            width: '3px',
            height: '65px',
            backgroundColor: '#ffffff',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(internationalTime, 'minutes')}deg)`,
            borderRadius: '2px',
            zIndex: 2,
          }}
        />
        <div
          style={{
            width: '2px',
            height: '70px',
            backgroundColor: '#ff4b4b',
            position: 'absolute',
            bottom: '50%',
            transformOrigin: 'bottom',
            transform: `rotate(${getRotation(internationalTime, 'seconds')}deg)`,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            width: '100%',
            textAlign: 'center',
            color: '#ffffff',
            fontFamily: "'Digi Hamishe', sans-serif",
            fontSize: '0.9em',
          }}
        >
          {internationalTime.toLocaleTimeString()}
        </div>
        <select
          value={selectedTimezone}
          onChange={(e) => setSelectedTimezone(e.target.value)}
          style={{
            position: 'absolute',
            bottom: '-45px',
            fontFamily: "'Digi Hamishe', sans-serif",
            fontSize: '0.9em',
            backgroundColor: '#33456b',
            color: '#ffffff',
            padding: '5px 10px',
            border: '1px solid #3a3f5c',
            borderRadius: '10px',
            outline: 'none',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.3s ease-in-out',
          }}
        >
          <option value='Asia/Tehran'>ایران: تهران</option>
          <option value='Asia/Kabul'>افغانستان : کابل</option>
          <option value='Asia/Dushanbe'>تاجیکستان: دوشنبه</option>
          <option value='Asia/Baghdad'>عراق: بغداد</option>
          <option value='Asia/Damascus'>سوریه: دمشق</option>
          <option value='Asia/Istanbul'>ترکیه: استانبول</option>
          <option value='Asia/Amman'>اردن: عمان</option>
          <option value='Asia/Riyadh'>عربستان سعودی: ریاض</option>
          <option value='Asia/Dubai'>امارات متحده عربی: دبی</option>
          <option value='Asia/Beirut'>لبنان: بیروت</option>
          <option value='Asia/Baku'>آذربایجان: باکو</option>
          <option value='Asia/Yerevan'>ارمنستان: ایروان</option>
          <option value='Asia/Almaty'>قزاقستان: آلماتی</option>
          <option value='Asia/Tashkent'>ازبکستان: تاشکند</option>
          <option value='Asia/Ashgabat'>ترکمنستان: عشق‌آباد</option>
          <option value='Asia/Karachi'>پاکستان: کراچی</option>
          <option value='Asia/Delhi'>هند: دهلی</option>
          <option value='Europe/Istanbul'>ترکیه: استانبول</option>
          <option value='Europe/Berlin'>آلمان: برلین</option>
          <option value='Europe/London'>انگلستان: لندن</option>
          <option value='Europe/Paris'>فرانسه: پاریس</option>
          <option value='Europe/Stockholm'>سوئد: استکهلم</option>
          <option value='Europe/Oslo'>نروژ: اسلو</option>
          <option value='Europe/Amsterdam'>هلند: آمستردام</option>
          <option value='Europe/Vienna'>اتریش: وین</option>
          <option value='Europe/Moscow'>روسیه: مسکو</option>
          <option value='America/New_York'>ایالات متحده: نیویورک</option>
          <option value='America/Los_Angeles'>ایالات متحده: لس‌آنجلس</option>
          <option value='America/Toronto'>کانادا: تورنتو</option>
          <option value='America/Vancouver'>کانادا: ونکوور</option>
        </select>
        <div
          style={{
            position: 'absolute',
            width: '8px',
            height: '8px',
            backgroundColor: '#3a3f5c',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}
        />
      </div>
    </div>
  );
};

export default Clocks;
