// src/components/Modal.tsx
import ClocksPage from '@/app/ClocksPageMobile/page';
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ClocksModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button className="absolute top-2 right-2 text-black" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-center text-black"> ساعت های جهانی
      </h2>
      <ClocksPage />
        <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded" onClick={onClose}>
          بستن
        </button>
      </div>
    </div>
  );
};

export default ClocksModal;
