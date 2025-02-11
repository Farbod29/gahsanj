'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoImage from '@/components/LogoImage';

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

export default function EditOccasionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [occasion, setOccasion] = useState<Occasion | null>(null);

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
  }, [params.id]);

  const fetchOccasion = async () => {
    try {
      const response = await fetch(`/api/occasions/${params.id}`);
      if (!response.ok) throw new Error('Failed to fetch occasion');
      const data = await response.json();
      setOccasion(data);
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
      const response = await fetch(`/api/occasions?id=${params.id}`, {
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
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>ویرایش مناسبت</h1>

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
            <label className='block mb-2'>لینک تصویر مدال</label>
            <div className='space-y-2'>
              <div className='w-12 h-12 overflow-hidden'>
                <LogoImage
                  src={occasion.ModalImageLink}
                  alt={occasion.ShortTitle}
                  size={48}
                  className='rounded object-cover w-12 h-12'
                />
              </div>
              <input
                type='url'
                name='ModalImageLink'
                value={occasion.ModalImageLink}
                onChange={handleChange}
                className='w-full p-2 border rounded mt-2'
                placeholder='آدرس تصویر مدال را وارد کنید'
              />
            </div>
          </div>

          <div>
            <label className='block mb-2'>لینک لوگو</label>
            <div className='space-y-2'>
              <div className='w-12 h-12 overflow-hidden'>
                <LogoImage
                  src={occasion.LogoLink}
                  alt={occasion.ShortTitle}
                  size={48}
                  className='rounded-full object-cover w-12 h-12'
                />
              </div>
              <input
                type='url'
                name='LogoLink'
                value={occasion.LogoLink}
                onChange={handleChange}
                className='w-full p-2 border rounded mt-2'
                placeholder='آدرس تصویر را وارد کنید'
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
