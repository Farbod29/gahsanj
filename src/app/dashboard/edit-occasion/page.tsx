'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const ImageUpload = ({
  onUpload,
  label,
  buttonLabel = 'بارگذاری',
}: {
  onUpload: (url: string) => void;
  label: string;
  buttonLabel?: string;
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file) return;

      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.url) {
          onUpload(data.url);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) await uploadFile(file);
    },
    [uploadFile]
  );

  return (
    <div className='mb-4 text-right'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>

      <div className='mb-4 flex justify-center'>
        <input
          type='file'
          id='file-upload'
          onChange={handleUpload}
          accept='image/*'
          className='hidden'
          disabled={uploading}
        />
        <label
          htmlFor='file-upload'
          className='cursor-pointer px-8 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2'
        >
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12'
            />
          </svg>
          {uploading ? 'در حال بارگذاری...' : buttonLabel}
        </label>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className='flex flex-col items-center justify-center space-y-4'>
          <div className='text-center'>
            <svg
              className='mx-auto h-12 w-12 text-gray-400'
              stroke='currentColor'
              fill='none'
              viewBox='0 0 48 48'
              aria-hidden='true'
            >
              <path
                d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <p className='mt-1 text-sm text-gray-600'>
              یا فایل را به اینجا بکشید و رها کنید
            </p>
          </div>
        </div>
      </div>

      {uploading && (
        <p className='mt-2 text-sm text-gray-500 text-center'>
          در حال بارگذاری...
        </p>
      )}
    </div>
  );
};

const UrlInput = ({ url, label }: { url: string; label: string }) => {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      alert('لینک کپی شد!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className='mb-4 text-right'>
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
      <div className='flex gap-2'>
        <input
          type='text'
          value={url}
          readOnly
          className='flex-1 p-2 border rounded-md bg-gray-50'
        />
        <button
          type='button'
          onClick={copyToClipboard}
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
        >
          کپی
        </button>
      </div>
    </div>
  );
};

export default function EditOccasion() {
  const [logoUrl, setLogoUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const params = useParams();
  const id = params?.id;

  return (
    <div className='max-w-4xl mx-auto p-4'>
      <h2 className='text-xl font-bold mb-6 text-right'>ویرایش مناسبت</h2>
      <form className='space-y-6'>
        <div className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              عنوان کامل
            </label>
            <input
              type='text'
              className='w-full p-2 border rounded-md'
              placeholder='عنوان کامل را وارد کنید'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              عنوان کوتاه
            </label>
            <input
              type='text'
              className='w-full p-2 border rounded-md'
              placeholder='عنوان کوتاه را وارد کنید'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            {/* ... existing date fields ... */}
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              لینک لوگو
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={logoUrl}
                className='flex-1 p-2 border rounded-md'
                placeholder='آدرس تصویر را وارد کنید'
                readOnly
              />
              <ImageUpload
                onUpload={setLogoUrl}
                label=''
                buttonLabel='بارگذاری'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              لینک تصویر مدال
            </label>
            <div className='flex gap-2'>
              <input
                type='text'
                value={imageUrl}
                className='flex-1 p-2 border rounded-md'
                placeholder='آدرس تصویر مدال را وارد کنید'
                readOnly
              />
              <ImageUpload
                onUpload={setImageUrl}
                label=''
                buttonLabel='بارگذاری'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-right mb-1'>
              متن
            </label>
            <textarea
              className='w-full p-2 border rounded-md'
              rows={4}
              placeholder='متن را وارد کنید'
            />
          </div>
        </div>

        <div className='flex justify-end gap-4 mt-6'>
          <button
            type='submit'
            className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
          >
            ذخیره تغییرات
          </button>
          <button
            type='button'
            className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
}
