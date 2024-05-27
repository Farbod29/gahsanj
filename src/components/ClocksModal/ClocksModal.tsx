import ClocksPage from '@/app/ClocksPageMobile/page';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClocksModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-[#333863] bg-opacity-50 '>
      <div className=' bg-[#333863] p-4 rounded shadow-lg relative flex flex-col max-h-[90vh] w-full max-w-4xl bg-opacity-70'>
        <button
          className='absolute top-2 right-2 text-white text-2xl'
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className='text-center text-2xl text-white mb-4'>ساعت های جهانی</h2>
        <div className='flex-1 overflow-y-auto'>
          <ClocksPage />
        </div>
        <button
          className='mt-4 w-full py-2 bg-[#FD821D] text-white rounded-lg'
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </div>
  );
};

export default ClocksModal;
