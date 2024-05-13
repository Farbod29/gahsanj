// import { useRouter } from 'next/router';
// import { useCallback, useEffect, useState } from 'react';

// function useNavigation() {
//   const router = useRouter();
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (router.isReady) {
//       setIsReady(true);
//     }
//   }, [router.isReady]);

//   const navigateToImageDownloader = useCallback(
//     (year, weekday) => {
//       if (isReady) {
//         router.push({
//           pathname: '/image-downloader',
//           query: { year, weekday },
//         });
//       } else {
//         console.error('Router not ready');
//       }
//     },
//     [isReady, router]
//   );

//   return navigateToImageDownloader;
// }

// export default useNavigation;
