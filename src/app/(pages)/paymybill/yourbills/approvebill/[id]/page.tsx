"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface ApproveBillProps {
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

const ApproveBill: React.FC<ApproveBillProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isApproving, setIsApproving] = useState(false);
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

  const handleApprove = async () => {
    if (!id) return;
    setIsApproving(true);
    try {
      const response = await fetch(`/api/bills/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId: 'dummy-invoice', approvalHash: 'dummy-hash' })
      });
      if (!response.ok) throw new Error('Failed to approve bill');

      alert('Bill approved successfully!');
      setBill((prevBill) => (prevBill ? { ...prevBill, status: 'APPROVED' } : prevBill));
    } catch (err) {
      console.error('Failed to approve bill:', err);
      alert('Failed to approve bill. Please try again.');
    } finally {
      setIsApproving(false);
    }
  };

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
      <h1 className="text-4xl font-serif font-bold text-white my-8">Approve Bill - Bill ID: {id}</h1>

      <div className="bg-[#FFFAA0] w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black">
        {bill ? (
          <>
            <p className="mb-3">
              <span className="font-bold">Amount:</span> {bill.amount} {bill.currency}
            </p>
            <p className="mb-3">
              <span className="font-bold">Bonus Rate:</span> {bill.bonusRate}%
            </p>

            <button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full bg-yellow-400 text-black font-mono font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? 'Approving...' : 'Approve Bill'}
            </button>
          </>
        ) : (
          <p>Loading bill details...</p>
        )}
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/paymybill/yourbills">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ApproveBill;
