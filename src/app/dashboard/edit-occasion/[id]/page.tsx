'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import LogoImage from '@/components/LogoImage';
import Image from 'next/image';

interface Occasion {
  _id: string;
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

export default function EditOccasion() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [occasion, setOccasion] = useState<Occasion | null>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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

  useEffect(() => {
    fetchOccasion();
  }, [id]);

  const fetchOccasion = async () => {
    try {
      const response = await fetch(`/api/occasions/${id}`);
      if (!response.ok) throw new Error('Failed to fetch occasion');
      const data = await response.json();
      setOccasion(data);
      setLogoUrl(data.LogoLink);
      setImageUrl(data.ModalImageLink);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasion) return;

    try {
      setSaving(true);
      const response = await fetch(`/api/occasions?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(occasion),
      });

      if (!response.ok) throw new Error('Failed to update occasion');
      router.push('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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
      if (!prev) return prev;
      return {
        ...prev,
        [name]:
          type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : type === 'number'
              ? Number(value)
              : value,
      };
    });
  };

  const uploadFile = useCallback(async (file: File, type: 'logo' | 'medal') => {
    if (!file) return;

    // Check file size for medal images (200KB = 200 * 1024 bytes)
    if (type === 'medal' && file.size > 200 * 1024) {
      alert('حجم تصویر مدال نباید بیشتر از ۲۰۰ کیلوبایت باشد');
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

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
        {error}
      </div>
    );
  }

  if (!occasion) {
    return <div>مناسبت یافت نشد</div>;
  }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-xl font-bold mb-6 text-right'>ویرایش مناسبت</h2>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className='block mb-2'>عنوان کوتاه</label>
            <input
              type='text'
              name='ShortTitle'
              value={occasion.ShortTitle}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>عنوان کامل</label>
            <input
              type='text'
              name='EventTitle'
              value={occasion.EventTitle}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>ماه</label>
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
            <label className='block mb-2'>روز</label>
            <input
              type='number'
              name='PersianDayNumber'
              value={occasion.PersianDayNumber}
              onChange={handleChange}
              min='1'
              max='31'
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>تاریخ میلادی</label>
            <input
              type='text'
              name='Georgian'
              value={occasion.Georgian}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block mb-2'>تاریخ میلادی کبیسه</label>
            <input
              type='text'
              name='GeorgianK'
              value={occasion.GeorgianK}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              لینک لوگو
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={logoUrl}
                className='flex-1 p-2 border rounded-md'
                placeholder='آدرس تصویر را وارد کنید'
                readOnly
              />
              <button
                type='button'
                onClick={() => document.getElementById('logo-upload')?.click()}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
              >
                بارگذاری
              </button>
              <input
                id='logo-upload'
                type='file'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    uploadFile(file, 'logo').then((url) => {
                      if (url) {
                        setLogoUrl(url);
                        setOccasion((prev) =>
                          prev ? { ...prev, LogoLink: url } : prev
                        );
                      }
                    });
                }}
                accept='image/*'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              لینک تصویر مدال
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={imageUrl}
                className='flex-1 p-2 border rounded-md'
                placeholder='آدرس تصویر مدال را وارد کنید'
                readOnly
              />
              <button
                type='button'
                onClick={() => document.getElementById('medal-upload')?.click()}
                className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
              >
                بارگذاری
              </button>
              <input
                id='medal-upload'
                type='file'
                className='hidden'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    uploadFile(file, 'medal').then((url) => {
                      if (url) {
                        setImageUrl(url);
                        setOccasion((prev) =>
                          prev ? { ...prev, ModalImageLink: url } : prev
                        );
                      }
                    });
                }}
                accept='image/*'
              />
            </div>
          </div>
        </div>

        <div>
          <label className='block mb-2'>متن</label>
          <textarea
            name='Text'
            value={occasion.Text}
            onChange={handleChange}
            rows={4}
            className='w-full p-2 border rounded'
          />
        </div>

        <div>
          <label className='block mb-2'>لینک مرجع</label>
          <input
            type='url'
            name='RefLink'
            value={occasion.RefLink}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>

        <div className='flex gap-4'>
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
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
