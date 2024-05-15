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
  const gahshomariName = searchParams.get('paramName') || 'No Name';
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const gahshomariWeekday = searchParams.get('PersianWeekday') || 'No Weekday';
  const gahshomariMonth = searchParams.get('PersianMonth') || 'No Month';

  const ref = useRef(null);
  const screenshotRef = useRef(null);

  const [isScreenshotMode, setIsScreenshotMode] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setLoaded(false); // Reset load state to trigger reload
      setTimeout(handleLoad, 100); // Use handleLoad to set loaded to true
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleLoad]);

  // Fetching images from the JSON hosted on GitHub
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/images?category=${encodeURIComponent(gahshomariName)}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        if (data && data.images) {
          const validImages = data.images
            .map((item) => item.url)
            .filter(
              (url) => url.startsWith('http://') || url.startsWith('https://')
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
      html2canvas(screenshotRef.current, { scale: 1 }).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'screenshot.png';
        link.click();
      });
    } else {
      console.error('Screenshot ref is not attached or image not loaded');
    }
  }, []);

  const goLeft = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const goRight = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  return (
    <div className="flex flex-col h-screen justify-between">
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
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            zIndex: 2,
            whiteSpace: 'nowrap', // Add this line
          }}
        >
          <span> -{gahshomariDates}</span>
          <span> -{gahshomariMonth}</span>
          <span> -{gahshomariWeekday}</span>
          <span> /{gahshomariName}</span>
        </div>
      </div>
      {/* ==============Offscreen div for screenshot ================*/}
      <div
        ref={screenshotRef}
        style={{
          position: 'absolute',
          left: '-9999px', // Place it offscreen
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
            top: '7%', // Keeps the top boundary starting from 10% of the parent element's height
            left: '50%', // Centers horizontally
            transform: 'translate(-50%, -20%)', // Increase the negative translate Y value to move text higher
          }}
          className="absolute flex justify-center text-white text-5xl z-2 whitespace-nowrap"
        >
          <span> - {gahshomariDates}</span>
          <span> - {gahshomariMonth}</span>
          <span> - {gahshomariWeekday}</span>
          <span> / {gahshomariName}</span>
        </div>
      </div>

      {/* ==============Offscreen div for screenshot ================*/}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          textAlign: 'center',
          padding: '10px 0',
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black background
          color: 'white',
          zIndex: 10,
        }}
      >
        <div className="flex justify-between pl-3 ">
          <Link
            className="pt-2"
            href={{
              pathname: '/PhoneAppGahshomar',
            }}

            // className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out z-50 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="59.83"
              height="59.83"
              viewBox="0 0 59.83 59.83"
            >
              <g
                id="Group_26"
                data-name="Group 26"
                transform="translate(0 -9.585)"
              >
                <g
                  id="Home_icon"
                  data-name="Home icon"
                  transform="translate(0 9.585)"
                  fill="#c2f3ff"
                >
                  <path stroke="none" />
                  <path stroke="none" fill="#465677" />
                </g>
                <path
                  id="Path_311"
                  data-name="Path 311"
                  transform="translate(57.342 10.919) rotate(90)"
                  fill="#465677"
                />
              </g>
            </svg>
            <p className="pt-2"></p>
            بازگشت
          </Link>
          <button
            disabled={!loaded}
            // className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out z-50 self-start"
          >
            <svg
              id="Image_Navigation_icon"
              data-name="Image Navigation icon"
              xmlns="http://www.w3.org/2000/svg"
              width="144"
              height="79"
              viewBox="0 0 144 79"
            >
              <g
                onClick={goRight}
                id="Polygon_1"
                data-name="Polygon 1"
                transform="translate(144) rotate(90)"
                fill="#c3f3ff"
              >
                <path stroke="none" />
                <path d="" stroke="none" fill="#465677" />
              </g>
              <g
                onClick={goLeft}
                transform="translate(0 79) rotate(-90)"
                fill="#c3f3ff"
                style={{ cursor: 'pointer' }} // Add cursor pointer for usability
                id="Polygon_2"
                data-name="Polygon 2"
              >
                <path d="" stroke="none" />
                <path d="" stroke="none" fill="#465677" />
              </g>
              <button onClick={goLeft} disabled={!loaded}>
                &lt; Previous
              </button>
              <button onClick={goRight} disabled={!loaded}>
                Next &gt;
              </button>
            </svg>
            دگرگونی فرتور
          </button>
          <button
            className="pr-3 pt-2"
            onClick={downloadScreenshot}
            disabled={!loaded}
            // className="bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out z-50 self-start"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="69.08"
              height="64.481"
              viewBox="0 0 69.08 64.481"
            >
              <g
                id="Download_icon"
                data-name="Download icon"
                transform="translate(-1 -2.001)"
              >
                <path
                  id="Path_56"
                  data-name="Path 56"
                  transform="translate(6.104 2.144)"
                  fill="#c3f3ff"
                />
                <path
                  id="Path_58"
                  data-name="Path 58"
                  transform="translate(0 0)"
                  fill="#465677"
                />
              </g>
            </svg>
            <p className="pt-2">بارگزاری</p>
          </button>
        </div>

        {/* <p className="text-xxxxs">© 2024 گاهشمار. All rights reserved.</p> */}
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
