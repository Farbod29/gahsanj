import Image from 'next/image';
import { useState, useEffect } from 'react';
// import defaultLogo from '../public/gahsanjFav/apple-touch-icon.png';
import appleIcon from '../../public/favicon/apple-touch-icon.png';

interface LogoImageProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  onClear?: () => void;
  showClearButton?: boolean;
}

export default function LogoImage({
  src,
  alt,
  size = 40,
  className = 'rounded-full object-cover',
  onClear,
  showClearButton = false,
}: LogoImageProps) {
  const [imageExists, setImageExists] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(appleIcon.src);

  useEffect(() => {
    // اگر src خالی یا undefined باشد، مستقیماً از defaultLogo استفاده می‌کنیم
    if (!src?.trim()) {
      setImageExists(false);
      setImageSrc(appleIcon.src);
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
          setImageSrc(appleIcon.src);
        }
      } catch (error) {
        setImageExists(false);
        setImageSrc(appleIcon.src);
      }
    };

    checkImage(src);
  }, [src]);

  // مطمئن می‌شویم که همیشه یک مقدار معتبر داریم
  const validSrc = imageSrc || appleIcon.src;

  return (
    <div className='relative'>
      <Image
        src={validSrc}
        alt={alt}
        width={size}
        height={size}
        className={className}
        onError={() => {
          setImageExists(false);
          setImageSrc(appleIcon.src);
        }}
        priority
      />
      {showClearButton && onClear && (
        <button
          onClick={onClear}
          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
          type='button'
        >
          ×
        </button>
      )}
    </div>
  );
}
