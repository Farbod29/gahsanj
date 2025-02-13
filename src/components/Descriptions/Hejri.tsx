import React from 'react';

const Hejri = () => {
  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>گاه سنج هجری خورشیدی</h1>
      <p className='text-lg mb-4'>
        گاه سنج هجری خورشیدی، نیز شناخته شده به عنوان تقویم جلالی، بر اساس حرکات
        خورشید است و به طور گسترده‌ای در ایران و افغانستان استفاده می‌شود. این
        تقویم در سال ۱۰۷۹ هجری قمری توسط عمر خیام و دیگر دانشمندان در دوره
        جلال‌الدین ملکشاه سلجوقی اصلاح شد.
      </p>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>ویژگی‌های کلیدی</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>
          <strong>دقت بالا:</strong> این تقویم یکی از دقیق‌ترین تقویم‌های جهان
          به شمار می‌رود و اختلاف آن با سال خورشیدی تنها یک روز در هر ۳۸۱۶ سال
          است.
        </li>
        <li className='text-lg'>
          <strong>طراحی:</strong> طراحی آن بر پایه سال‌های کبیسه با ۳۶۵ روز در
          سال‌های عادی و ۳۶۶ روز در سال‌های کبیسه است.
        </li>
        <li className='text-lg'>
          <strong>استفاده:</strong> این تقویم در امور مدنی و رسمی در ایران و
          افغانستان استفاده می‌شود و تاریخ‌های مهم دینی و ملی بر اساس آن تعیین
          می‌گردد.
        </li>
      </ul>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>
        تأثیرات فرهنگی و تاریخی
      </h2>
      <p className='text-lg mb-4'>
        اصلاح تقویم جلالی تأثیرات عمیقی بر جوامع ایرانی و افغانی گذاشته است و به
        عنوان بخشی از میراث فرهنگی این کشورها در نظر گرفته می‌شود.
      </p>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>سرچشمه</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>
          <a
            href='https://fa.wikipedia.org/wiki/%DA%AF%D8%A7%D9%87%E2%80%8C%D8%B4%D9%85%D8%A7%D8%B1%DB%8C_%D9%87%D8%AC%D8%B1%DB%8C_%D8%AE%D9%88%D8%B1%D8%B4%DB%8C%D8%AF%DB%8C'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            ویکی‌پدیا، گاه سنج هجری خورشیدی
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Hejri;
