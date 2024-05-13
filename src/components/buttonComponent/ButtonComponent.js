import React from 'react';
import { Link } from 'next/link'; // Assuming Next.js routing

function ButtonComponent() {
  const message = 'Hello'; // Your string variable

  const handleClick = () => {
    // Your click event logic here (e.g., navigation using Link component)
    return (
      <Link href={`/DownloadImageTest?message=${message}`}>
        Open DownloadImageTest
      </Link>
    );
  };

  return <button onClick={handleClick}>Open DownloadImageTest</button>;
}

export default ButtonComponent;
