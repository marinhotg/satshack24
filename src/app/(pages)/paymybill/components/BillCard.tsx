import React from 'react';

const BillCard: React.FC<{ billNumber: number; status: string; onMoreInfo: () => void }> = ({
  billNumber,
  status,
  onMoreInfo,
}) => {
  const statusColor = status === 'payed' ? 'bg-green-300' : 'bg-red-300';

  return (
    <div className="bg-[#FFFAA0] w-[20vw] p-4 rounded-lg border-2 border-black shadow-lg text-center">
      <h2 className="text-2xl font-serif font-bold text-gray-700 mb-4">Bill {billNumber}</h2>

      <div
        className={`${statusColor} inline-block px-4 py-2 rounded-lg border-2 border-black text-gray-700 font-mono font-bold mb-4`}
      >
        status: {status}
      </div>

      <div className="mt-4">
        <button
          onClick={onMoreInfo}
          className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black"
        >
          more info
        </button>
      </div>
    </div>
  );
};

export default BillCard;