'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';
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
  const [authChecking, setAuthChecking] = useState(true);
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

  const fetchDashboardData = useCallback(async () => {
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
      if (data.occasions) {
        setOccasions(data.occasions);
      }
      if (data.pagination?.totalPages) {
        setTotalPages(data.pagination.totalPages);
      } else {
        setTotalPages(1); // Default to 1 page if pagination info is not available
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedMonth, filterImportant, page]);

  useEffect(() => {
    // Check authentication status
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        setAuthChecking(false);
      })
      .catch(() => {
        router.push('/login?redirect=/dashboard');
      });
  }, [router]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSort = (key: keyof Occasion) => {
    // Implementation of handleSort function
  };

  const sortedOccasions = [...occasions].sort((a, b) => {
    return a.PersianDayNumber - b.PersianDayNumber;
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        throw new Error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setError('خطا در خروج از سیستم');
    }
  };

  if (authChecking) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
          <p className='mt-2'>در حال بررسی دسترسی...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>داشبورد مدیریت گاه سنج</h1>
        <button
          onClick={handleLogout}
          className='px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors'
        >
          خروج
        </button>
      </div>

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
          <thead className='bg-gray-50 border-b border-gray-200'>
            <tr>
              <th className='px-1 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-8'>
                ردیف
              </th>
              {[
                { key: 'LogoLink', label: 'لوگو', width: 'w-14' },
                { key: 'ShortTitle', label: 'عنوان کوتاه', width: 'w-48' },
                { key: 'EventTitle', label: 'عنوان کامل', width: 'w-64' },
                { key: 'Month', label: 'ماه', width: 'w-20' },
                { key: 'PersianDayNumber', label: 'روز', width: 'w-14' },
                { key: 'Georgian', label: 'تاریخ میلادی', width: 'w-32' },
                {
                  key: 'GeorgianK',
                  label: 'تاریخ میلادی کبیسه',
                  width: 'w-32',
                },
                { key: 'importantDay', label: 'روز مهم', width: 'w-20' },
                { key: 'ModalStatus', label: 'نمایش مدال', width: 'w-24' },
              ].map(({ key, label, width }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key as keyof Occasion)}
                  className={`px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 ${width || ''}`}
                >
                  {label}
                  {/* Implementation of sort icon */}
                </th>
              ))}
              <th className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32'>
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            {loading ? (
              <tr>
                <td colSpan={11} className='text-center py-4'>
                  <div className='inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                  <p className='mt-2'>در حال بارگذاری...</p>
                </td>
              </tr>
            ) : (
              <>
                {sortedOccasions.map((occasion, index) => (
                  <tr
                    key={occasion._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      index !== 0 ? 'border-t border-gray-200' : ''
                    }`}
                  >
                    <td className='px-1 py-2 whitespace-nowrap text-gray-500 text-center text-sm'>
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className='px-1 py-2 whitespace-nowrap text-center'>
                      <LogoImage
                        src={occasion.LogoLink}
                        alt={occasion.ShortTitle}
                        className='rounded-full object-cover w-7 h-7 mx-auto'
                      />
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap min-w-[12rem]'>
                      {occasion.ShortTitle}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap min-w-[16rem]'>
                      {occasion.EventTitle}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.Month}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.PersianDayNumber}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap min-w-[8rem]'>
                      {occasion.Georgian}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap min-w-[8rem]'>
                      {occasion.GeorgianK}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.importantDay ? '✅' : '❌'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {occasion.ModalStatus ? '✅' : '❌'}
                    </td>
                    <td className='px-4 py-3 whitespace-nowrap text-sm'>
                      <div className='flex justify-between items-center gap-6'>
                        <button
                          onClick={() =>
                            router.push(
                              `/dashboard/edit-occasion/${occasion._id}`
                            )
                          }
                          className='text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors'
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
                          className='text-red-600 hover:text-red-800 px-2 py-1 rounded transition-colors'
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
        {!loading && <Pagination />}
      </div>
    </div>
  );
}
