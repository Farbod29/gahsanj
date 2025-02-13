'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NewOccasion {
  ShortTitle: string;
  EventTitle: string;
  Month: string;
  PersianDayNumber: number;
  Georgian: string;
  GeorgianK: string;
  ModalImageLink: string;
  LogoLink: string;
  Text: string;
  RefLink: string;
  importantDay: boolean;
  ModalStatus: boolean;
}

export default function AddOccasion() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [occasion, setOccasion] = useState<NewOccasion>({
    ShortTitle: '',
    EventTitle: '',
    Month: '',
    PersianDayNumber: 1,
    Georgian: '',
    GeorgianK: '',
    ModalImageLink: '',
    LogoLink: '',
    Text: '',
    RefLink: '',
    importantDay: false,
    ModalStatus: true,
  });
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [isDraggingMedal, setIsDraggingMedal] = useState(false);

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
    setOccasion((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
            ? Number(value)
            : value,
    }));
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

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-xl font-bold mb-6 text-right'>افزودن مناسبت</h2>
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
            <label className='block mb-2 text-right'>روز</label>
            <input
              type='number'
              name='PersianDayNumber'
              value={occasion.PersianDayNumber}
              onChange={handleChange}
              min='1'
              max='31'
              className='w-full p-2 border rounded'
              placeholder='مثال: 1'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>تاریخ میلادی</label>
            <input
              type='text'
              name='Georgian'
              value={occasion.Georgian}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: 21,03'
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>تاریخ میلادی کبیسه</label>
            <input
              type='text'
              name='GeorgianK'
              value={occasion.GeorgianK}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: 20,03'
            />
          </div>

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
