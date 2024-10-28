"use client";
import React, { useEffect, useState } from 'react';
import { getCurrencyList } from '@/src/app/(pages)/paymybill/components/currencyList';
import Link from 'next/link';

interface ChangeBillProps {
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

const ChangeBill: React.FC<ChangeBillProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>('BRL');
  const [dueDate, setDueDate] = useState<string>('');
  const [bonusRate, setBonusRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currencyList = getCurrencyList();

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
        setAmount(data.amount);
        setCurrency(data.currency);
        setDueDate(new Date(data.dueDate).toISOString().split('T')[0]);
        setBonusRate(data.bonusRate);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillDetails();
  }, [id]);

  const handleSaveChanges = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      const response = await fetch(`/api/bills/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PENDING' })
      });
      if (!response.ok) throw new Error('Failed to save changes');
      
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Failed to save changes:', err);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-teal-900">Loading bill details...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bill) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">
            {error || 'Bill not found'}
          </h2>
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
      <h1 className="text-4xl font-serif font-bold text-white my-8">Change Bill - Bill ID: {id}</h1>

      <div className="bg-[#FFFAA0] w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black">
        <div className="mb-3">
          <label className="block font-bold mb-1">Bonus Rate:</label>
          <input
            type="number"
            value={bonusRate}
            onChange={(e) => setBonusRate(Number(e.target.value))}
            className="border border-gray-300 p-1 rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Value:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border border-gray-300 p-1 rounded w-full"
          />
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full"
          >
            {currencyList.map(({ code, name }) => (
              <option key={code} value={code}>
                {name || code}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block font-bold mb-1">Due Date:</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-300 p-1 rounded w-full"
          />
        </div>

        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/yourbills">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ChangeBill;
