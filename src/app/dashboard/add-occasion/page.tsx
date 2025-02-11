'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddOccasionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    ShortTitle: '',
    EventTitle: '',
    Month: '',
    PersianDayNumber: '',
    Georgian: '',
    GeorgianK: '',
    ModalImageLink: '',
    LogoLink: '',
    Text: '',
    RefLink: '',
    importantDay: false,
    ModalStatus: false,
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/occasions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'خطا در ثبت مناسبت');
      }

      router.push('/dashboard/occasions');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'خطا در ثبت مناسبت');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>افزودن مناسبت جدید</h1>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-6 rounded-lg'
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block mb-2'>عنوان کوتاه</label>
            <input
              type='text'
              name='ShortTitle'
              value={formData.ShortTitle}
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
              value={formData.EventTitle}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2'>ماه</label>
            <select
              name='Month'
              value={formData.Month}
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
              value={formData.PersianDayNumber}
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
              value={formData.Georgian}
              onChange={handleChange}
              placeholder='مثال: 21,03'
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block mb-2'>تاریخ میلادی کبیسه</label>
            <input
              type='text'
              name='GeorgianK'
              value={formData.GeorgianK}
              onChange={handleChange}
              placeholder='مثال: 20,03'
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block mb-2'>لینک تصویر مدال</label>
            <input
              type='url'
              name='ModalImageLink'
              value={formData.ModalImageLink}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>

          <div>
            <label className='block mb-2'>لینک لوگو</label>
            <input
              type='url'
              name='LogoLink'
              value={formData.LogoLink}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
        </div>

        <div>
          <label className='block mb-2'>متن</label>
          <textarea
            name='Text'
            value={formData.Text}
            onChange={handleChange}
            rows={6}
            className='w-full p-2 border rounded'
          />
        </div>

        <div>
          <label className='block mb-2'>لینک مرجع</label>
          <input
            type='url'
            name='RefLink'
            value={formData.RefLink}
            onChange={handleChange}
            className='w-full p-2 border rounded'
          />
        </div>

        <div className='flex gap-4'>
          <label className='flex items-center'>
            <input
              type='checkbox'
              name='importantDay'
              checked={formData.importantDay}
              onChange={handleChange}
              className='ml-2'
            />
            روز مهم
          </label>

          <label className='flex items-center'>
            <input
              type='checkbox'
              name='ModalStatus'
              checked={formData.ModalStatus}
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
            disabled={loading}
            className='px-4 py-2 bg-[#373D70] text-white rounded hover:bg-[#4c5494] disabled:opacity-50'
          >
            {loading ? 'در حال ثبت...' : 'ثبت مناسبت'}
          </button>
        </div>
      </form>
    </div>
  );
}
