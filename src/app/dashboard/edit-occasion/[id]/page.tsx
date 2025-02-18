'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
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

const UploadIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    className='mx-auto h-12 w-12 text-gray-400'
    fill='none'
    viewBox='0 0 48 48'
    stroke='currentColor'
    aria-hidden='true'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={2}
      d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
    />
  </svg>
);

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

  const fetchOccasion = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Use MongoDB ObjectId format for the query
      const response = await fetch(`/api/occasions/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch occasion');
      }

      const data = await response.json();
      if (!data) {
        throw new Error('No data received');
      }

      // Set all the state values
      setOccasion(data);
      setLogoUrl(data.LogoLink || '');
      setImageUrl(data.ModalImageLink || '');

      console.log('Loaded occasion data:', data); // For debugging
    } catch (error) {
      console.error('Error fetching occasion:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to load occasion data'
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOccasion();
  }, [fetchOccasion]);

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

    // بررسی سایز و نوع فایل
    const isValidFileType = ['image/png', 'image/jpeg', 'image/webp'].includes(
      file.type
    );
    if (!isValidFileType) {
      alert('لطفاً فقط فایل‌های PNG، JPG یا WebP آپلود کنید');
      return;
    }

    // بررسی سایز
    const maxSize = type === 'logo' ? 100 * 1024 : 200 * 1024;
    if (file.size > maxSize) {
      alert(
        `حجم ${type === 'logo' ? 'لوگو' : 'مدال'} نباید بیشتر از ${
          maxSize / 1024
        }KB باشد`
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

      if (!data.success || !data.url) {
        throw new Error('Invalid response from server');
      }

      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      alert(
        'خطا در آپلود فایل: ' +
          (error instanceof Error ? error.message : 'خطای ناشناخته')
      );
      return null;
    }
  }, []);

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
          if (type === 'logo') {
            setLogoUrl(url);
            setOccasion((prev) => (prev ? { ...prev, LogoLink: url } : prev));
          } else {
            setImageUrl(url);
            setOccasion((prev) =>
              prev ? { ...prev, ModalImageLink: url } : prev
            );
          }
        }
      }
    },
    [uploadFile]
  );

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
            <label className='block mb-2 text-right'>عنوان کوتاه</label>
            <input
              type='text'
              name='ShortTitle'
              value={occasion?.ShortTitle || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>عنوان کامل</label>
            <input
              type='text'
              name='EventTitle'
              value={occasion?.EventTitle || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>ماه</label>
            <select
              name='Month'
              value={occasion?.Month || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              required
            >
              <option value=''>انتخاب کنید</option>
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
              value={occasion?.PersianDayNumber || ''}
              onChange={handleChange}
              min='1'
              max='31'
              className='w-full p-2 border rounded'
              required
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>تاریخ میلادی</label>
            <input
              type='text'
              name='Georgian'
              value={occasion?.Georgian || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: 22,03'
              pattern='\d{1,2},\d{1,2}'
              title='لطفاً تاریخ را به فرمت روز,ماه وارد کنید. مثال: 22,03'
            />
          </div>

          <div>
            <label className='block mb-2 text-right'>تاریخ میلادی کبیسه</label>
            <input
              type='text'
              name='GeorgianK'
              value={occasion?.GeorgianK || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              placeholder='مثال: 21,03'
              pattern='\d{1,2},\d{1,2}'
              title='لطفاً تاریخ را به فرمت روز,ماه وارد کنید. مثال: 21,03'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              لینک لوگو
            </label>
            <div className='space-y-2'>
              {logoUrl && (
                <div className='flex items-center gap-2'>
                  <LogoImage
                    src={logoUrl}
                    alt='Logo preview'
                    size={48}
                    showClearButton
                    onClear={() => {
                      setLogoUrl('');
                      setOccasion((prev) =>
                        prev ? { ...prev, LogoLink: '' } : prev
                      );
                    }}
                  />
                </div>
              )}

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
                    <UploadIcon />
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
            </div>
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
                  <UploadIcon />
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
              placeholder='آدرس تصویر را وارد کنید'
              readOnly
            />
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
