import React from 'react';

const MiladiDescription = () => {
  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>گاه سنج میلادی</h1>
      <p className='text-lg mb-4'>
        گاه سنج میلادی، همچنین شناخته شده به عنوان تقویم گریگوریان، تقویمی است
        که بیشتر در جهان استفاده می‌شود و برای امور بین‌المللی، تجارت و ارتباطات
        جهانی به کار برده می‌شود. این تقویم در سال ۱۵۸۲ میلادی توسط پاپ گریگوری
        XIII به منظور اصلاح تقویم ژولین و بهتر تطابق پیدا کردن با طول سال
        خورشیدی معرفی شد.
      </p>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>ویژگی‌های کلیدی</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>
          <strong>ساختار:</strong> تقویم میلادی شامل ۱۲ ماه با ۲۸ تا ۳۱ روز است،
          با یک سال کبیسه هر ۴ سال که شامل ۲۹ روز در ماه فوریه است.
        </li>
        <li className='text-lg'>
          <strong>تطابق سالانه:</strong> طراحی تقویم به گونه‌ای است که تطابق
          دقیق با طول سال خورشیدی را تضمین می‌کند، که در حدود ۳۶۵.۲۴۲۵ روز است.
        </li>
        <li className='text-lg'>
          <strong>کاربردهای جهانی:</strong> این تقویم برای همه مهم‌ترین تاریخ‌ها
          و رویدادهای بین‌المللی استفاده می‌شود و به عنوان تقویم رسمی در بیشتر
          کشورهای جهان پذیرفته شده است.
        </li>
      </ul>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>
        تأثیرات فرهنگی و اجتماعی
      </h2>
      <p className='text-lg mb-4'>
        استفاده از تقویم میلادی تأثیرات گسترده‌ای بر جوامع مختلف داشته و به
        عنوان یک ابزار مهم در تسهیل تجارت و دیپلماسی بین‌المللی شناخته شده است.
      </p>
      <h2 className='text-3xl font-semibold mt-6 mb-2'>سرچشمه</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>
          <a
            href='https://fa.wikipedia.org/wiki/%DA%AF%D8%A7%D9%87%E2%80%8C%D8%B4%D9%85%D8%A7%D8%B1%DB%8C_%D9%85%DB%8C%D9%84%D8%A7%D8%AF%DB%8C'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 hover:underline'
          >
            ویکی‌پدیا، گاه سنج میلادی
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MiladiDescription;
