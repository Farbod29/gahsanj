'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';

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

interface DashboardStats {
  totalOccasions: number;
  monthlyOccasions: number;
  importantDays: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOccasions: 0,
    monthlyOccasions: 0,
    importantDays: 0,
  });
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [filterImportant, setFilterImportant] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

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
    fetchDashboardData();
  }, [debouncedSearch, selectedMonth, filterImportant, page]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch stats
      const statsResponse = await fetch('/api/dashboard/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch stats');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch occasions with filters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });

      if (selectedMonth) params.append('month', selectedMonth);
      if (debouncedSearch) params.append('search', debouncedSearch);
      if (filterImportant) params.append('important', 'true');

      const occasionsResponse = await fetch(`/api/occasions?${params}`);
      if (!occasionsResponse.ok) throw new Error('Failed to fetch occasions');

      const data = await occasionsResponse.json();
      setOccasions(data.occasions);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof Occasion) => {
    // Implementation of handleSort function
  };

  const sortedOccasions = [...occasions].sort((a, b) => {
    // Implementation of sortedOccasions function
  });

  // Add pagination controls
  const Pagination = () => (
    <div className='flex justify-center gap-2 mt-4'>
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        className='px-4 py-2 rounded bg-gray-200 disabled:opacity-50'
      >
        قبلی
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => setPage(pageNum)}
          className={`px-4 py-2 rounded ${
            page === pageNum ? 'bg-[#373D70] text-white' : 'bg-gray-200'
          }`}
        >
          {pageNum}
        </button>
      ))}

      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        className='px-4 py-2 rounded bg-gray-200 disabled:opacity-50'
      >
        بعدی
      </button>
    </div>
  );

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>داشبورد مدیریت گاه‌شمار</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <h3 className='text-lg font-semibold'>کل مناسبت‌ها</h3>
          <p className='text-3xl font-bold mt-2 text-[#373D70]'>
            {stats.totalOccasions}
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <h3 className='text-lg font-semibold'>مناسبت‌های ماه جاری</h3>
          <p className='text-3xl font-bold mt-2 text-[#373D70]'>
            {stats.monthlyOccasions}
          </p>
        </div>

        <div className='bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow'>
          <h3 className='text-lg font-semibold'>روزهای مهم</h3>
          <p className='text-3xl font-bold mt-2 text-[#373D70]'>
            {stats.importantDays}
          </p>
        </div>
      </div>

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
          {error}
        </div>
      )}

      {/* Filters */}
      <div className='bg-white p-4 rounded-lg shadow space-y-4'>
        <div className='flex flex-wrap gap-4'>
          <input
            type='text'
            placeholder='جستجو...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='p-2 border rounded-lg flex-grow'
          />

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className='p-2 border rounded-lg'
          >
            <option value=''>همه ماه‌ها</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={filterImportant}
              onChange={(e) => setFilterImportant(e.target.checked)}
              className='form-checkbox'
            />
            فقط روزهای مهم
          </label>
        </div>
      </div>

      {/* Excel-like Table */}
      <div className='bg-white rounded-lg shadow overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              {[
                { key: 'LogoLink', label: 'لوگو' },
                { key: 'ShortTitle', label: 'عنوان کوتاه' },
                { key: 'EventTitle', label: 'عنوان کامل' },
                { key: 'Month', label: 'ماه' },
                { key: 'PersianDayNumber', label: 'روز' },
                { key: 'Georgian', label: 'تاریخ میلادی' },
                { key: 'GeorgianK', label: 'تاریخ میلادی کبیسه' },
                { key: 'importantDay', label: 'روز مهم' },
                { key: 'ModalStatus', label: 'نمایش مدال' },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof Occasion)}
                  className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100'
                >
                  {label}
                  {/* Implementation of sort icon */}
                </th>
              ))}
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {loading ? (
              <tr>
                <td colSpan={10} className='text-center py-4'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                  <p className='mt-2'>در حال بارگذاری...</p>
                </td>
              </tr>
            ) : (
              <>
                {sortedOccasions.map((occasion) => (
                  <tr
                    key={occasion._id}
                    className='hover:bg-gray-50 transition-colors'
                  >
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Image
                        src={occasion.LogoLink}
                        alt={occasion.ShortTitle}
                        width={40}
                        height={40}
                        className='rounded-full'
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.ShortTitle}
                    </td>
                    <td className='px-6 py-4'>{occasion.EventTitle}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.Month}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.PersianDayNumber}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.Georgian}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.GeorgianK}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.importantDay ? '✅' : '❌'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.ModalStatus ? '✅' : '❌'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/edit-occasion/${occasion._id}`
                            )
                          }
                          className='text-blue-600 hover:text-blue-800'
                        >
                          ویرایش
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm('آیا از حذف این مناسبت اطمینان دارید؟')
                            ) {
                              // Handle delete
                            }
                          }}
                          className='text-red-600 hover:text-red-800'
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <Pagination />
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
