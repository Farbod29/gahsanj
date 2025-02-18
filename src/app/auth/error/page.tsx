'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const getErrorMessage = (error: string | null) => {
  switch (error) {
    case 'Configuration':
      return 'خطا در تنظیمات سرور. لطفا با پشتیبانی تماس بگیرید.';
    case 'AccessDenied':
      return 'دسترسی شما به این بخش مجاز نیست.';
    case 'Verification':
      return 'لینک تایید منقضی شده یا قبلاً استفاده شده است.';
    default:
      return 'خطایی در ورود به سیستم رخ داده است. لطفا دوباره تلاش کنید.';
  }
};

function ErrorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      setError(searchParams.get('error'));
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8 text-center'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            خطا در ورود
          </h2>
          <div className='mt-4 text-red-600'>{getErrorMessage(error)}</div>
          <div className='mt-4'>
            <button
              onClick={() => router.push('/auth/signin')}
              className='inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            >
              بازگشت به صفحه ورود
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <h2 className='text-xl font-semibold'>در حال بارگذاری...</h2>
          </div>
        </div>
      }
    >
      <ErrorPageContent />
    </Suspense>
  );
}
