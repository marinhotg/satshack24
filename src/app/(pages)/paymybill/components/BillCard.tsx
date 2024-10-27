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
  const statusColor = status === 'payed' ? 'bg-green-300' : 'bg-red-300';

  return (
    <div className="bg-[#FFFAA0] w-[20vw] p-4 rounded-lg border-2 border-black shadow-lg text-center mx-auto">
      <h2 className="text-2xl font-serif font-bold text-gray-700 mb-4">Bill {billNumber}</h2>

      <div
        className={`${statusColor} inline-block px-4 py-2 rounded-lg border-2 border-black text-gray-700 font-mono font-bold mb-4`}
      >
        Status: {status}
      </div>

      {/* Display the remaining information */}
      <div className="mb-2">
        <span className="font-bold">Value:</span> {value} {currency}
      </div>
      <div className="mb-2">
        <span className="font-bold">Due Date:</span> {dueDate}
      </div>

      <Link href={`yourbills/billcontrol/${billNumber}`}>
        <button className="bg-[#FADA5E] hover:bg-[#fa8c5e] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
          Select Bill
        </button>
      </Link>
    </div>
  );
};

export default BillCard;
