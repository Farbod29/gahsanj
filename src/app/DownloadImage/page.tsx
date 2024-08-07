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
import ArrowLeft from '../../../public/assets/ArrowLeft.svg';
import ArrowRight from '../../../public/assets/ArrowRight.svg';
import DownloadIcon from '../../../public/assets/DownloadIcon.svg';
import Home from '../../../public/assets/home.svg';
import Calendar from '../../../public/assets/calendar.svg';

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
  const line1 = searchParams.get('line1') || 'No Line 1';
  const line2 = searchParams.get('line2') || 'No Line 2';
  const gahshomariName = searchParams.get('paramName') || 'No Name';
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [additionalText, setAdditionalText] = useState(''); // Add state for additional text
  const [displayedAdditionalText, setDisplayedAdditionalText] = useState(''); // State for the displayed additional text
  const gahshomariWeekday = searchParams.get('PersianWeekday') || 'No Weekday';
  const gahshomariMonth = searchParams.get('PersianMonth') || 'No Month';
  const paramDates = searchParams.get('paramDates') || 'No Month';
  const [year, day] = gahshomariDates.split('/');
  const ref = useRef(null);
  const screenshotRef = useRef<HTMLDivElement | null>(null);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleAddLine = () => {
    setDisplayedAdditionalText(additionalText); // Update the displayed text when the button is clicked
  };

  function getPersianDayNumber(date = new Date()) {
    const jDate = jalaali.toJalaali(date);
    return jDate.jd; // This returns the day number in the Persian calendar
  }

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
    <div className='flex flex-col h-screen justify-between'>
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
          alt='دوباره تلاش کن! '
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
            <div dir='rtl' className='text-center '>
              <span>{decodeHtmlEntities(displayedAdditionalText)}</span>
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
          alt='دوباره تلاش کن! '
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
              <div dir='rtl' className='text-center '>
                <span className='inline-block mx-2'>
                  {decodeHtmlEntities(displayedAdditionalText)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed bottom-0 w-full bg-[#373D70] text-white'>
        <div className='flex flex-col sm:flex-row justify-center items-center p-4'>
          <div className='sm:hidden mb-4 flex items-center justify-center'>
            <input
              type='text'
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder='متن جدید'
              className='px-2 py-1 rounded-md text-black'
            />
            <button
              onClick={handleAddLine}
              className='ml-2 px-3 py-1 bg-white text-[#373D70] rounded-md'
            >
              +
            </button>
          </div>
          <div className='flex justify-center items-center'>
            <Link className='mx-4' href='/'>
              <Home width={39.046} height={23.726} />
            </Link>
            <Link className='mx-4' href='/PhoneAppGahshomar'>
              <Calendar width={39.046} height={23.726} />
            </Link>
            <button className='mx-4' disabled={!loaded} onClick={goLeft}>
              <ArrowLeft width={39.046} height={23.726} />
            </button>
            <button className='mx-4' disabled={!loaded} onClick={goRight}>
              <ArrowRight width={39.046} height={23.726} />
            </button>
            <button
              className='mx-4'
              onClick={downloadScreenshot}
              disabled={!loaded}
            >
              <DownloadIcon width={39.046} height={23.726} />
            </button>
          </div>
          <div className='hidden sm:flex items-center sm:mb-0 mb-4'>
            <input
              type='text'
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              placeholder='متن جدید'
              className='px-2 py-1 rounded-md text-black'
            />
            <button
              onClick={handleAddLine}
              className='ml-2 px-3 py-1 bg-white text-[#373D70] rounded-md'
            >
              +
            </button>
          </div>
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