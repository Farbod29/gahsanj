// page.tsx => download image with HTML text
'use client';
import React, { useRef } from 'react';
import { useScreenshot, createFileName } from 'use-react-screenshot';

export default function Page() {
  const ref = useRef(null);
  const [image, takeScreenShot] = useScreenshot({
    type: 'image/jpeg',
    quality: 1.0,
  });

  const download = (
    image: string,
    { name = 'download', extension = 'jpg' } = {}
  ) => {
    const a = document.createElement('a');
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => {
    if (ref.current) {
      takeScreenShot(ref.current).then(download);
    } else {
      console.error('Ref is not attached to a DOM element.');
    }
  };

  return (
    <div>
      <button onClick={downloadScreenshot}>Download screenshot</button>
      <div
        ref={ref}
        style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}
      >
        Hello {/* Additional HTML content */}
      </div>
    </div>
  );
}
