// src/components/Icon.tsx
type IconProps = {
  name: string;
  className?: string;
};

const Icon = ({ name, className = '' }: IconProps) => {
  switch (name) {
    case 'home':
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
    case 'calendar':
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
    case 'services':
      return (
        <svg
          className={className}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21 19v-2c0-1.1-.9-2-2-2h-3v-1c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v1H5c-1.1 0-2 .9-2 2v2H1v2h22v-2h-2zm-6-4v-2h2v2h-2zm-4 0v-2h2v2h-2zm-4 0v-2h2v2H7zm6-4V7h2v4h-2zm-4 0V7h2v4H9zm-4 0V7h2v4H5zm14-6h-4V3h4v2zm-6 0H9V3h4v2zM7 5H3V3h4v2zm-2 8h4v-2H5v2zm10 0h4v-2h-4v2z" />
        </svg>
      );
    case 'contact':
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
    case 'profile':
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
