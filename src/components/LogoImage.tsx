import Image from 'next/image';
import { useState, useEffect } from 'react';
// import defaultLogo from '../public/gahsanjFav/apple-touch-icon.png';
import defaultLogo from '../../public/gahsanjFav/apple-touch-icon.png';

interface LogoImageProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
}

export default function LogoImage({
  src,
  alt,
  size = 40,
  className = 'rounded-full object-cover',
}: LogoImageProps) {
  const [imageExists, setImageExists] = useState(false);
  const [imageSrc, setImageSrc] = useState(defaultLogo);

  useEffect(() => {
    if (!src) {
      setImageExists(false);
      setImageSrc(defaultLogo);
      return;
    }

    const checkImage = async (url: string) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) {
          setImageExists(true);
          setImageSrc(url);
        } else {
          setImageExists(false);
          setImageSrc(defaultLogo);
        }
      } catch (error) {
        setImageExists(false);
        setImageSrc(defaultLogo);
      }
    };

    checkImage(src);
  }, [src]);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={size}
      height={size}
      className={className}
      onError={() => {
        setImageExists(false);
        setImageSrc(defaultLogo);
      }}
      priority
    />
  );
}
