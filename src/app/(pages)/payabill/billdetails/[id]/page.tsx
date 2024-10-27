"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Defina um tipo para as informações da conta
interface BillInfo {
  id: number;
  value: number;
  address: string;
  currency: string;  // Moeda
  dueDate: string;    // Data de vencimento
  bonusRate: number;  // Taxa de bônus
}

// Defina os dados das contas localmente
const bills: BillInfo[] = [
    { id: 1, value: 1.23, currency: 'BRL', dueDate: '01/01/1111', bonusRate: 5, address: '0x123...' },
    { id: 2, value: 4.56, currency: 'USD', dueDate: '02/02/2222', bonusRate: 10, address: '0x456...' },
    { id: 3, value: 7.89, currency: 'EUR', dueDate: '03/03/3333', bonusRate: 7, address: '0x789...' },
    { id: 4, value: 0.99, currency: 'BRL', dueDate: '04/04/4444', bonusRate: 3, address: 'Bc1qxy2kgdtv8vg80v0c725p5d0c0xgjuy9p9q6hp6' },
];

const BillDetailsPage = () => {
  const [billInfo, setBillInfo] = useState<BillInfo | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);

  const getIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; 
    return parseInt(id, 10); 
  };

  useEffect(() => {
    const id = getIdFromUrl(); 
    const foundBill = bills.find(bill => bill.id === id); 
    setBillInfo(foundBill || null); 
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleUpload = () => {
    if (receipt) {
      console.log('Comprovante enviado:', receipt);
    } else {
      alert('Por favor, anexe um comprovante.');
    }
  };

  if (!billInfo) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white mb-4">Bill Details</h1>
      
      <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-96">
        <h2 className="text-2xl font-bold text-teal-900 mb-2">Bill ID: {billInfo.id}</h2>
        <p className="text-lg text-teal-800">Value: {billInfo.value.toFixed(2)} {billInfo.currency}</p>
        <p className="text-lg text-teal-800">Address: {billInfo.address}</p>
        <p className="text-lg text-teal-800">Due Date: {billInfo.dueDate}</p>
        <p className="text-lg text-teal-800">Bonus Rate: {billInfo.bonusRate.toFixed(2)}%</p>

        <div className="flex flex-col items-center space-y-2 mt-4">
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="w-40 h-12 bg-[#FFD700] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold text-center py-2 px-4 rounded-lg border-2 border-black cursor-pointer flex items-center justify-center"
          >
            Imput receipt
          </label>
          {receipt && (
            <span className="text-gray-700 font-mono">{receipt.name}</span>
          )}
        </div>
      <button
        onClick={handleUpload}
        className="bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400 mt-4"
      >
        Send receipt
      </button>

      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/payabill">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Voltar
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BillDetailsPage;
