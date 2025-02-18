'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import AuthProvider from '@/components/AuthProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  const navItems = [
    { path: '/dashboard', label: 'داشبورد', icon: '📊' },
    // { path: '/dashboard/occasions', label: 'مناسبت‌ها', icon: '📅' },
    { path: '/dashboard/add-occasion', label: 'افزودن مناسبت', icon: '➕' },
    // { path: '/dashboard/search', label: 'جستجو', icon: '🔍' },
    // { path: '/dashboard/settings', label: 'تنظیمات', icon: '⚙️' },
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  // Show nothing while loading
  if (status === 'loading') {
    return null;
  }

  // If not authenticated, don't render the dashboard content
  if (status === 'unauthenticated') {
    return (
      <AuthProvider>
        <div className='min-h-screen bg-gray-100'></div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className='flex h-screen bg-gray-100' dir='rtl'>
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-64' : 'w-20'
          } bg-[#373D70] text-white transition-all duration-300 flex flex-col`}
        >
          <div className='p-4'>
            <div className='flex items-center justify-between'>
              <h2 className={`${!isSidebarOpen && 'hidden'} font-bold text-xl`}>
                پنل مدیریت
              </h2>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? '◀' : '▶'}
              </button>
            </div>
          </div>

          <nav className='mt-8 flex-grow'>
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center p-4 ${
                  pathname === item.path ? 'bg-[#4c5494]' : ''
                } hover:bg-[#4c5494]`}
              >
                <span className='mr-2'>{item.icon}</span>
                <span className={!isSidebarOpen ? 'hidden' : ''}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Sign Out Button */}
          <div className='p-4 border-t border-[#4c5494]'>
            <button
              onClick={handleSignOut}
              className={`flex items-center p-2 w-full hover:bg-[#4c5494] rounded transition-colors ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <span className='mr-2'>🚪</span>
              <span className={!isSidebarOpen ? 'hidden' : ''}>خروج</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className='flex-1 overflow-y-auto p-8'>{children}</main>
      </div>
    </AuthProvider>
  );
}
