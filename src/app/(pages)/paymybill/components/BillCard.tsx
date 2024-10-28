import React from 'react';
import Link from 'next/link';

interface BillCardProps {
  billNumber: number;
  status: string;
  value: number;
  currency: string;
  dueDate: string;
}

const BillCard: React.FC<BillCardProps> = ({
  billNumber,
  status,
  value,
  currency,
  dueDate,
}) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-300';
      case 'pending':
        return 'bg-orange-300';
      case 'reserved':
        return 'bg-red-300';
      case 'wait payment':
        return 'bg-yellow-300';
      default:
        return 'bg-gray-300';
    }
  };

  const formattedDate = new Date(dueDate).toLocaleDateString();

  const renderActionButton = () => {
    switch (status.toLowerCase()) {
      case 'pending':
        return (
          <Link href={`yourbills/billcontrol/${billNumber}`}>
            <button className="bg-[#FADA5E] hover:bg-[#fa8c5e] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
              Change the Bill
            </button>
          </Link>
        );
      case 'reserved':
        return (
          <button
            className="bg-gray-300 text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black cursor-not-allowed"
            disabled
          >
            Wait the Paid
          </button>
        );
      case 'paid':
        return (
          <Link href={`yourbills/refoundbill/${billNumber}`}>
            <button className="bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
              Make the Refound
            </button>
          </Link>
        );
      case 'expired':
      case 'completed':
        return (
          <button className="bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Finish
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="bg-[#FFFAA0] w-full max-w-[300px] sm:max-w-[40vw] md:max-w-[30vw] lg:max-w-[20vw] p-4 rounded-lg border-2 border-black shadow-lg text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-700 mb-4">Bill {billNumber}</h2>

        <div
          className={`${getStatusColor()} inline-block px-4 py-2 rounded-lg border-2 border-black text-gray-700 font-mono font-bold mb-4`}
        >
          Status: {status}
        </div>

        <div className="mb-2">
          <span className="font-bold">Value:</span> {value.toFixed(2)} {currency}
        </div>
        <div className="mb-2">
          <span className="font-bold">Due Date:</span> {formattedDate}
        </div>

        <div className="mt-4">{renderActionButton()}</div>
      </div>
    </div>
  );
};

export default BillCard;
