"use client";
import React, { useState, useEffect } from 'react';
import BillCard from '../components/BillCard';
import Link from 'next/link';

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
}

const YourBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/bills/user');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bills');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(event.target.value);
  };

  const filteredBills = bills.filter((bill) =>
    statusFilter === 'all' ? true : bill.status.toLowerCase() === statusFilter
  );

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-gray-700">Loading your bills...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg max-w-md">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-mono font-bold text-gray-700">Error Loading Bills</h2>
            <p className="text-gray-700 text-center">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#FADA5E] hover:bg-[#fa8c5e] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black mt-4"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-teal-500 pt-16">
      <h1 className="text-4xl font-serif font-bold text-white my-8">Your Bills</h1>
      
      <div className="mb-8">
        <label htmlFor="statusFilter" className="text-white font-bold mr-4">Filter by Status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={handleFilterChange}
          className="bg-white text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="reserved">Reserved</option>
          <option value="processing">Processing</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredBills.length === 0 ? (
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <p className="text-2xl font-mono font-bold text-gray-700">No bills found</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4 lg:px-16">
          {filteredBills.map((bill) => (
            <div className="flex-shrink-0 w-full sm:w-[30%] lg:w-[30%] mx-2" key={bill.id}>
              <BillCard
                billNumber={bill.id}
                status={bill.status}
                value={bill.amount}
                currency={bill.currency}
                dueDate={bill.dueDate}
              />
            </div>
          ))}
        </div>
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
