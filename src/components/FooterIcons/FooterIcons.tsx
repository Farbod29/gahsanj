// src/components/Icon.tsx

import { usePathname } from 'next/navigation';
import Image from 'next/image';
import pictureAISefid from '../../../public/pictureAI.svg';
import pictureAINareji from '../../../public/pictureAiNarenji.svg';

type IconProps = {
  name: string;
  className?: string;
};

const Icon = ({ name, className = '' }: IconProps) => {
  const pathname = usePathname();
  switch (name) {
    case 'home':
      return (
        <svg
          className={className}
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
      );
    case 'calendar':
      return (
        <svg
          className={className}
          xmlns='http://www.w3.org/2000/svg'
          width='21.819'
          height='22.902'
          viewBox='0 0 21.819 22.902'
          fill='currentColor'
        >
          <defs>
            <clipPath id='clipPath'>
              <rect
                id='Rectangle_3'
                data-name='Rectangle 3'
                width='21.819'
                height='22.902'
              />
            </clipPath>
          </defs>
          <g id='Group_8' data-name='Group 8' clipPath='url(#clipPath)'>
            <path
              id='Path_82'
              data-name='Path 82'
              d='M10.91,23.914a26.05,26.05,0,0,1-5.248-.536A6.574,6.574,0,0,1,.536,18.252a25.969,25.969,0,0,1,0-10.495A6.575,6.575,0,0,1,5.662,2.631a25.953,25.953,0,0,1,10.5,0,6.576,6.576,0,0,1,5.126,5.126,25.987,25.987,0,0,1,0,10.495,6.575,6.575,0,0,1-5.127,5.126,26.041,26.041,0,0,1-5.247.536m0-20.51a24.746,24.746,0,0,0-4.984.509A5.268,5.268,0,0,0,1.818,8.02a24.664,24.664,0,0,0,0,9.969A5.268,5.268,0,0,0,5.925,22.1a24.664,24.664,0,0,0,9.969,0h0A5.268,5.268,0,0,0,20,17.989,24.664,24.664,0,0,0,20,8.02a5.268,5.268,0,0,0-4.107-4.107A24.755,24.755,0,0,0,10.91,3.4'
              transform='translate(0 -1.012)'
            />
            <path
              id='Path_83'
              data-name='Path 83'
              d='M21.131,13.348H1.665a.654.654,0,0,1,0-1.309H21.131a.654.654,0,1,1,0,1.309'
              transform='translate(-0.488 -5.817)'
            />
            <path
              id='Path_84'
              data-name='Path 84'
              d='M20.835,23.244h-.611a.611.611,0,1,1,0-1.223h.611a.611.611,0,1,1,0,1.223m-4.279,0h-.611a.611.611,0,1,1,0-1.223h.611a.611.611,0,1,1,0,1.223m-4.28,0h-.611a.611.611,0,1,1,0-1.223h.611a.611.611,0,1,1,0,1.223'
              transform='translate(-5.34 -10.64)'
            />
            <path
              id='Path_85'
              data-name='Path 85'
              d='M20.835,31.222h-.611a.611.611,0,0,1,0-1.223h.611a.611.611,0,0,1,0,1.223m-4.279,0h-.611a.611.611,0,1,1,0-1.223h.611a.611.611,0,0,1,0,1.223m-4.28,0h-.611a.611.611,0,0,1,0-1.223h.611a.611.611,0,0,1,0,1.223'
              transform='translate(-5.34 -14.495)'
            />
            <path
              id='Path_86'
              data-name='Path 86'
              d='M28.777,4.016a.654.654,0,0,1-.654-.654V.748a.654.654,0,0,1,1.309,0V3.361a.654.654,0,0,1-.654.654'
              transform='translate(-13.588 -0.046)'
            />
            <path
              id='Path_87'
              data-name='Path 87'
              d='M12.215,3.921a.654.654,0,0,1-.654-.654V.654a.654.654,0,0,1,1.309,0V3.267a.654.654,0,0,1-.654.654'
              transform='translate(-5.586 0)'
            />
          </g>
        </svg>
      );
    case 'FarakhorMobileDark':
      return (
        <svg
          className={className}
          id='Layer_1'
          data-name='Layer 1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 500 500'
          fill='currentColor'
        >
          <defs>
            <clipPath id='clippath'>
              <rect
                x='14.52'
                y='14.51'
                width='470.97'
                height='470.99'
                fill='none'
              />
            </clipPath>
          </defs>
          <g
            id='Component_11_1'
            data-name='Component 11 1'
            clipPath='url(#clippath)'
          >
            <g id='Group_10' data-name='Group 10'>
              <path
                id='Path_88'
                data-name='Path 88'
                d='M250.01,485.47c-38.12-.01-76.13-3.89-113.47-11.58-55.61-11.37-99.07-54.82-110.45-110.43-15.45-74.86-15.45-152.09,0-226.95,11.38-55.61,54.84-99.06,110.45-110.43,74.85-15.45,152.08-15.45,226.93,0,55.61,11.37,99.07,54.82,110.45,110.43,15.45,74.86,15.45,152.09,0,226.95-11.37,55.6-54.83,99.05-110.43,110.43-37.33,7.69-75.35,11.57-113.47,11.58M360.79,460.71h0ZM250.01,41.43c-36.3.02-72.51,3.71-108.06,11.03-45.03,9.19-80.24,44.36-89.48,89.38-14.7,71.29-14.7,144.84,0,216.13,9.22,45.05,44.43,80.26,89.48,89.48,71.29,14.7,144.84,14.7,216.13,0,45.05-9.21,80.25-44.43,89.46-89.48,14.71-71.29,14.71-144.84,0-216.13-9.2-45.06-44.4-80.27-89.46-89.48-35.56-7.31-71.78-11.01-108.08-11.03'
                fill='currentColor'
              />
              <path
                id='Path_89'
                data-name='Path 89'
                d='M137.22,376.24c-7.43,0-13.46-6.01-13.46-13.44,0-1.65.3-3.29.9-4.84l62.64-162.94c1.36-3.56,4.17-6.37,7.72-7.74l162.94-62.64c6.95-2.66,14.74.82,17.39,7.77,1.18,3.1,1.18,6.52,0,9.62l-62.62,162.92c-1.37,3.56-4.18,6.38-7.74,7.74l-162.94,62.64c-1.54.59-3.18.89-4.83.88M210.29,210.24l-49.64,129.09,129.09-49.64,49.64-129.09-129.09,49.64ZM300.16,300.13h0Z'
                fill='currentColor'
              />
              <path
                id='Path_90'
                data-name='Path 90'
                d='M244.98,268.48c-7.43,0-13.46-6.01-13.47-13.44,0-3.58,1.42-7.02,3.96-9.54l10.04-10.04c5.38-5.14,13.91-4.95,19.05.43,4.98,5.21,4.98,13.42-.01,18.63l-10.06,10.04c-2.52,2.52-5.94,3.94-9.51,3.94'
                fill='currentColor'
              />
            </g>
          </g>
        </svg>
      );
    case 'ExtraTools':
      return (
        <svg
          className={className}
          id='Component_13_12'
          data-name='Component 13 – 12'
          xmlns='http://www.w3.org/2000/svg'
          width='22.934'
          height='22.934'
          viewBox='0 0 22.934 22.934'
          fill='currentColor'
        >
          <defs>
            <clipPath id='clipPath'>
              <rect
                id='Rectangle_6'
                data-name='Rectangle 6'
                width='22.934'
                height='22.934'
                fill='none'
              />
            </clipPath>
          </defs>
          <g id='Group_14' data-name='Group 14' clipPath='url(#clipPath)'>
            <path
              id='Path_95'
              data-name='Path 95'
              d='M11.467,22.934a27.434,27.434,0,0,1-5.525-.564A6.9,6.9,0,0,1,.564,16.993a27.346,27.346,0,0,1,0-11.051A6.9,6.9,0,0,1,5.942.564a27.344,27.344,0,0,1,11.051,0,.649.649,0,0,1,.332.179L22.192,5.61a.656.656,0,0,1,.179.332,27.362,27.362,0,0,1,0,11.051,6.9,6.9,0,0,1-5.378,5.378,27.443,27.443,0,0,1-5.526.564m0-21.623a26.175,26.175,0,0,0-5.262.537A5.589,5.589,0,0,0,1.848,6.2a26.055,26.055,0,0,0,0,10.524,5.591,5.591,0,0,0,4.357,4.357,26.074,26.074,0,0,0,10.524,0,5.589,5.589,0,0,0,4.356-4.357A26.046,26.046,0,0,0,21.125,6.4L16.538,1.81a26.143,26.143,0,0,0-5.071-.5'
              transform='translate(0 0)'
            />
            <path
              id='Path_96'
              data-name='Path 96'
              d='M36.113,8h-2.9a3.2,3.2,0,0,1-3.2-3.2V1.9a.656.656,0,0,1,1.311,0V4.8A1.89,1.89,0,0,0,33.21,6.687h2.9a.655.655,0,1,1,0,1.311'
              transform='translate(-14.477 -0.598)'
            />
            <path
              id='Path_97'
              data-name='Path 97'
              d='M21.9,31.234H11.476a.655.655,0,1,1,0-1.311H21.9a.655.655,0,0,1,0,1.311'
              transform='translate(-5.22 -14.434)'
            />
            <path
              id='Path_98'
              data-name='Path 98'
              d='M21.9,22.2H11.476a.655.655,0,1,1,0-1.311H21.9a.655.655,0,0,1,0,1.311'
              transform='translate(-5.22 -10.075)'
            />
            <path
              id='Path_99'
              data-name='Path 99'
              d='M15.133,13.162H11.476a.655.655,0,1,1,0-1.311h3.656a.655.655,0,1,1,0,1.311'
              transform='translate(-5.22 -5.717)'
            />
          </g>
        </svg>
      );
      // case 'AiGenerator':
      return pathname === '/AiGenerator' ? (
        <div className='mb-1'>
          <Image
            src={pictureAINareji.src || '/pictureAiNarenji.svg'}
            alt='AI Generator Active'
            width={24}
            height={24}
          />
        </div>
      ) : (
        <div className='mb-1'>
          <Image
            src={pictureAISefid.src || '/pictureAI.svg'}
            alt='AI Generator'
            width={24}
            height={24}
          />
        </div>
      );
    default:
      return null;
  }
};

export default Icon;
