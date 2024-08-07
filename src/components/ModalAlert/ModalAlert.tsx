import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalAlert: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div
        className='fixed inset-0 bg-black opacity-50'
        onClick={onClose}
      ></div>
      <div className='bg-white p-4 rounded shadow-lg z-10 max-w-sm mx-auto'>
        <button className='absolute top-2 right-2 font-bold' onClick={onClose}>
          &times;
        </button>
        <div className='text-[15px] '>{children}</div>
      </div>
    </div>
  );
};

export default ModalAlert;
