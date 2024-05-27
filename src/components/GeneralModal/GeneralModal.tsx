// src/components/GeneralModal/GeneralModal.tsx
import React from 'react';
import Image from 'next/image';

const GeneralModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
  
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>

      <div className="bg-[#7F84B4] p-8 rounded shadow-lg relative w-4/5 max-w-lg" onClick={(e) => e.stopPropagation()}>
      <div className="flex flex-col items-center justify-start flex-grow mt-16">
       <Image
          src={'/assets/LogoMobile.png'}
          alt="گاه شمار"
          width={150} // Adjusted width for larger logo
          height={150} // Adjusted height for larger logo
          />
    </div>
        <button className="absolute top-4 right-4 text-3xl text-black" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-center text-black mb-4 mt-12">این بخش به زودی راه می‌افتد</h2>
        <div className="mb-8 text-center">
          {children}
        </div>
        <div className="flex justify-center">
          <button className="mt-4 py-2 px-8 bg-[#FF8200] text-white rounded-lg" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </div>

  );
};

export default GeneralModal;
