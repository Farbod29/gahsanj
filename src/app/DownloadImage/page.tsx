'use client'; // This directive ensures the component executes client-side only
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  Suspense,
} from 'react';
import Image from 'next/image';
import jalaali from 'jalaali-js';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation'; // Ensures this is used client-side
import Link from 'next/link';

function decodeHtmlEntities(text) {
  const element = document.createElement('div');
  if (text) {
    element.innerHTML = text;
  }
  return element.innerText || element.textContent;
}

function ClientOnlyPage() {
  const searchParams = useSearchParams() as unknown as URLSearchParams;
  const gahshomariDates = searchParams.get('paramDates') || 'No Date';
  console.log('xxxxxxxxxxxxx');
  const line1 = searchParams.get('line1') || 'No Line 1';
  const line2 = searchParams.get('line2') || 'No Line 2';

  const gahshomariName = searchParams.get('paramName') || 'No Name';
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const gahshomariWeekday = searchParams.get('PersianWeekday') || 'No Weekday';
  const gahshomariMonth = searchParams.get('PersianMonth') || 'No Month';
  const paramDates = searchParams.get('paramDates') || 'No Month';
  const [year, day] = gahshomariDates.split('/');
  const ref = useRef(null);
  const screenshotRef = useRef<HTMLDivElement | null>(null);

  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  // let day = '۲۳';
  // let sanitizedDay = '۲۳';

  function toPersianNums(numString) {
    const persianNums = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return numString.replace(/\d/g, (x) => persianNums[parseInt(x)]);
  }

  function getPersianDayNumber(date = new Date()) {
    const jDate = jalaali.toJalaali(date);
    return jDate.jd; // This returns the day number in the Persian calendar
  }

  function getPersianDayNumberInPersian(date = new Date()) {
    const dayNumber = getPersianDayNumber(date);
    return toPersianNums(dayNumber.toString());
  }

  const today = new Date();
  const finalDay = getPersianDayNumberInPersian(today);

  useEffect(() => {
    const handleResize = () => {
      setLoaded(false); // Reset load state to trigger reload
      setTimeout(handleLoad, 100); // Use handleLoad to set loaded to true
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleLoad]);

  // Fetching images from the backend API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/ImagesAI/${encodeURIComponent(gahshomariName)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        if (data && data.length > 0) {
          const validImages = data
            .map((doc) => doc.imagesUrl)
            .filter(
              (url) =>
                url && (url.startsWith('http://') || url.startsWith('https://'))
            );
          setImages(validImages);
          setLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [gahshomariName]);

  const downloadScreenshot = useCallback(() => {
    if (screenshotRef.current) {
      const screenshotDiv = screenshotRef.current;
      if (screenshotDiv && loaded) {
        html2canvas(screenshotDiv, { scale: 1 }).then((canvas) => {
          const image = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality (0.8 = 80%)
          const link = document.createElement('a');
          link.href = image;
          link.download = 'screenshot.jpg'; // Change file extension
          link.click();
        });
      } else {
        console.error('Screenshot ref is not attached or image not loaded');
      }
    }
  }, [loaded]);

  const goLeft = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goRight = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  return (
    <div className='flex flex-col h-screen justify-between '>
      <div
        ref={ref}
        className='flex-grow relative'
        style={{
          width: '100%',
          height: 'auto',
          minHeight: 'calc(100% - 2rem)',
          objectFit: 'cover',
        }}
      >
        {!loaded && <div className='spinner'></div>}
        <Image
          src={
            images[currentIndex] ||
            'https://www.imgonline.com.ua/examples/color_palette_3.jpg'
          }
          alt='Decorative background'
          layout='fill'
          objectFit='cover'
          onLoad={handleLoad}
        />
        <div
          className='drop-shadow-lg text-cyan-600 '
          style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            zIndex: 2,
            whiteSpace: 'nowrap',
            textShadow: '2px 2px 5px rgba(0.2, 0.2, 0.2, 0.7)',
          }}
        >
          <div dir='rtl'>
            <div dir='rtl' className='text-center'>
              <span>{decodeHtmlEntities(line1)}</span>
            </div>
            <div dir='rtl' className='text-center '>
              <span>{decodeHtmlEntities(line2)}</span>
            </div>
          </div>
        </div>
      </div>
      {/* ==============Offscreen div for screenshot ================*/}
      <div
        ref={screenshotRef}
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1080px',
          height: '1920px',
        }}
      >
        <Image
          src={
            images[currentIndex] ||
            'https://www.imgonline.com.ua/examples/color_palette_3.jpg'
          }
          alt='Decorative background'
          layout='fill'
          objectFit='cover'
          onLoad={handleLoad}
        />
        <div
          style={{
            top: '7%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            textShadow: '2px 2px 5px rgba(0.2, 0.2, 0.2, 0.7)',
          }}
          className='absolute flex justify-center text-white text-5xl z-2 whitespace-nowrap'
        >
          <div className='rtl flex flex-row-reverse'>
            <div dir='rtl'>
              <div dir='rtl' className='text-center'>
                <span>{decodeHtmlEntities(line1)}</span>
              </div>
              <div dir='rtl' className='text-center '>
                <span className='inline-block mx-2'>
                  {decodeHtmlEntities(line2)}
                </span>
              </div>
            </div>
            {/* <span>{gahshomariWeekday}</span>
            <span className='mx-1'>-</span>
            <span>{finalDay}</span>
          
            <span className='mx-1'>-</span>
            <span className='mx-1'>{'سال'}</span>
            <span className='mx-1'> {year}</span>
            <span className='mx-1'>{gahshomariName}</span> */}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          padding: '10px 0',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          color: 'white',
          zIndex: 10,
          textShadow: '2px 2px 5px rgba(0.2, 0.2, 0.2, 0.7)',
        }}
      >
        <div className='flex justify-between pl-3'>
          <Link
            className='pt-2'
            href={{
              pathname: 'https://gahshomar.com/',
            }}
          >
            <svg
              id='Component_1_14'
              data-name='Component 1 – 14'
              xmlns='http://www.w3.org/2000/svg'
              width='20.883'
              height='22.902'
              viewBox='0 0 20.883 22.902'
              fill='currentColor'
            >
              <defs>
                <clipPath id='clipPath'>
                  <rect
                    id='Rectangle_7'
                    data-name='Rectangle 7'
                    width='20.883'
                    height='22.902'
                  />
                </clipPath>
              </defs>
              <g id='Group_16' data-name='Group 16' clipPath='url(#clipPath)'>
                <path
                  id='Path_100'
                  data-name='Path 100'
                  d='M15.4,22.9H5.479A5.484,5.484,0,0,1,0,17.423V9.558A5.46,5.46,0,0,1,2,5.327L6.961,1.245a5.487,5.487,0,0,1,6.961,0l4.963,4.082a5.46,5.46,0,0,1,2,4.231v7.865A5.484,5.484,0,0,1,15.4,22.9M10.442,1.526a3.943,3.943,0,0,0-2.51.9L2.968,6.506a3.939,3.939,0,0,0-1.44,3.052v7.865a3.955,3.955,0,0,0,3.951,3.951H15.4a3.955,3.955,0,0,0,3.951-3.951V9.558a3.939,3.939,0,0,0-1.44-3.052L12.952,2.424a3.943,3.943,0,0,0-2.51-.9'
                  transform='translate(0 0)'
                  fill='currentColor'
                />
                <path
                  id='Path_101'
                  data-name='Path 101'
                  d='M13.683,33.828a.764.764,0,0,1-.764-.764V25.657a2.434,2.434,0,0,1,2.431-2.431h2.337a2.434,2.434,0,0,1,2.431,2.431v2.87a.764.764,0,1,1-1.527,0v-2.87a.905.905,0,0,0-.9-.9H15.35a.905.905,0,0,0-.9.9v7.407a.764.764,0,0,1-.764.764'
                  transform='translate(-6.077 -10.926)'
                  fill='currentColor'
                />
              </g>
            </svg>
            {/* بازگشت */}
          </Link>
          <button disabled={!loaded} onClick={goLeft}>
            &lt; Previous
          </button>
          <button disabled={!loaded} onClick={goRight}>
            Next &gt;
          </button>
          <button
            className='pr-3 pt-2'
            onClick={downloadScreenshot}
            disabled={!loaded}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='69.08'
              height='64.481'
              viewBox='0 0 69.08 64.481'
            >
              {/* SVG content */}
            </svg>
            <p className='pt-2'>بارگزاری</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnlyPage />
    </Suspense>
  );
}
