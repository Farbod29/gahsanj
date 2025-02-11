'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '../../../hooks/useDebounce';

interface Occasion {
  _id: string;
  ShortTitle: string;
  EventTitle: string;
  Month: string;
  PersianDayNumber: number;
  importantDay: boolean;
  LogoLink: string;
  Text: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function OccasionsPage() {
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const debouncedSearch = useDebounce(searchTerm, 500);

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
    fetchOccasions();
  }, [currentMonth, debouncedSearch, pagination.page]);

  const fetchOccasions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (currentMonth) params.append('month', currentMonth);
      if (debouncedSearch) params.append('search', debouncedSearch);

      const response = await fetch(`/api/occasions?${params}`);
      const data = await response.json();
      setOccasions(data.occasions);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching occasions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مناسبت اطمینان دارید؟')) return;

    try {
      const response = await fetch(`/api/occasions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setOccasions(occasions.filter((occ) => occ._id !== id));
      }
    } catch (error) {
      console.error('Error deleting occasion:', error);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>مدیریت مناسبت‌ها</h1>
        <Link
          href='/dashboard/add-occasion'
          className='bg-[#373D70] text-white px-4 py-2 rounded-lg hover:bg-[#4c5494]'
        >
          افزودن مناسبت جدید
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className='flex gap-4 bg-white p-4 rounded-lg'>
        <select
          value={currentMonth}
          onChange={(e) => setCurrentMonth(e.target.value)}
          className='px-4 py-2 border rounded-lg'
        >
          <option value=''>همه ماه‌ها</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <input
          type='text'
          placeholder='جستجو...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='px-4 py-2 border rounded-lg flex-grow'
        />
      </div>

      {/* Loading State */}
      {loading && <div className='text-center py-4'>در حال بارگذاری...</div>}

      {/* Occasions Table */}
      <div className='bg-white rounded-lg shadow overflow-hidden'>
        <table className='min-w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-right'>لوگو</th>
              <th className='px-6 py-3 text-right'>عنوان</th>
              <th className='px-6 py-3 text-right'>ماه</th>
              <th className='px-6 py-3 text-right'>روز</th>
              <th className='px-6 py-3 text-right'>مهم</th>
              <th className='px-6 py-3 text-right'>عملیات</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {occasions.map((occasion) => (
              <tr key={occasion._id}>
                <td className='px-6 py-4'>
                  <Image
                    src={occasion.LogoLink}
                    alt={occasion.ShortTitle}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                </td>
                <td className='px-6 py-4'>{occasion.ShortTitle}</td>
                <td className='px-6 py-4'>{occasion.Month}</td>
                <td className='px-6 py-4'>{occasion.PersianDayNumber}</td>
                <td className='px-6 py-4'>
                  {occasion.importantDay ? '✅' : '❌'}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex space-x-2'>
                    <Link
                      href={`/dashboard/edit-occasion/${occasion._id}`}
                      className='text-blue-600 hover:text-blue-800'
                    >
                      ویرایش
                    </Link>
                    <button
                      onClick={() => handleDelete(occasion._id)}
                      className='text-red-600 hover:text-red-800'
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-center gap-2'>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
          (pageNum) => (
            <button
              key={pageNum}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: pageNum }))
              }
              className={`px-4 py-2 rounded ${
                pagination.page === pageNum
                  ? 'bg-[#373D70] text-white'
                  : 'bg-gray-200'
              }`}
            >
              {pageNum}
            </button>
          )
        )}
      </div>
    </div>
  );
}
