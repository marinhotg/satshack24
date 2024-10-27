"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrencyList } from '../paymybill/components/currencyList';
import { useRouter } from 'next/navigation';

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  address: string;
  status: string;
  uploader: {
    name: string;
  };
}

const BillCard = ({
  billNumber,
  amount,
  currency,
  dueDate,
  bonusRate,
  onSelect,
}: {
  billNumber: number;
  amount: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  onSelect: () => void;
}) => {
  const formattedDate = new Date(dueDate).toLocaleDateString();
  
  return (
    <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 text-center shadow-md h-64 flex flex-col justify-between w-80">
      <div>
        <h2 className="text-3xl font-bold text-teal-900">Bill {billNumber}</h2>
        <p className="text-xl font-medium text-teal-800">Value: {amount} {currency}</p>
        <p className="text-lg text-teal-800">Due Date: {formattedDate}</p>
        <p className="text-lg text-teal-800">Bonus Rate: {bonusRate}%</p>
      </div>
      <button
        className="bg-green-300 text-teal-900 font-bold border border-black rounded-lg px-4 py-3 mt-4 hover:bg-green-400"
        onClick={onSelect}
      >
        Select
      </button>
    </div>
  );
};

const BillSelectionPage = () => {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currencyList = getCurrencyList();

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/bills/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch bills');
        }
        const data = await response.json();
        setBills(data);
        setFilteredBills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bills');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleReserveBill = async (billId: number) => {
    setIsReserving(true);
    try {
      const reservationTime = new Date();
      reservationTime.setMinutes(reservationTime.getMinutes() + 30);

      const response = await fetch('/api/bills/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId,
          reservationTime: reservationTime.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reserve bill');
      }

      router.push(`/payabill/billdetails/${billId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reserve bill');
      setSelectedBill(null);
    } finally {
      setIsReserving(false);
    }
  };

  const applyFilter = () => {
    const min = parseFloat(minValue) || 0;
    const max = parseFloat(maxValue) || Number.MAX_VALUE;
    const filtered = bills.filter((bill) => {
      const currencyMatch = selectedCurrency ? bill.currency === selectedCurrency : true;
      return bill.amount >= min && bill.amount <= max && currencyMatch;
    });
    setFilteredBills(filtered);
    setShowFilter(false);
  };

  const removeFilters = () => {
    setFilteredBills(bills);
    setMinValue('');
    setMaxValue('');
    setSelectedCurrency('');
    setShowFilter(false);
  };

  const handleSelectBill = (bill: Bill) => {
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setSelectedBill(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-teal-900">Loading bills...</h2>
            <p className="text-teal-800">Please wait while we fetch your bills</p>
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
            <h2 className="text-2xl font-mono font-bold text-teal-900">Error Loading Bills</h2>
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

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white my-4 text-center">That&apos;s on me!</h1>

      <div className="flex flex-col justify-center items-center mb-4 px-6 gap-4">
        <button
          className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </button>
      </div>

      <div className="flex justify-center mt-2 w-full px-6">
        <Link href="payabill/reservedbills">
          <button className="bg-[#a0d5ff] hover:bg-[#a0a6ff] text-gray-700 font-mono font-bold py-2 px-6 rounded-lg border-2 border-black w-full max-w-sm">
            Go to Reserved Bills
          </button>
        </Link>
      </div>

      {showFilter && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-custom">
          <div className="bg-yellow-200 border border-black p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold text-teal-900 mb-4">Filter Bills</h2>
            <div className="mb-2">
              <label htmlFor="minValue" className="block text-sm font-medium text-teal-900">Min Value</label>
              <input
                id="minValue"
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                className="border border-teal-700 p-2 w-full rounded-lg"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="maxValue" className="block text-sm font-medium text-teal-900">Max Value</label>
              <input
                id="maxValue"
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                className="border border-teal-700 p-2 w-full rounded-lg"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="currency" className="block text-sm font-medium text-teal-900">Select Currency</label>
              <select
                id="currency"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="border border-teal-700 p-2 w-full rounded-lg"
              >
                <option value="">All</option>
                {currencyList.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={applyFilter}
                className="bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400"
              >
                Apply
              </button>
              <button
                onClick={() => setShowFilter(false)}
                className="bg-red-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-red-400"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={removeFilters}
              className="bg-[#ADD8E6] text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 mt-4 w-full"
            >
              Remove Filters
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center items-center w-full px-6 mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 w-full max-w-5xl mx-auto justify-items-center">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              billNumber={bill.id}
              amount={bill.amount}
              currency={bill.currency}
              dueDate={bill.dueDate}
              bonusRate={bill.bonusRate}
              onSelect={() => handleSelectBill(bill)}
            />
          ))}
        </div>
      </div>

      {selectedBill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-custom">
          <div className="bg-yellow-200 border border-black p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold text-teal-900 mb-4">Bill Details</h2>
            <p className="text-lg text-teal-800">Bill ID: {selectedBill.id}</p>
            <p className="text-lg text-teal-800">Value: {selectedBill.amount} {selectedBill.currency}</p>
            <p className="text-lg text-teal-800">Due Date: {new Date(selectedBill.dueDate).toLocaleDateString()}</p>
            <p className="text-lg text-teal-800">Bonus Rate: {selectedBill.bonusRate}%</p>
            <p className="text-lg text-teal-800">Uploaded by: {selectedBill.uploader.name}</p>
            <button
              onClick={() => handleReserveBill(selectedBill.id)}
              disabled={isReserving}
              className={`bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400 mt-4 w-full ${
                isReserving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isReserving ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-teal-700 border-t-transparent"></div>
                  Reserving Bill...
                </div>
              ) : (
                'Select Bill'
              )}
            </button>
            <button
              onClick={closeModal}
              disabled={isReserving}
              className={`bg-red-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-red-400 mt-4 w-full ${
                isReserving ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4">
        <Link href="/tasks">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BillSelectionPage;