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
import Home from '../../../public/assets/home.svg';
import Calendar from '../../../public/assets/calendar.svg';
import GoLeftIcon from '@/components/AISvgsIcon/GoLeftSvg';
import GoRightIcon from '@/components/AISvgsIcon/GoRightSvg';
import DownloadSVG from '@/components/AISvgsIcon/DownloadSvg';

function decodeHtmlEntities(text) {
  // Check if window is defined to ensure this runs in a client environment
  if (typeof window !== 'undefined') {
    const element = document.createElement('div');
    if (text) {
      element.innerHTML = text;
    }
    return element.innerText || element.textContent;
  }
  return text; // Return the original text if not on client side
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
    setDisplayedAdditionalText((prev) => prev + '\n' + additionalText); // Add the new text to the displayed output
    setAdditionalText(''); // Clear the input field after the addition
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setDisplayedAdditionalText((prev) => prev + '\n' + additionalText);
      setAdditionalText(''); // Clear the input after pressing Enter
    }
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
        console.log('Fetching category:', gahshomariName);
        console.log('Encoded category:', encodeURIComponent(gahshomariName));
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
    <div className='flex flex-col h-screen justify-between bg-blue-950'>
      <div
        ref={ref}
        className='flex-grow relative'
        style={{
          width: '100%',
          height: 'auto',
          padding: '18px',
          paddingTop: '0.1vh',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100% - 2rem)',
          backgroundColor: '#373D70',
          // border: '3px solid gray',
          paddingBottom: '100px',
        }}
      >
        <p className='text-center text-white font-size-12 font-weight-bold pb-3'>
          می توانید بنز زیر را دریافت و در استوری اینستاگرام استفاده کنید
        </p>
        {!loaded && <div className='spinner'></div>}
        <Image
          src={images[currentIndex] || '/assets/AImedia/general/base.jpg'}
          alt='Default image description'
          layout='responsive'
          width={700}
          height={525}
          objectFit='contain'
          priority={true} // This ensures the image loads first
          loading='eager' // Disables lazy loading for immediate load
          onLoad={handleLoad}
        />
        <div
          className='text-white text-shadow-lg'
          style={{
            position: 'absolute',
            top: '15%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', // Ensures horizontal center alignment
            justifyContent: 'center',
            textAlign: 'center', // Centers the text itself
            fontSize: '18px',
            zIndex: 2,
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)', // Shadow to enhance readability
          }}
        >
          <p>{decodeHtmlEntities(line1)}</p>
          <p>{decodeHtmlEntities(line2)}</p>
          <p style={{ whiteSpace: 'pre-line' }}>
            {decodeHtmlEntities(displayedAdditionalText)}
          </p>
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
          src={images[currentIndex] || '/assets/AImedia/general/base.jpg'}
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
              <div
                dir='rtl'
                className='text-center'
                style={{ textAlign: 'center', lineHeight: '2' }}
              >
                <span>{decodeHtmlEntities(line1)}</span>
              </div>
              <div
                dir='rtl'
                className='text-center '
                style={{ textAlign: 'center', lineHeight: '2' }}
              >
                <span className='inline-block mx-2'>
                  {decodeHtmlEntities(line2)}
                </span>
              </div>
              <div
                dir='rtl'
                className='text-center '
                style={{ textAlign: 'center', lineHeight: '2' }}
              >
                {' '}
                {/* Added lineHeight */}
                <span
                  className='inline-block mx-2'
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {decodeHtmlEntities(displayedAdditionalText)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='fixed bottom-0 w-full bg-[#373D70] text-white shadow-2xl '>
        <div className='flex flex-col sm:flex-row justify-center items-center p-5 shadow-2xl'>
          <div className='sm:hidden mb-4 flex items-center justify-center pb-3'>
            <textarea
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)} // Allow user input to update
              dir='rtl'
              placeholder='پیوست  نوشته'
              className='px-2 py-1 rounded-md text-black'
              rows={2} // Make the textarea larger
            />
            <button
              onClick={handleAddLine}
              className='ml-2 px-3 py-1 bg-white text-[#373D70] rounded-md'
            >
              +
            </button>
          </div>
          <div className='flex justify-center items-center gap-2'>
            <Link className='mx-4' href='/'>
              <Home width={39.046} height={23.726} />
            </Link>
            <Link className='mx-4' href='/PhoneAppGahshomar'>
              <Calendar width={39.046} height={23.726} />
            </Link>
            <button className='mx-4' disabled={!loaded} onClick={goLeft}>
              <GoLeftIcon />
            </button>
            <button className='mx-4' disabled={!loaded} onClick={goRight}>
              <GoRightIcon />
            </button>
            <button
              className='mx-5'
              onClick={downloadScreenshot}
              disabled={!loaded}
            >
              <DownloadSVG />
            </button>
          </div>
          <div className='hidden sm:flex items-center sm:mb-0 mb-4'>
            <textarea
              value={additionalText}
              onChange={(e) => setAdditionalText(e.target.value)}
              onKeyPress={handleKeyPress} // Handle Enter keypress to add a new line
              placeholder='متن اضافه'
              className='px-2 py-1 rounded-md text-black'
              rows={3} // Making the input area bigger
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