'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { path: '/dashboard', label: 'داشبورد', icon: '📊' },
    { path: '/dashboard/occasions', label: 'مناسبت‌ها', icon: '📅' },
    { path: '/dashboard/add-occasion', label: 'افزودن مناسبت', icon: '➕' },
    { path: '/dashboard/search', label: 'جستجو', icon: '🔍' },
    { path: '/dashboard/settings', label: 'تنظیمات', icon: '⚙️' },
  ];

  return (
    <div className='flex h-screen bg-gray-100' dir='rtl'>
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#373D70] text-white transition-all duration-300`}
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
        <nav className='mt-8'>
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
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto p-8'>{children}</main>
    </div>
  );
}
