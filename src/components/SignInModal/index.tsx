'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('ایمیل یا رمز عبور نادرست است');
      } else {
        onClose();
        router.refresh();
      }
    } catch (error) {
      setError('خطا در ورود به سیستم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center'>
      <div
        className='relative w-96 shadow-lg rounded-lg bg-white p-6'
        dir='rtl'
      >
        <div className='flex justify-between items-center mb-6'>
          <h3 className='text-xl font-bold text-gray-900'>
            ورود به پنل مدیریت
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500'
          >
            <span className='sr-only'>بستن</span>
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              ایمیل
            </label>
            <input
              id='email'
              name='email'
              type='email'
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#373D70] focus:border-[#373D70]'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='example@email.com'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              رمز عبور
            </label>
            <input
              id='password'
              name='password'
              type='password'
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#373D70] focus:border-[#373D70]'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='رمز عبور خود را وارد کنید'
            />
          </div>

          {error && (
            <div className='text-red-500 text-sm text-center'>{error}</div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#373D70] hover:bg-[#4c5494] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#373D70]'
          >
            {loading ? 'در حال ورود...' : 'ورود به سیستم'}
          </button>
        </form>
      </div>
    </div>
  );
}
