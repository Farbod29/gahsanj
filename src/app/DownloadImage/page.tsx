'use client'; // This directive ensures the component executes client-side only
import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  Suspense,
} from 'react';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import { useSearchParams } from 'next/navigation'; // Ensures this is used client-side
import Link from 'next/link';

function ClientOnlyPage() {
  const searchParams = useSearchParams() as unknown as URLSearchParams;
  const gahshomariDates = searchParams.get('paramDates') || 'No Date';
  console.log('xxxxxxxxxxxxx');

  const gahshomariName = searchParams.get('paramName') || 'No Name';
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const gahshomariWeekday = searchParams.get('PersianWeekday') || 'No Weekday';
  const gahshomariMonth = searchParams.get('PersianMonth') || 'No Month';
  const [year, day] = gahshomariDates.split('/');
  const ref = useRef(null);
  const screenshotRef = useRef<HTMLDivElement | null>(null);

  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  // let day = '۲۳';
  let sanitizedDay = '۲۳';

  // Step 2: Split the day into two parts
  const dayParts = sanitizedDay.split('');

  // Step 3: Build the final day string based on the conditions
  let finalDay = '';
  if (dayParts.length === 2) {
    if (dayParts[0] !== '۰') {
      finalDay = dayParts.join('');
    } else {
      finalDay = dayParts[1];
    }
  } else {
    finalDay = sanitizedDay;
  }
  // console.log('xxxxxxxxxxxxx');
  // console.log(sanitizedDay);
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
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = 'screenshot.png';
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
    <div className="flex flex-col h-screen justify-between ">
      <div
        ref={ref}
        className="flex-grow relative"
        style={{
          width: '100%',
          height: 'auto',
          minHeight: 'calc(100% - 2rem)',
          objectFit: 'cover',
        }}
      >
        {!loaded && <div className="spinner"></div>}
        <Image
          src={
            images[currentIndex] ||
            'https://www.imgonline.com.ua/examples/color_palette_3.jpg'
          }
          alt="Decorative background"
          layout="fill"
          objectFit="cover"
          onLoad={handleLoad}
        />
        <div
          className="drop-shadow-lg text-cyan-600 "
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
          <div className="rtl flex flex-row-reverse">
            <span>{gahshomariWeekday}</span>
            <span className="mx-1">-</span>
            <span>{finalDay}</span>
            <span className="mx-1">{gahshomariMonth}</span>
            <span className="mx-1">-</span>
            <span className="mx-1">{'سال'}</span>
            <span className="mx-1"> {year}</span>
            <span className="mx-1">{gahshomariName}</span>
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
          alt="Decorative background"
          layout="fill"
          objectFit="cover"
          onLoad={handleLoad}
        />
        <div
          style={{
            top: '7%',
            left: '50%',
            transform: 'translate(-50%, -20%)',
            textShadow: '2px 2px 5px rgba(0.2, 0.2, 0.2, 0.7)',
          }}
          className="absolute flex justify-center text-white text-5xl z-2 whitespace-nowrap"
        >
          <div className="rtl flex flex-row-reverse">
            <span>{gahshomariWeekday}</span>
            <span className="mx-1">-</span>
            <span>{day}</span>
            <span>{gahshomariMonth}</span>
            <span className="mx-1">-</span>
            <span>{'سال'}</span>
            <span>{year}</span>
            <span className="mx-1"></span>
            <span>{gahshomariName}</span>
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
        <div className="flex justify-between pl-3">
          <Link
            className="pt-2"
            href={{
              pathname: 'https://gahshomar.com/',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="59.83"
              height="59.83"
              viewBox="0 0 59.83 59.83"
            >
              {/* SVG content */}
            </svg>
            بازگشت
          </Link>
          <button disabled={!loaded} onClick={goLeft}>
            &lt; Previous
          </button>
          <button disabled={!loaded} onClick={goRight}>
            Next &gt;
          </button>
          <button
            className="pr-3 pt-2"
            onClick={downloadScreenshot}
            disabled={!loaded}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="69.08"
              height="64.481"
              viewBox="0 0 69.08 64.481"
            >
              {/* SVG content */}
            </svg>
            <p className="pt-2">بارگزاری</p>
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
