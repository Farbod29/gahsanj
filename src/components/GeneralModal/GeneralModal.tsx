import React from 'react';
import Image from 'next/image';

const GeneralModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='bg-[#7F84B4] p- rounded shadow-lg relative w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className='absolute top-4 right-4 text-3xl text-black'
          onClick={onClose}
        >
          &times;
        </button>
        <div className='flex flex-col items-center justify-start mt-4'>
          <Image
            src={'/assets/LogoMobile.png'}
            alt='گاه شمار'
            width={150}
            height={150}
          />
        </div>
        <div className='mb-8 text-center'>
          {typeof children === 'string' ? (
            <div>
              <h2 className='text-center text-white mb-4 mt-8'>
                این بخش به زودی راه می‌افتد
              </h2>
              <p className='text-white'>{children}</p>
            </div>
          ) : (
            children
          )}
        </div>
        <div className='flex justify-center'>
          <button
            className='mt-1 py-2  mb-4 px-8 bg-[#FF8200] text-white rounded-lg'
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneralModal;
