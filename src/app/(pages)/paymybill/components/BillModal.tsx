import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  billNumber: string;
  value: number;
  address: string;
  onWithdraw: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, billNumber, value, address, onWithdraw }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Bill Details</h2>
          <button
            className="bg-white w-[3vw] text-black hover:bg-gray-200 font-semibold py-2 px-4 rounded-full"
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        <div className="mt-4">
          <div className="mb-2">
            <span className="font-semibold">Bill Number: </span>
            <span>{billNumber}</span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Value: </span>
            <span>{value} </span>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Address: </span>
            <span>{address}</span>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
            onClick={onWithdraw}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;