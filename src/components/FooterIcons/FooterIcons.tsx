// src/components/Icon.tsx
type IconProps = {
  name: string;
  className?: string;
};

const Icon = ({ name, className = "" }: IconProps) => {
  switch (name) {
    case "home":
      return (
        <svg
          className={className}
          id="Component_1_14"
          data-name="Component 1 – 14"
          xmlns="http://www.w3.org/2000/svg"
          width="20.883"
          height="22.902"
          viewBox="0 0 20.883 22.902"
          fill="currentColor"
        >
          <defs>
            <clipPath id="clip-path">
              <rect
                id="Rectangle_7"
                data-name="Rectangle 7"
                width="20.883"
                height="22.902"
                fill="#fff"
              />
            </clipPath>
          </defs>
          <g id="Group_16" data-name="Group 16" clipPath="url(#clip-path)">
            <path
              id="Path_100"
              data-name="Path 100"
              d="M15.4,22.9H5.479A5.484,5.484,0,0,1,0,17.423V9.558A5.46,5.46,0,0,1,2,5.327L6.961,1.245a5.487,5.487,0,0,1,6.961,0l4.963,4.082a5.46,5.46,0,0,1,2,4.231v7.865A5.484,5.484,0,0,1,15.4,22.9M10.442,1.526a3.943,3.943,0,0,0-2.51.9L2.968,6.506a3.939,3.939,0,0,0-1.44,3.052v7.865a3.955,3.955,0,0,0,3.951,3.951H15.4a3.955,3.955,0,0,0,3.951-3.951V9.558a3.939,3.939,0,0,0-1.44-3.052L12.952,2.424a3.943,3.943,0,0,0-2.51-.9"
              transform="translate(0 0)"
              fill="currentColor"
            />
            <path
              id="Path_101"
              data-name="Path 101"
              d="M13.683,33.828a.764.764,0,0,1-.764-.764V25.657a2.434,2.434,0,0,1,2.431-2.431h2.337a2.434,2.434,0,0,1,2.431,2.431v2.87a.764.764,0,1,1-1.527,0v-2.87a.905.905,0,0,0-.9-.9H15.35a.905.905,0,0,0-.9.9v7.407a.764.764,0,0,1-.764.764"
              transform="translate(-6.077 -10.926)"
              fill="currentColor"
            />
          </g>
        </svg>
      );
    case "calendar":
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V10h14v11zm0-13H5V5h14v3z" />
        </svg>
      );
    case "FarakhorMobileDark":
      return (
        <svg
          className={className}
          id="Layer_1"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 500 500"
          fill="currentColor"
        >
          <defs>
            <clipPath id="clippath">
              <rect
                x="14.52"
                y="14.51"
                width="470.97"
                height="470.99"
                fill="none"
              />
            </clipPath>
          </defs>
          <g
            id="Component_11_1"
            data-name="Component 11 1"
            clipPath="url(#clippath)"
          >
            <g id="Group_10" data-name="Group 10">
              <path
                id="Path_88"
                data-name="Path 88"
                d="M250.01,485.47c-38.12-.01-76.13-3.89-113.47-11.58-55.61-11.37-99.07-54.82-110.45-110.43-15.45-74.86-15.45-152.09,0-226.95,11.38-55.61,54.84-99.06,110.45-110.43,74.85-15.45,152.08-15.45,226.93,0,55.61,11.37,99.07,54.82,110.45,110.43,15.45,74.86,15.45,152.09,0,226.95-11.37,55.6-54.83,99.05-110.43,110.43-37.33,7.69-75.35,11.57-113.47,11.58M360.79,460.71h0ZM250.01,41.43c-36.3.02-72.51,3.71-108.06,11.03-45.03,9.19-80.24,44.36-89.48,89.38-14.7,71.29-14.7,144.84,0,216.13,9.22,45.05,44.43,80.26,89.48,89.48,71.29,14.7,144.84,14.7,216.13,0,45.05-9.21,80.25-44.43,89.46-89.48,14.71-71.29,14.71-144.84,0-216.13-9.2-45.06-44.4-80.27-89.46-89.48-35.56-7.31-71.78-11.01-108.08-11.03"
                fill="currentColor"
              />
              <path
                id="Path_89"
                data-name="Path 89"
                d="M137.22,376.24c-7.43,0-13.46-6.01-13.46-13.44,0-1.65.3-3.29.9-4.84l62.64-162.94c1.36-3.56,4.17-6.37,7.72-7.74l162.94-62.64c6.95-2.66,14.74.82,17.39,7.77,1.18,3.1,1.18,6.52,0,9.62l-62.62,162.92c-1.37,3.56-4.18,6.38-7.74,7.74l-162.94,62.64c-1.54.59-3.18.89-4.83.88M210.29,210.24l-49.64,129.09,129.09-49.64,49.64-129.09-129.09,49.64ZM300.16,300.13h0Z"
                fill="currentColor"
              />
              <path
                id="Path_90"
                data-name="Path 90"
                d="M244.98,268.48c-7.43,0-13.46-6.01-13.47-13.44,0-3.58,1.42-7.02,3.96-9.54l10.04-10.04c5.38-5.14,13.91-4.95,19.05.43,4.98,5.21,4.98,13.42-.01,18.63l-10.06,10.04c-2.52,2.52-5.94,3.94-9.51,3.94"
                fill="currentColor"
              />
            </g>
          </g>
        </svg>
      );
    case "contact":
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 8V7l-3 2-2-2 2-2h-1l-2 2-2-2-2 2-2-2-2 2-2-2-3 3v1l2 2-2 2v1l3-3 2 2 2-2 2 2 2-2 2 2 2-2 3 3v-1l-2-2 2-2zM12 13c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      );
    case "profile":
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Icon;
