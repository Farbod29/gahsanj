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

  // Fetching images from the backend API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(
          `/api/ImagesAI/${encodeURIComponent(
            gahshomariName
          )}?activeDates=${encodeURIComponent(gahshomariDates)}&order=1`
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
  }, [gahshomariName, gahshomariDates]);

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
              pathname: 'https://gahshomar.com/',
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="59.83"
              height="59.83"
              viewBox="0 0 59.83 59.83"
            >
              <defs>
                <clipPath id="clip-path">
                  <rect
                    id="Rectangle_18"
                    data-name="Rectangle 18"
                    width="39.529"
                    height="44.576"
                    transform="translate(49 -24)"
                    fill="none"
                  />
                </clipPath>
              </defs>
              <g
                id="Group_30"
                data-name="Group 30"
                transform="translate(-27.85 18.628)"
              >
                <g
                  id="Group_27"
                  data-name="Group 27"
                  transform="translate(-10 11)"
                  clip-path="url(#clip-path)"
                >
                  <path
                    id="Path_312"
                    data-name="Path 312"
                    d="M18.016.826.826,19.6H5.154V36.252h9.268v-8.9h7.186v8.9h9.268V19.6h4.329Z"
                    transform="translate(49.749 -19.964)"
                    fill="#c3f3ff"
                    stroke="#c3f3ff"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1"
                  />
                </g>
              </g>
              <g
                id="Group_31"
                data-name="Group 31"
                transform="translate(0 -9.585)"
              >
                <g
                  id="Home_icon"
                  data-name="Home icon"
                  transform="translate(0 9.585)"
                  fill="none"
                >
                  <path
                    d="M19,0H40.83a19,19,0,0,1,19,19V40.83a19,19,0,0,1-19,19H19a19,19,0,0,1-19-19V19A19,19,0,0,1,19,0Z"
                    stroke="none"
                  />
                  <path
                    d="M 19 5 C 15.26046371459961 5 11.7447509765625 6.456249237060547 9.100502014160156 9.100502014160156 C 6.456249237060547 11.7447509765625 5 15.26046371459961 5 19 L 5 40.83000183105469 C 5 44.56953811645508 6.456249237060547 48.08525085449219 9.100502014160156 50.72949981689453 C 11.7447509765625 53.37374877929688 15.26046371459961 54.83000183105469 19 54.83000183105469 L 40.83000183105469 54.83000183105469 C 44.56953811645508 54.83000183105469 48.08525085449219 53.37374877929688 50.72949981689453 50.72949981689453 C 53.37374877929688 48.08525085449219 54.83000183105469 44.56953811645508 54.83000183105469 40.83000183105469 L 54.83000183105469 19 C 54.83000183105469 15.26046371459961 53.37374877929688 11.7447509765625 50.72949981689453 9.100502014160156 C 48.08525085449219 6.456249237060547 44.56953811645508 5 40.83000183105469 5 L 19 5 M 19 0 L 40.83000183105469 0 C 51.32341384887695 0 59.83000183105469 8.506587982177734 59.83000183105469 19 L 59.83000183105469 40.83000183105469 C 59.83000183105469 51.32341384887695 51.32341384887695 59.83000183105469 40.83000183105469 59.83000183105469 L 19 59.83000183105469 C 8.506587982177734 59.83000183105469 0 51.32341384887695 0 40.83000183105469 L 0 19 C 0 8.506587982177734 8.506587982177734 0 19 0 Z"
                    stroke="none"
                    fill="#465677"
                  />
                </g>
              </g>
            </svg>
            بازگشت
          </Link>
          <button disabled={!loaded}>
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
                <path
                  d="M 58.30325698852539 66.50000762939453 L 20.69674491882324 66.50000762939453 C 17.26959991455078 66.50000762939453 14.19726657867432 64.72994995117188 12.47824478149414 61.76510238647461 C 10.75922203063965 58.80025863647461 10.74945545196533 55.2545166015625 12.45212268829346 52.28025054931641 L 31.25536727905273 19.43405914306641 C 32.96888732910156 16.44082641601562 36.05098724365234 14.65381526947021 39.5 14.65381526947021 C 42.94900131225586 14.65381526947021 46.03110122680664 16.44082641601562 47.74463272094727 19.43405914306641 L 66.54787445068359 52.28025054931641 C 68.25054168701172 55.2545166015625 68.24077606201172 58.80025863647461 66.52175903320312 61.76510238647461 C 64.80274200439453 64.72994995117188 61.73040008544922 66.50000762939453 58.30325698852539 66.50000762939453 Z"
                  stroke="none"
                />
                <path
                  d="M 39.4999885559082 17.15380477905273 C 38.28761291503906 17.15380477905273 37.10069274902344 17.45767211914062 36.06753158569336 18.03253936767578 C 34.96802520751953 18.64432525634766 34.07896041870117 19.53373718261719 33.42499923706055 20.67609786987305 L 14.62174987792969 53.52228546142578 C 13.97185516357422 54.65753936767578 13.65513610839844 55.86761474609375 13.68035888671875 57.11892700195312 C 13.70406341552734 58.29509735107422 14.0362548828125 59.46810913085938 14.64099884033203 60.51113891601562 C 15.24576187133789 61.55416488647461 16.09872055053711 62.42521667480469 17.10768127441406 63.03013610839844 C 18.18109512329102 63.67369842529297 19.38862609863281 64 20.69674682617188 64 L 58.30325317382812 64 C 59.61135864257812 64 60.81889343261719 63.67369842529297 61.89231872558594 63.03013610839844 C 62.90127944946289 62.42521667480469 63.75424194335938 61.55416488647461 64.35898590087891 60.51112365722656 C 64.9637451171875 59.46809768676758 65.29593658447266 58.29509768676758 65.31964111328125 57.11892700195312 C 65.34486389160156 55.86761474609375 65.02813720703125 54.65753936767578 64.37824249267578 53.52228546142578 L 45.57498550415039 20.67609786987305 C 44.92102813720703 19.53373718261719 44.03195953369141 18.64432525634766 42.93245315551758 18.03253936767578 C 41.8992919921875 17.45767211914062 40.71236038208008 17.15380477905273 39.4999885559082 17.15380477905273 M 39.49999237060547 12.15380859375 C 43.55490875244141 12.15380859375 47.60982513427734 14.16654205322266 49.91426849365234 18.1920166015625 L 68.71752166748047 51.03820419311523 C 73.29718780517578 59.03812408447266 67.52127838134766 69 58.30325317382812 69 L 20.69674682617188 69 C 11.47870635986328 69 5.702812194824219 59.03812408447266 10.28246307373047 51.03820419311523 L 29.08572006225586 18.1920166015625 C 31.39015960693359 14.16654205322266 35.44507598876953 12.15380859375 39.49999237060547 12.15380859375 Z"
                  stroke="none"
                  fill="#465677"
                />
              </g>
              <g
                onClick={goLeft}
                transform="translate(0 79) rotate(-90)"
                fill="#c3f3ff"
                style={{ cursor: 'pointer' }} // Add cursor pointer for usability
                id="Polygon_2"
                data-name="Polygon 2"
              >
                <path
                  d="M 56.84225463867188 68.5 L 20.15774536132812 68.5 C 18.41312217712402 68.5 16.79034423828125 68.06375122070312 15.33447742462158 67.20336151123047 C 13.97280025482178 66.39865112304688 12.81792259216309 65.24235534667969 11.99470043182373 63.8594970703125 C 11.17147731781006 62.47663116455078 10.70551109313965 60.91022872924805 10.64718914031982 59.32962036132812 C 10.5848331451416 57.63967514038086 10.97488880157471 56.00517654418945 11.80652236938477 54.47151947021484 L 30.14877700805664 20.64553070068359 C 31.83681106567383 17.53252983093262 34.95876693725586 15.67401885986328 38.5 15.67401885986328 C 42.04122161865234 15.67401885986328 45.16317749023438 17.53252983093262 46.85122299194336 20.64554214477539 L 65.1934814453125 54.47151947021484 C 66.02510833740234 56.00517654418945 66.41516876220703 57.63967514038086 66.35281372070312 59.32962036132812 C 66.29448699951172 60.91022872924805 65.82852172851562 62.47663116455078 65.00530242919922 63.8594970703125 C 64.18207550048828 65.24235534667969 63.02719879150391 66.39865112304688 61.66552352905273 67.20336151123047 C 60.20965576171875 68.06375122070312 58.58687591552734 68.5 56.84225463867188 68.5 Z"
                  stroke="none"
                />
                <path
                  d="M 38.5 18.17401504516602 C 37.25942611694336 18.17401504516602 36.04941177368164 18.48997497558594 35.00077438354492 19.08776092529297 C 33.88341522216797 19.72470855712891 32.99038696289062 20.64976119995117 32.34646606445312 21.83724212646484 L 14.00419998168945 55.66323089599609 C 13.38877487182617 56.79818725585938 13.099853515625 58.0007209777832 13.14549255371094 59.2374267578125 C 13.18841171264648 60.40064239501953 13.53329467773438 61.55672073364258 14.14286804199219 62.58068084716797 C 14.75244140625 63.60464096069336 15.60430526733398 64.45890808105469 16.60639953613281 65.05111694335938 C 17.67181396484375 65.68074798583984 18.86666488647461 66 20.15774536132812 66 L 56.84225463867188 66 C 58.13333129882812 66 59.32818603515625 65.68074798583984 60.39360046386719 65.05111694335938 C 61.39569473266602 64.45890808105469 62.24755859375 63.60464096069336 62.85713195800781 62.58068084716797 C 63.46670532226562 61.55672073364258 63.81158447265625 60.40064239501953 63.85450744628906 59.23744201660156 C 63.90013122558594 58.0007209777832 63.61122894287109 56.79818725585938 62.99578857421875 55.66323089599609 L 44.65353393554688 21.83724212646484 C 44.00961303710938 20.64977645874023 43.11657333374023 19.72470855712891 41.99921417236328 19.08776092529297 C 40.95058822631836 18.48997497558594 39.74057388305664 18.17401504516602 38.5 18.17401504516602 M 38.5 13.17401885986328 C 42.63936996459961 13.17401885986328 46.77873992919922 15.26728820800781 49.04890441894531 19.45382690429688 L 67.39115905761719 53.27981567382812 C 71.72689056396484 61.27556228637695 65.93789672851562 71 56.84225463867188 71 L 20.15774536132812 71 C 11.06210327148438 71 5.273109436035156 61.27556228637695 9.60882568359375 53.27981567382812 L 27.95109176635742 19.45382690429688 C 30.22126007080078 15.26728820800781 34.36063003540039 13.17401885986328 38.5 13.17401885986328 Z"
                  stroke="none"
                  fill="#465677"
                />
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
                  d="M38.943,38.718l-6.62,6.62V11.887a2.887,2.887,0,1,0-5.774,0V45.338l-6.62-6.62A2.887,2.887,0,1,0,15.846,42.8L27.395,54.349c.026.026.061.035.087.058a2.887,2.887,0,0,0,.849.577h0a2.924,2.924,0,0,0,3.147-.635L43.026,42.8a2.887,2.887,0,1,0-4.083-4.083Z"
                  transform="translate(6.104 2.144)"
                  fill="#c3f3ff"
                />
                <path
                  id="Path_58"
                  data-name="Path 58"
                  d="M68.919,18.435a10.541,10.541,0,0,0-7.008-8.816,32.861,32.861,0,0,0-8.634-.712l-.021-.053a24.659,24.659,0,0,0-1.35-3.307,5.679,5.679,0,0,0-4.548-3.015,131.45,131.45,0,0,0-23.628,0,5.67,5.67,0,0,0-4.537,3.015,24.248,24.248,0,0,0-1.354,3.309l-.028.051A40.071,40.071,0,0,0,9.291,9.6,10.2,10.2,0,0,0,2.17,18.435a138.638,138.638,0,0,0,0,35.945,10.2,10.2,0,0,0,7.121,8.846,104.289,104.289,0,0,0,26.254,3.256A104.289,104.289,0,0,0,61.8,63.225a10.2,10.2,0,0,0,7.112-8.843,136.757,136.757,0,0,0,1.17-17.963,136.689,136.689,0,0,0-1.161-17.984ZM64.354,53.774a5.732,5.732,0,0,1-3.724,5,104.856,104.856,0,0,1-50.172,0,5.732,5.732,0,0,1-3.724-5,134.2,134.2,0,0,1,0-34.733,5.737,5.737,0,0,1,3.722-5,49.482,49.482,0,0,1,8.869-.527H21l.571-1.469c.216-.564.412-1.119.6-1.66a21.045,21.045,0,0,1,1.092-2.7,1.1,1.1,0,0,1,.884-.56,126.394,126.394,0,0,1,22.8,0,1.1,1.1,0,0,1,.884.56,20.551,20.551,0,0,1,1.089,2.7c.191.543.387,1.1.6,1.663l.564,1.446,1.55.023h1.527a32.665,32.665,0,0,1,7.369.5,5.944,5.944,0,0,1,3.818,5.032h0a132.285,132.285,0,0,1,1.128,17.367,132.264,132.264,0,0,1-1.128,17.367Z"
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
