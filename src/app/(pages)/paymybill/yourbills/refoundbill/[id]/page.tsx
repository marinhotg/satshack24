"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface RefoundBillProps {
  params: Promise<{ id: string }>;
}

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  status: string;
}

const RefoundBill: React.FC<RefoundBillProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    const fetchBillDetails = async () => {
      if (!id) return;

      try {
        const response = await fetch(`/api/bills/${id}`);
        if (!response.ok) throw new Error('Failed to fetch bill details');
        
        const data = await response.json();
        setBill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill details');
      }
    };

    fetchBillDetails();
  }, [id]);

  const handleRefound = async () => {
    if (!id) return;
    setIsPaying(true);
    try {
      const response = await fetch(`/api/bills/${id}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: 'dummy-invoice', refoundHash: 'dummy-hash' })
      });
      if (!response.ok) throw new Error('Failed to process refound');
      
      alert('Refound processed successfully!');
      setBill((prevBill) => (prevBill ? { ...prevBill, status: 'COMPLETED' } : prevBill));
    } catch (err) {
      console.error('Failed to process refound:', err);
      alert('Failed to process refound. Please try again.');
    } finally {
      setIsPaying(false);
    }
  };

  const calculatedAmount = bill ? bill.amount * (1 + bill.bonusRate / 100) : 0;

  if (error) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">{error}</h2>
          <Link href="/yourbills">
            <button className="mt-4 bg-[#FADA5E] hover:bg-[#fa8c5e] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
              Back to Your Bills
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-screen bg-teal-500 pt-16">
      <h1 className="text-4xl font-serif font-bold text-white my-8">Make Refound - Bill ID: {id}</h1>

      <div className="bg-[#FFFAA0] w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black">
        {bill ? (
          <>
            <p className="mb-3">
              <span className="font-bold">Amount:</span> {bill.amount} {bill.currency}
            </p>
            <p className="mb-3">
              <span className="font-bold">Bonus Rate:</span> {bill.bonusRate}%
            </p>

            <p className="mb-5">
              <span className="font-bold">Total Amount to Pay:</span> {calculatedAmount.toFixed(2)} {bill.currency}
            </p>

            <button
              onClick={handleRefound}
              disabled={isPaying}
              className="w-full bg-blue-400 hover:bg-green-600 text-black font-mono font-bold py-2 px-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? 'Processing...' : 'Make Refound'}
            </button>
          </>
        ) : (
          <p>Loading bill details...</p>
        )}
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/paymybill/yourbills/">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default RefoundBill;
