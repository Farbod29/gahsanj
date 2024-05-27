'use client';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';

const MyModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div>
      <button onClick={openModal} className="text-xs">
        ⓘ راهنما
      </button>
      <Dialog
        open={isOpen}
        onClose={closeModal}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="min-h-screen px-4 text-center">
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          ></span>

          <div
            className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-2xl"
            dir="rtl"
          >
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              نام روزهای هفته از کجا آمده است؟
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500 ">
                <br />
                <h2 className=" font-medium leading-6 text-gray-900">
                  دوشنبه: مه روز - مهروز:
                </h2>
                <p className="text-justify text-right leading-relaxed">
                  این روز نیز بر گرفته از آین میترائیسم یا مهر پرستی است و به
                  طور کلی مهر و ماه و خورروز از عوامل قدرت وصلابت در آئین
                  مهرپرستی به جساب می آیند.
                </p>
                <br />
                <h2 className=" font-medium leading-6 text-gray-900">
                  سه شنبه, بهرام روز:
                </h2>
                <p className="text-justify text-right leading-relaxed">
                  همچنان کلمه «روز» به مهنای نور و روشنایی است بهرام علاوه بر
                  اینکه یکی از سیاره های منظومه شمسی است یکی از ایزدان ایران
                  باستان نیز به حساب می آید «بهرام» خدای جنگ و پیروزی است و به
                  اهورامزدا کمک کرده تا بتواند عدالت را در جهان گسترده کند به
                  همین دلیل نام او را بهرام روز گذاردند و این روز یعنی «سه شنبه»
                  را به نام بهرام روز میخوانند
                </p>
                <p>
                  <br />
                  <h2 className=" font-medium leading-6 text-gray-900">
                    چهارشنبه: تیر روز:
                  </h2>
                  <p className="text-justify text-right leading-relaxed">
                    تیر برگرفته از تیشتر در زبان پهلوی است. ستاره تیشتر مهم ترین
                    ستاره ایران باستان استژ نیاکان ما ایزد تیر راخدای محافظ
                    باران میدانستند در واقع اهورا مزدا به «تیر» فرمان میداد تا
                    باران را بر سر بنده گان نازل کند و نگذارد که خشکسالی زمین را
                    فرا گیرد به همین دلیل تیر دست به کار میشد و زمین را از نا
                    پاکی و خشکسالی رها میکرد در علم فیزیک تیشتر ستاره ای است ۲۵
                    برابر خورروز تابندگی و جرم دو برابر در استاد محمد ملايري «
                    ستاره شباهنگ ( تيشتر ـ سیریوس ).
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=XFguDZXoFJA"
                    className="text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Video Link
                  </a>
                  <br />
                  <br />
                  <h2 className="font-medium leading-6 text-gray-900">
                    پنجشنبه: اورمزد روز:
                  </h2>
                  <p className="text-justify text-right leading-relaxed">
                    اورمزد روز در واقع همان اهورا مزدا است و روز پنجشنبه را به
                    نام اهورا مزدا نامگذاری کردند اَهورامَزدا (به اوستایی:
                    «مَزدا اَهورَه») (و نیز با نام‌های: اهورا، اورمَزد، هورمَزد،
                    اورمُزد، هورمُز و هُرمُز و ورمز) نام آفریدگارِ نِکویی‌ها و
                    دادار و پروردگارِ همهٔ هستی در آئین مَزدَیَسنا است. او
                    الوهیت و الهه آفرینش در این دین است. به باور زرتشتیان،
                    اهورامزدا آفرینندهٔ جهان است. مزدیسنان اهورامزدا را
                    می‌پرستند. اهورامزدا خالق و داور همهٔ چیزهای مادی و معنوی و
                    نیز آفریننده روشنی و تاریکی و برقرارکننده نظم هستی (اشه)
                    است.
                  </p>
                  <br />
                  <p className="text-xxxxs">
                    نگاه کنید به اوستا، یسنا ۲۸،
                    <br />
                    بندِ یکم کانون اروپایی برای آموزش جهان بینی زرتشت
                    <br />
                    Williams, Zoroastrianism.
                  </p>
                  <br />
                  <h2 className="font-medium leading-6 text-gray-900">
                    جمعه (آدینه) : ناهید روز, زهره:
                  </h2>
                  <p className="text-justify text-right leading-relaxed">
                    منظور از الهه ناهید در واقع همان آناهیتا است که خداوند آب
                    است و همچنین میخواهد آب را به عنوان نمادی از لطف پروردگار در
                    نظر بیآورد اما ما در هر ماه از سال جشنهای باستانی داریم یعنی
                    جشنهای باستانی ما فقط به عید نوروز مربوط نمیشوند بلکه در هر
                    ماه جشنی مشابه عید نوروز داشتیم . ناهید یا زهره[۱۵] به ترتیب
                    نزدیکی به خورروز، دومین سیارهٔ زمین‌سان سامانهٔ خورروزی است
                    که در هر ۲۲۵ روز یکبار به دور خورروز می‌چرخد. مدار زهره،
                    میان مدارهای زمین و تیر قرار گرفته و از نظر مداری،
                    نزدیک‌ترین فاصله را با مدار زمین را دارد.
                  </p>
                  <br />
                  <h2 className="font-medium leading-6 text-gray-900">
                    شنبه یا کیوان روز:
                  </h2>
                  <p className="text-justify text-right leading-relaxed">
                    در فرهنگ پارسی، نامگذاری روزهای هفته با اساطیر و نجوم پیوند
                    خورده است&nbsp;: شنبه به کیوان روز معروف است، زیرا کیوان، که
                    در فرهنگ غربی به آن زحل گفته می‌شود، پس از مشتری بزرگترین
                    سیاره منظومه شمسی است و حجمی نزدیک به هفتصد برابر زمین
                    دارد&nbsp;. واژه «روز» نیز در زبان پارسی به معنای نور و
                    روشنایی است، که هم تراز واژه رووچ پهلوی یعنی روز و روشنایی
                    است&nbsp;. در انگلیسی به آن به معنای کیوان است&nbsp;.Saturn
                    می‌گویند که (Saturday).
                  </p>

                  <br />
                  <h2 className="font-medium leading-6 text-gray-900">
                    یکشنبه: مهر روز :
                  </h2>

                  <p className="text-justify text-right leading-relaxed">
                    : یکشنبه، روزی است که به ایزد مهریا خورروز نامگذاری شده،
                    ایزدی که نماد عهد و پیمان و راستی در فرهنگ ایران باستان بود.
                    مهرپرستی یا میترائیسم، آیینی باستانی است که ریشه‌های عمیقی
                    در فرهنگ ایرانی دارد و بر پایه احترام و وفاداری به عهد و
                    پیمان‌ها بنا نهاده شده است. این آیین، که به مهر یا خورروز
                    تقدیس می‌کرد، به اروپا نیز منتقل شد و تأثیرات آن حتی در
                    مسیحیت، از جمله در تصویر میترا و دوازده حواریون مشاهده
                    می‌شود. به علاوه، نشانه‌هایی از این آیین در نیایشگاه‌های
                    باستانی مانند مهراب‌ها دیده می‌شود که امروزه در مساجد نیز به
                    کار می‌رود و یادگاری از دوران باشکوه میترا در ایران زمین
                    است&nbsp;.
                  </p>
                </p>
                <br />
                <p className="text-xxxxs">
                  سرچشمه ها: محمود روح‌الامینی
                  <br />
                  انتشارات آگاه سال چاپ یک سال پیش از ایران نو ،
                  <br /> شومیز رقعی ۲۰۷ صفحه گردآوری فرهاد درخشان
                  <br />
                </p>
              </p>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="inline-flex justify-end px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                onClick={closeModal}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MyModal;
