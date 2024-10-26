"use client";
import React, { useState } from 'react';
import BillCard from '../components/BillCard';
import Modal from '../components/BillModal';
import Link from 'next/link';


const YourBills = () => {
  //mock bills
  const [bills] = useState([
    { id: 1, status: 'payed', value: 2.5, address: '0x123...' },
    { id: 2, status: 'unpaid', value: 1.0, address: '0x456...' },
    { id: 3, status: 'payed', value: 3.7, address: '0x789...' },
    { id: 4, status: 'unpaid', value: 0.9, address: '0xabc...' },
  ]);

  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleMoreInfo = (billId: number) => {
    setSelectedBill(billId);
    setModalOpen(true);
  };

  const handleWithdraw = () => {
    alert('Withdraw action initiated!');
    setModalOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const selectedBillDetails = bills.find((bill) => bill.id === selectedBill);

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white my-4">Your Bills</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-6xl">
        {bills.map((bill) => (
          <BillCard
            key={bill.id}
            billNumber={bill.id}
            status={bill.status}
            onMoreInfo={() => handleMoreInfo(bill.id)}
          />
        ))}
      </div>

      {selectedBillDetails && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          billNumber={selectedBillDetails.id.toString()}
          value={selectedBillDetails.value}
          address={selectedBillDetails.address}
          onWithdraw={handleWithdraw}
        />
      )}
      <div className="fixed bottom-4 left-4">
        <Link href="/paymybill">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
    
  );
};

export default YourBills;