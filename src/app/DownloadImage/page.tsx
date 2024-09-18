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
  if (typeof window !== 'undefined') {
    const element = document.createElement('div');
    if (text) {
      element.innerHTML = text;
    }
    return element.innerText || element.textContent;
  }
  return text;
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
    if (additionalText.trim() !== '') {
      setDisplayedAdditionalText((prev) => prev + '\n' + additionalText); // Add the new text to the displayed output
      setAdditionalText(''); // Clear the input field after the addition
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submit on Enter
      setAdditionalText((prev) => prev + '\n'); // Add new line in textarea
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setLoaded(false);
      setTimeout(handleLoad, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleLoad]);

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
          const image = canvas.toDataURL('image/jpeg', 0.8);
          const link = document.createElement('a');
          link.href = image;
          link.download = 'screenshot.jpg';
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
          paddingBottom: '120px',
        }}
      >
        <p className='text-center text-white font-size-12 font-weight-bold pb-3'>
          می توانید بنز زیر را دریافت و در استوری اینستاگرام استفاده کنید
        </p>
        {!loaded && <div className='spinner'></div>}
        <Image
          className='top-32'
          src={images[currentIndex]}
          alt='Image description'
          layout='responsive'
          width={700}
          height={525}
          objectFit='contain'
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
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            zIndex: 2,
            whiteSpace: 'nowrap',
            textShadow: '2px 2px 5px rgba(0, 0, 0, 0.7)',
          }}
        >
          <p>{decodeHtmlEntities(line1)}</p>
          <p>{decodeHtmlEntities(line2)}</p>

          {/* Separate block for the appended text */}
          <div style={{ marginTop: '20px' }}>
            {' '}
            {/* Adjust the spacing as needed */}
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {decodeHtmlEntities(displayedAdditionalText)}
            </p>
          </div>
        </div>
      </div>

      <div className='fixed bottom-0 w-full bg-[#373D70] text-white shadow-2xl'>
        <div className='flex flex-col sm:flex-row justify-center items-center p-5 shadow-2xl'>
          <textarea
            value={additionalText}
            onChange={(e) => setAdditionalText(e.target.value)} // Allow user input to update
            onKeyPress={handleKeyPress}
            dir='rtl'
            placeholder='پیوست  نوشته'
            className='px-2 py-1 rounded-md text-black'
            rows={3}
            style={{ whiteSpace: 'pre-wrap' }}
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
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientOnlyPage />
    </Suspense>
  );
}