'use client';
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import jalaali from 'jalaali-js';

// Add reference year constant
const REFERENCE_YEAR = 2024; // Using 2024 as the reference year for consistent date calculations

interface NewOccasion {
  ShortTitle: string;
  EventTitle: string;
  Month: string;
  PersianDayNumber: number;
  PersianDayNumberK?: number;
  Georgian: string;
  GeorgianK: string;
  ModalImageLink: string;
  LogoLink: string;
  Text: string;
  RefLink: string;
  importantDay: boolean;
  ModalStatus: boolean;
  globalDay: boolean;
}

export default function AddOccasion() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [occasion, setOccasion] = useState<NewOccasion>({
    ShortTitle: '',
    EventTitle: '',
    Month: '',
    PersianDayNumber: 1,
    PersianDayNumberK: 1,
    Georgian: '',
    GeorgianK: '',
    ModalImageLink: '',
    LogoLink: '',
    Text: '',
    RefLink: '',
    importantDay: false,
    ModalStatus: true,
    globalDay: false,
  });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingMedal, setIsDraggingMedal] = useState(false);
  const [displayDates, setDisplayDates] = useState({
    persianToGregorian: '',
    leapYearDate: '',
  });

  const months = [
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

  const uploadFile = useCallback(async (file: File, type: 'logo' | 'medal') => {
    if (!file) return;

    // Size limits
    const maxLogoSize = 110 * 1024; // 100KB for logos
    const maxMedalSize = 300 * 1024; // 200KB for medals

    if (type === 'logo' && file.size > maxLogoSize) {
      alert('حجم لوگو نباید بیشتر از ۱۰۰ کیلوبایت باشد');
      return;
    }

    if (type === 'medal' && file.size > maxMedalSize) {
      alert(
        'حجم تصویر مدال نباید بیشتر از ۲۰۰ کیلوبایت باشد. لطفاً به این وب‌سایت بروید تا آن را کاهش دهید: https://imagecompressor.com/'
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error details:', error);
      alert(
        'خطا در آپلود تصویر: ' +
          (error instanceof Error ? error.message : 'خطای ناشناخته')
      );
      return null;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await fetch('/api/occasions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...occasion,
          LogoLink: logoUrl,
          ModalImageLink: imageUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to add occasion');
      router.push('/dashboard');
    } catch (error) {
      alert('خطا در ذخیره مناسبت');
      setSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setOccasion((prev) => {
      const newOccasion = {
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : type === 'number'
              ? Number(value)
              : value,
      };

      // Clear related fields when a value is cleared
      if (value === '') {
        if (name === 'Month') {
          newOccasion.PersianDayNumber = 0;
          newOccasion.PersianDayNumberK = 0;
          newOccasion.Georgian = '';
          newOccasion.GeorgianK = '';
        } else if (name === 'PersianDayNumber') {
          newOccasion.Georgian = '';
          newOccasion.GeorgianK = '';
        } else if (name === 'Georgian') {
          if (newOccasion.globalDay) {
            newOccasion.PersianDayNumber = 0;
            newOccasion.PersianDayNumberK = 0;
          }
        }
      }

      return newOccasion;
    });
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, type: 'logo' | 'medal') => {
      e.preventDefault();
      e.stopPropagation();

      type === 'logo' ? setIsDraggingLogo(false) : setIsDraggingMedal(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        const url = await uploadFile(file, type);
        if (url) {
          type === 'logo' ? setLogoUrl(url) : setImageUrl(url);
        }
      }
    },
    [uploadFile]
  );

  const handleGlobalDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isGlobal = e.target.checked;
    setOccasion((prev) => {
      if (isGlobal) {
        // For global days, Georgian dates remain the same
        if (!prev.Georgian || !prev.Georgian.includes(',')) {
          return {
            ...prev,
            globalDay: isGlobal,
            PersianDayNumber: 0,
            PersianDayNumberK: 0,
            Georgian: '',
            GeorgianK: '',
          };
        }

        const [day, month] = prev.Georgian.split(',').map(Number);
        if (
          isNaN(day) ||
          isNaN(month) ||
          month < 1 ||
          month > 12 ||
          day < 1 ||
          day > 31
        ) {
          return {
            ...prev,
            globalDay: isGlobal,
            PersianDayNumber: 0,
            PersianDayNumberK: 0,
            Georgian: '',
            GeorgianK: '',
          };
        }

        try {
          const { jy, jm, jd } = jalaali.toJalaali(
            REFERENCE_YEAR, // Use reference year instead of current year
            month,
            day
          );

          return {
            ...prev,
            globalDay: isGlobal,
            PersianDayNumber: jd,
            PersianDayNumberK: jd + 1, // In leap years, Persian date is one day more
            GeorgianK: prev.Georgian, // Georgian dates stay the same for global days
          };
        } catch (error) {
          console.error('Error converting date:', error);
          return {
            ...prev,
            globalDay: isGlobal,
            PersianDayNumber: 0,
            PersianDayNumberK: 0,
            Georgian: '',
            GeorgianK: '',
          };
        }
      } else {
        // For Persian days, Persian dates remain the same
        if (!prev.Month || !prev.PersianDayNumber) {
          return {
            ...prev,
            globalDay: isGlobal,
            Georgian: '',
            GeorgianK: '',
          };
        }

        try {
          const monthIndex = months.indexOf(prev.Month) + 1;
          const { gy, gm, gd } = jalaali.toGregorian(
            REFERENCE_YEAR, // Use reference year instead of current year
            monthIndex,
            prev.PersianDayNumber
          );

          const georgianDate = `${gd},${String(gm).padStart(2, '0')}`;
          const georgianKDate = `${gd - 1},${String(gm).padStart(2, '0')}`;

          return {
            ...prev,
            globalDay: isGlobal,
            Georgian: georgianDate,
            GeorgianK: georgianKDate,
            PersianDayNumberK: prev.PersianDayNumber, // Persian dates stay the same for Persian days
          };
        } catch (error) {
          console.error('Error converting date:', error);
          return {
            ...prev,
            globalDay: isGlobal,
            Georgian: '',
            GeorgianK: '',
          };
        }
      }
    });
  };

  const decrementGeorgianDate = (georgianDate: string) => {
    const [day, month] = georgianDate.split(',').map(Number);
    if (day === 1) {
      // Handle January to December transition
      if (month === 1) {
        return `31,12`; // December 31st
      }
      // For other months, get the last day of the previous month
      const prevMonth = month - 1;
      return `${getDaysInMonth(prevMonth)},${String(prevMonth).padStart(2, '0')}`;
    }
    return `${day - 1},${String(month).padStart(2, '0')}`;
  };

  const getDaysInMonth = (month: number) => {
    // Handle February specially for leap years
    if (month === 2) {
      // We use our reference year which is 2024 (a leap year)
      return 29;
    }
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    return daysInMonth[month - 1] || 31;
  };

  const handlePersianDayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!value || isNaN(value)) return;

    setOccasion((prev) => {
      if (prev.globalDay) {
        // For global days, Persian leap year is one more than normal
        return {
          ...prev,
          PersianDayNumber: value,
          PersianDayNumberK: value + 1,
        };
      } else {
        // For Persian days, both dates should be the same
        return {
          ...prev,
          PersianDayNumber: value,
          PersianDayNumberK: value,
        };
      }
    });
  };

  const handlePersianDayKBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!value || isNaN(value)) return;

    setOccasion((prev) => {
      if (prev.globalDay) {
        // For global days, normal Persian day is one less than leap year
        return {
          ...prev,
          PersianDayNumber: value - 1,
          PersianDayNumberK: value,
        };
      } else {
        // For Persian days, both dates should be the same
        return {
          ...prev,
          PersianDayNumber: value,
          PersianDayNumberK: value,
        };
      }
    });
  };

  const handleGeorgianBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;

    setOccasion((prev) => {
      if (prev.globalDay) {
        // For global days, both Georgian dates should be the same
        return {
          ...prev,
          Georgian: value,
          GeorgianK: value,
        };
      } else {
        // For Persian days, leap year date should be one less
        return {
          ...prev,
          Georgian: value,
          GeorgianK: decrementGeorgianDate(value),
        };
      }
    });
  };

  const handleGeorgianKBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) return;

    setOccasion((prev) => {
      if (prev.globalDay) {
        // For global days, both Georgian dates should be the same
        return {
          ...prev,
          Georgian: value,
          GeorgianK: value,
        };
      } else {
        // For Persian days, non-leap year date should be one more
        const [day, month] = value.split(',').map(Number);

        // Handle December 31st to January 1st transition
        let nextDay = day === getDaysInMonth(month) ? 1 : day + 1;
        let nextMonth =
          day === getDaysInMonth(month)
            ? month === 12
              ? 1 // If December 31st, go to January
              : month + 1
            : month;

        const incrementedDate = `${nextDay},${String(nextMonth).padStart(2, '0')}`;

        return {
          ...prev,
          Georgian: incrementedDate,
          GeorgianK: value,
        };
      }
    });
  };

  const updateDateDisplay = useCallback(() => {
    if (!occasion.Month || !occasion.PersianDayNumber) {
      setDisplayDates({
        persianToGregorian: '',
        leapYearDate: '',
      });
      return;
    }

    const monthIndex = months.indexOf(occasion.Month) + 1;
    const { gy, gm, gd } = jalaali.toGregorian(
      REFERENCE_YEAR, // Use reference year instead of current year
      monthIndex,
      occasion.PersianDayNumber
    );

    const georgianMonths = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    setDisplayDates({
      persianToGregorian: `${occasion.Month} ${occasion.PersianDayNumber} → ${gd} ${georgianMonths[gm - 1]}`,
      leapYearDate:
        occasion.PersianDayNumberK && occasion.GeorgianK
          ? `${occasion.Month} ${occasion.PersianDayNumberK} → ${occasion.GeorgianK.split(',')[0]} ${georgianMonths[Number(occasion.GeorgianK.split(',')[1]) - 1]}`
          : '',
    });
  }, [
    occasion.Month,
    occasion.PersianDayNumber,
    occasion.PersianDayNumberK,
    occasion.GeorgianK,
  ]);

  useEffect(() => {
    updateDateDisplay();
  }, [updateDateDisplay]);

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <div className='flex justify-between items-center mb-6'>
        <button
          onClick={() => setShowHelpModal(true)}
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          راهنما
        </button>
        <h2 className='text-xl font-bold text-right'>افزودن مناسبت/ فراخور</h2>
      </div>

      {showHelpModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center'>
          <div className='bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold'>راهنمای تقویم کبیسه</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className='text-gray-500 hover:text-gray-700'
              >
                ✕
              </button>
            </div>
            <div className='space-y-4'>
              <div className='overflow-x-auto'>
                <table className='min-w-full border border-gray-200 mb-4'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-2 border text-right'>مناسبت</th>
                      <th className='px-4 py-2 border text-right'>
                        به سال میلادی
                      </th>
                      <th className='px-4 py-2 border text-right'>
                        به سال میلادی کبیسه
                      </th>
                      <th className='px-4 py-2 border text-right'>
                        به سال شمسی
                      </th>
                      <th className='px-4 py-2 border text-right'>
                        به سال شمسی کبیسه
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='px-4 py-2 border'>نوروز (مناسبت شمسی)</td>
                      <td className='px-4 py-2 border'>۲۱ مارس</td>
                      <td className='px-4 py-2 border'>۲۰ مارس</td>
                      <td className='px-4 py-2 border'>۱ فروردین</td>
                      <td className='px-4 py-2 border'>۱ فروردین</td>
                    </tr>
                    <tr>
                      <td className='px-4 py-2 border'>
                        هالووین (مناسبت جهانی)
                      </td>
                      <td className='px-4 py-2 border'>۳۱ اکتبر</td>
                      <td className='px-4 py-2 border'>۳۱ اکتبر</td>
                      <td className='px-4 py-2 border'>۸ آبان</td>
                      <td className='px-4 py-2 border'>۹ آبان</td>
                    </tr>
                    <tr>
                      <td className='px-4 py-2 border'>روز جهانی دوستی</td>
                      <td className='px-4 py-2 border'>۳۰ ژوئیه</td>
                      <td className='px-4 py-2 border'>۳۰ ژوئیه</td>
                      <td className='px-4 py-2 border'>۸ امرداد</td>
                      <td className='px-4 py-2 border'>۹ امرداد</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className='space-y-2 text-right text-gray-700'>
                <p>
                  🔹 در سال‌های کبیسه شمسی، مناسبت‌های جهانی یک روز جلوتر در
                  تقویم شمسی می‌افتند.
                </p>
                <p>🔹 در سال‌های غیر کبیسه شمسی، تاریخ‌شان ثابت می‌ماند.</p>
                <p>
                  🔹 اگر مناسبت مبتنی بر تقویم فارسی است، عدد شمسی تغییر نمی‌کند
                  اما معادل میلادی آن در سال کبیسه یک روز تغییر می‌کند.
                </p>
                <p>
                  🔹 اگر مناسبت مبتنی بر تقویم میلادی است، عدد میلادی تغییر
                  نمی‌کند اما معادل شمسی آن در سال کبیسه یک روز تغییر می‌کند.
                </p>
                <p>
                  🔹 برای مناسبت‌های بین‌المللی و جهانی، همیشه معادل شمسی باید
                  بررسی و اصلاح شود تا از تغییرات ناشی از کبیسه بودن سال جلوگیری
                  شود.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className='bg-gray-100 p-4 rounded-lg mb-6 text-gray-700 text-right'>
        اگر آن روز یک روز جهانی است، مقدار آن در تقویم فارسی کبیسه باید با مقدار
        آن در تقویم فارسی غیر کبیسه متفاوت باشد. همچنین، اگر روز مربوط به تغییر
        در تقویم پارسی است، مقدار آن در سال‌های کبیسه باید در تقویم میلادی یا
        لاتین با مقدار آن در سال‌های غیر کبیسه متفاوت باشد. ابتدا این روز را
        بررسی کنید، سپس اقدام به ویرایش یا افزودن آن نمایید.
      </div>

      <div className='bg-white p-4 rounded-lg mb-6 shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='min-w-full border border-gray-200 mb-4'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 border text-right'>مناسبت</th>
                <th className='px-4 py-2 border text-right'>به سال میلادی</th>
                <th className='px-4 py-2 border text-right'>
                  به سال میلادی کبیسه
                </th>
                <th className='px-4 py-2 border text-right'>به سال شمسی</th>
                <th className='px-4 py-2 border text-right'>
                  به سال شمسی کبیسه
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='px-4 py-2 border'>نوروز (مناسبت شمسی)</td>
                <td className='px-4 py-2 border'>۲۱ مارس</td>
                <td className='px-4 py-2 border'>۲۰ مارس</td>
                <td className='px-4 py-2 border'>۱ فروردین</td>
                <td className='px-4 py-2 border'>۱ فروردین</td>
              </tr>
              <tr>
                <td className='px-4 py-2 border'>هالووین (مناسبت میلادی)</td>
                <td className='px-4 py-2 border'>۳۱ اکتبر</td>
                <td className='px-4 py-2 border'>۳۱ اکتبر</td>
                <td className='px-4 py-2 border'>۸ آبان</td>
                <td className='px-4 py-2 border'>۹ آبان</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='space-y-2 text-right text-gray-700'>
          <p>
            ✅ نوروز در سال‌های کبیسه شمسی، معادل میلادی‌اش یک روز عقب‌تر
            می‌آید.
          </p>
          <p>
            ✅ هالووین که یک مناسبت میلادی است، در سال‌های کبیسه میلادی، معادل
            شمسی‌اش یک روز جلوتر می‌آید.
          </p>
          <div className='mt-4'>
            <p>
              🔹 اگر مناسبت مبتنی بر تقویم فارسی است، عدد شمسی تغییر نمی‌کند اما
              معادل میلادی آن در سال کبیسه یک روز تغییر می‌کند.
            </p>
            <p>
              🔹 اگر مناسبت مبتنی بر تقویم میلادی است، عدد میلادی تغییر نمی‌کند
              اما معادل شمسی آن در سال کبیسه یک روز تغییر می‌کند.
            </p>
            <p>
              🔹 برای مناسبت‌های بین‌المللی و جهانی، همیشه معادل شمسی باید بررسی
              و اصلاح شود تا از تغییرات ناشی از کبیسه بودن سال جلوگیری شود.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2 text-right'>عنوان کوتاه</label>
            <input
              type='text'
              name='ShortTitle'
              value={occasion.ShortTitle}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: جشن نوروز'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>عنوان کامل</label>
            <input
              type='text'
              name='EventTitle'
              value={occasion.EventTitle}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: جشن نوروز'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>ماه</label>
            <select
              name='Month'
              value={occasion.Month}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>انتخاب ماه</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className='block mb-2 text-right'>نوع روز</label>
            <div className='flex items-center justify-end gap-2'>
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  name='globalDay'
                  checked={occasion.globalDay}
                  onChange={handleGlobalDayChange}
                  className='ml-2'
                />
                روز جهانی
              </label>
            </div>
          </div>

          <div className='col-span-2 mt-8'>
            <h3 className='font-bold text-lg text-gray-800 text-right mb-6'>
              روز خورشیدی:
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block mb-2 text-right' title='روز خورشیدی'>
                  روز خورشیدی
                </label>
                <input
                  type='text'
                  name='PersianDayNumber'
                  value={occasion.PersianDayNumber || ''}
                  onChange={handleChange}
                  onBlur={handlePersianDayBlur}
                  className='w-full p-2 border rounded'
                  placeholder='مثال: 1'
                  required
                  disabled={occasion.globalDay}
                />
              </div>
              <div>
                <label
                  className='block mb-2 text-right'
                  title='روز خورشیدی کبیسه'
                >
                  روز خورشیدی کبیسه
                </label>
                <input
                  type='text'
                  name='PersianDayNumberK'
                  value={occasion.PersianDayNumberK || ''}
                  onChange={handleChange}
                  onBlur={handlePersianDayKBlur}
                  className='w-full p-2 border rounded'
                  placeholder='مثال: 1'
                  disabled={!occasion.globalDay}
                />
              </div>
            </div>
          </div>

          <div className='col-span-2 mt-8'>
            <h3 className='font-bold text-lg text-gray-800 text-right mb-6'>
              روز میلادی:
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block mb-2 text-right'>تاریخ میلادی</label>
                <input
                  type='text'
                  name='Georgian'
                  value={occasion.Georgian}
                  onChange={handleChange}
                  onBlur={handleGeorgianBlur}
                  className='w-full p-2 border rounded'
                  placeholder='مثال: 21,03'
                  pattern='\d{1,2},\d{1,2}'
                  title='لطفاً تاریخ را به فرمت روز,ماه وارد کنید. مثال: 21,03'
                  disabled={!occasion.globalDay}
                />
              </div>
              <div>
                <label className='block mb-2 text-right'>
                  تاریخ میلادی کبیسه
                </label>
                <input
                  type='text'
                  name='GeorgianK'
                  value={occasion.GeorgianK}
                  onChange={handleChange}
                  onBlur={handleGeorgianKBlur}
                  className='w-full p-2 border rounded'
                  placeholder='مثال: 20,03'
                  pattern='\d{1,2},\d{1,2}'
                  title='لطفاً تاریخ را به فرمت روز,ماه وارد کنید. مثال: 20,03'
                  disabled={occasion.globalDay}
                />
              </div>
            </div>
          </div>

          <div className='col-span-2 bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4 mb-4'>
            <h3 className='font-bold text-lg text-blue-800 text-right mb-4'>
              تبدیل تاریخ:
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-blue-700 text-right mb-2'>
                  تاریخ خورشیدی به میلادی
                </label>
                <input
                  type='text'
                  value={displayDates.persianToGregorian}
                  className='w-full p-2 border rounded bg-white text-gray-500'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-blue-700 text-right mb-2'>
                  تاریخ کبیسه
                </label>
                <input
                  type='text'
                  value={displayDates.leapYearDate}
                  className='w-full p-2 border rounded bg-white text-gray-500'
                  readOnly
                />
              </div>
            </div>
          </div>

          <div className='col-span-2 mt-8'>
            <h3 className='font-bold text-lg text-gray-800 text-right mb-6'>
              تصاویر:
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm font-medium text-right mb-1'>
                  لینک لوگو
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDraggingLogo
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingLogo(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingLogo(false);
                  }}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'logo')}
                >
                  <div className='flex flex-col items-center justify-center space-y-4'>
                    <div className='text-center'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='mt-1 text-sm text-gray-600'>
                        فایل را اینجا رها کنید یا کلیک کنید
                      </p>
                      <button
                        type='button'
                        onClick={() =>
                          document.getElementById('logo-upload')?.click()
                        }
                        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                      >
                        بارگذاری
                      </button>
                    </div>
                    <input
                      id='logo-upload'
                      type='file'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          uploadFile(file, 'logo').then((url) => {
                            if (url) setLogoUrl(url);
                          });
                      }}
                      accept='image/*'
                    />
                  </div>
                  {logoUrl && (
                    <div className='mt-4 flex justify-center'>
                      <Image
                        src={logoUrl}
                        alt='Logo preview'
                        width={100}
                        height={100}
                        className='rounded'
                      />
                    </div>
                  )}
                </div>
                <input
                  type='text'
                  value={logoUrl}
                  className='mt-2 w-full p-2 border rounded-md'
                  placeholder='مثال: https://gahshomar.com/wp-content/uploads/2024/09/نوروز-سنبل.webp'
                  readOnly
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-right mb-1'>
                  لینک تصویر مدال
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
                    isDraggingMedal
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingMedal(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingMedal(false);
                  }}
                  onDragOver={handleDrag}
                  onDrop={(e) => handleDrop(e, 'medal')}
                >
                  <div className='flex flex-col items-center justify-center space-y-4'>
                    <div className='text-center'>
                      <svg
                        className='mx-auto h-12 w-12 text-gray-400'
                        stroke='currentColor'
                        fill='none'
                        viewBox='0 0 48 48'
                        aria-hidden='true'
                      >
                        <path
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                          strokeWidth={2}
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <p className='mt-1 text-sm text-gray-600'>
                        فایل را اینجا رها کنید یا کلیک کنید
                      </p>
                      <button
                        type='button'
                        onClick={() =>
                          document.getElementById('medal-upload')?.click()
                        }
                        className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                      >
                        بارگذاری
                      </button>
                    </div>
                    <input
                      id='medal-upload'
                      type='file'
                      className='hidden'
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          uploadFile(file, 'medal').then((url) => {
                            if (url) setImageUrl(url);
                          });
                      }}
                      accept='image/*'
                    />
                  </div>
                  {imageUrl && (
                    <div className='mt-4 flex justify-center'>
                      <Image
                        src={imageUrl}
                        alt='Medal preview'
                        width={200}
                        height={200}
                        className='rounded'
                      />
                    </div>
                  )}
                </div>
                <input
                  type='text'
                  value={imageUrl}
                  className='mt-2 w-full p-2 border rounded-md'
                  placeholder='مثال: https://gahshomar.com/wp-content/uploads/2024/09/02-1.jpg'
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <label className='block mb-2 text-right'>متن</label>
          <textarea
            name='Text'
            value={occasion.Text}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border rounded'
            placeholder='مثال: زادروز زرتشت، پیام‌آور بزرگ ایرانی، یکی از مناسبت‌های مهم در تاریخ ایران باستان است...'
          />
        </div>

        <div>
          <label className='block mb-2 text-right'>لینک مرجع</label>
          <input
            type='url'
            name='RefLink'
            value={occasion.RefLink}
            onChange={handleChange}
            className='w-full p-2 border rounded'
            placeholder='مثال: https://fa.wikipedia.org/wiki/نوروز'
          />
        </div>

        <div className='flex gap-4 justify-end'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              name='importantDay'
              checked={occasion.importantDay}
              onChange={handleChange}
              className='ml-2'
            />
            روز مهم
          </label>

          <label className='flex items-center'>
            <input
              type='checkbox'
              name='ModalStatus'
              checked={occasion.ModalStatus}
              onChange={handleChange}
              className='ml-2'
            />
            نمایش مدال
          </label>
        </div>

        <div className='flex justify-end gap-4'>
          <button
            type='button'
            onClick={() => router.back()}
            className='px-4 py-2 border rounded hover:bg-gray-100'
          >
            انصراف
          </button>
          <button
            type='submit'
            disabled={saving}
            className='px-4 py-2 bg-[#373D70] text-white rounded hover:bg-[#4c5494] disabled:opacity-50'
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره'}
          </button>
        </div>
      </form>
    </div>
  );
}
