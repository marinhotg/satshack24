"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StarRating from '@/src/app/(pages)/paymybill/components/StarRating'; // Importa o componente de classificação


interface Bill {
  id: number;
  amount: number;
  paymentType: string;
  currency: string;
  dueDate: string;
  bonusRate: number;
  status: string;
  uploader: {
    name: string;
  };
  reservedUntil?: string;
}

const BillWithdrawPage = () => {
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0); // Estado para o rating

  const getIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; 
    return parseInt(id, 10); 
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      const id = getIdFromUrl();
      try {
        const response = await fetch(`/api/bills/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bill details');
        }
        const data = await response.json();
        setBill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillDetails();
  }, []);



  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-teal-900">Loading bill details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-teal-900">Error Loading Bill</h2>
            <p className="text-teal-800 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">Bill not found</h2>
        </div>
      </div>
    );
  }

  const finalValue = bill.amount * (1 + bill.bonusRate / 100);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white mb-4">Bill Withdraw</h1>
      
      <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-96 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-teal-900 mb-2">Bill ID: {bill.id}</h2>
        <p className="text-lg text-teal-800">Value: {bill.amount.toFixed(2)} {bill.currency}</p>
        <p className="text-lg text-teal-800">Payment Type: {bill.paymentType}</p>
        <p className="text-lg text-teal-800">Bonus Rate: {bill.bonusRate.toFixed(2)}%</p>
        <p className="text-lg text-teal-800">Final Value with Bonus: {finalValue.toFixed(2)} {bill.currency}</p>


        {/* Rating e estrelas centralizadas */}
        <div className="flex flex-col items-center mt-10">
          <p className="text-2xl font-bold text-teal-900 mb-2">Rate the Service:</p>
          <StarRating rating={rating} onRatingChange={handleRatingChange} />
          <p className="text-lg text-teal-800">Rating: {rating} star{rating !== 1 ? 's' : ''}</p>
        </div>

        <button className="w-full bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400 mt-6">
          Send Review
        </button>
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/withdraw">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BillWithdrawPage;
