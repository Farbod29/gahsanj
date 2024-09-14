import React from 'react';

const Madi = () => {
  return (
    <div>
      <h1 className='text-xl font-bold mb-4'>گاه‌شماری کردی / مادی</h1>
      <p className='text-lg mb-4'>
        تقویم کوردی یکی از تقویم‌های جهان است که برخلاف دیگر تقویم‌های رایج که
        معمولاً بر اساس رویدادهای آیینی و مذهبی هستند، مبدأ آن با یک رخداد حماسی
        یعنی بنیان‌گذاری امپراطوری ماد جشن گرفته می‌شود. در طول قرون وسطی، تقویم
        میلادی تحت فشار کلیسا تغییر یافت و به روزهای مرتبط با میلاد عیسی مسیح
        منتقل شد. مبدأ تقویم ایرانی نیز هجرت پیامبر اسلام در ۶۲۲ میلادی در نظر
        گرفته شده است.
      </p>

      <p className='text-lg mb-4'>
        در سال ۱۳۰۴ هجری شمسی، ماه‌های فارسی جایگزین ماه‌های عربی در تقویم ایران
        شدند. اما در تقویم کوردی، مبدأ به فتح نینوا در سال ۶۱۲ پیش از میلاد توسط
        کیخسرو نسبت داده می‌شود. این رویداد، یکی از مهم‌ترین وقایع تاریخی است که
        در تاریخ‌نگاری‌های جهانی ثبت شده و به‌عنوان نماد اتحاد کوردی‌ها و مادها
        شناخته می‌شود.
      </p>

      <p className='text-lg mb-4'>
        فتح نینوا به‌عنوان یک پیروزی بزرگ مادها به‌طور گسترده‌ای در کتاب‌های
        تاریخی ثبت شده است. این واقعه نه تنها امپراطوری آشور را سرنگون کرد، بلکه
        پایه‌های امپراطوری ماد را مستحکم کرد. اتحاد میان خاندان‌های ماد و
        کوردستان، یکی از مهم‌ترین وقایع در تاریخ منطقه محسوب می‌شود و به همین
        دلیل، سال ۶۱۲ پیش از میلاد به‌عنوان آغاز تقویم کوردی انتخاب شده است.
      </p>

      <h2 className='text-3xl font-semibold mt-6 mb-2'>ماه‌های کردی مادی</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>Xakelêwe / خاکه‌لێوه = فروردین</li>
        <li className='text-lg'>Gulan / گوڵان = اردیبهشت</li>
        <li className='text-lg'>Cozerdan / جۆزه‌ردان = خرداد</li>
        <li className='text-lg'>Pûşper / پووشپه‌ڕ = تیر</li>
        <li className='text-lg'>Gelawêj / گه‌لاوێژ = مرداد</li>
        <li className='text-lg'>Xermanan / خه‌رمانان = شهریور</li>
        <li className='text-lg'>Rezber / ڕه‌زبه‌ر = مهر</li>
        <li className='text-lg'>Xezelwer / خەزەڵوەر = آبان</li>
        <li className='text-lg'>Sermawez / سه‌رماوه‌ز = آذر</li>
        <li className='text-lg'>Befranbar / به‌فرانبار = دی</li>
        <li className='text-lg'>Rêbendan / ڕێبه‌ندان = بهمن</li>
        <li className='text-lg'>Reşemê / ڕه‌شه‌مێ = اسفند</li>
      </ul>

      <h2 className='text-3xl font-semibold mt-6 mb-2'>
        تفاضل گاه‌شماری کردی با هجری خورشیدی
      </h2>
      <p className='text-lg mb-4'>
        تفاضل گاه‌شماری کردی با هجری خورشیدی بسته به مبدأ انتخابی (تأسیس حکومت
        ماد یا فتح نینوا) متفاوت است. اگر مبدأ، تأسیس دولت ماد در نظر گرفته شود،
        ۱۳۲۱ سال تفاوت دارد. در حالی که با مبدأ فتح نینوا، تفاضل ۱۲۳۳ سال است.
      </p>

      <h2 className='text-3xl font-semibold mt-6 mb-2'>سرچشمه:</h2>
      <ul className='list-disc list-inside mb-4'>
        <li className='text-lg'>Gregorian calendar, رۆژمێر کوردی</li>
        <li className='text-lg'>Kurdish Calendar, Prof. Mehrdad R. Izady</li>
        <link
          rel='stylesheet'
          href='https://en.wikipedia.org/wiki/Kurdish_calendar'
        />
        <link
          rel='stylesheet'
          href='https://books.google.de/books?id=I9mr6OgLjBoC&pg=PA241&lpg=PA241&dq=kurdish+calendar&source=web&ots=0qEycrmnPt&sig=b_ZKiumxiNus3cp8X4bDoQE-VfE&redir_esc=y#v=onepage&q=kurdish%20calendar&f=false'
        />
      </ul>
    </div>
  );
};

export default Madi;
