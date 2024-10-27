"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { getCurrencyList } from '../paymybill/components/currencyList'; // ajuste o caminho conforme necessário

const BillCard = ({
  billNumber,
  value,
  currency,
  dueDate,
  bonusRate,
  onSelect,
}: {
  billNumber: number;
  value: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  onSelect: () => void;
}) => {
  return (
    <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 text-center shadow-md h-64 flex flex-col justify-between w-80">
      <div>
        <h2 className="text-3xl font-bold text-teal-900">Bill {billNumber}</h2>
        <p className="text-xl font-medium text-teal-800">Value: {value} {currency}</p>
        <p className="text-lg text-teal-800">Due Date: {dueDate}</p>
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
  const [bills] = useState([
    { id: 1, value: 1.23, currency: 'BRL', dueDate: '01/01/1111', bonusRate: 5, address: '0x123...' },
    { id: 2, value: 4.56, currency: 'USD', dueDate: '02/02/2222', bonusRate: 10, address: '0x456...' },
    { id: 3, value: 7.89, currency: 'EUR', dueDate: '03/03/3333', bonusRate: 7, address: '0x789...' },
    { id: 4, value: 0.99, currency: 'BRL', dueDate: '04/04/4444', bonusRate: 3, address: 'Bc1qxy2kgdtv8vg80v0c725p5d0c0xgjuy9p9q6hp6' },
  ]);

  const [filteredBills, setFilteredBills] = useState(bills);
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBill, setSelectedBill] = useState<{ id: number; value: number; currency: string; dueDate: string; bonusRate: number; address: string } | null>(null);

  const currencyList = getCurrencyList(); // Obtenha a lista de moedas

  const applyFilter = () => {
    const min = parseFloat(minValue) || 0;
    const max = parseFloat(maxValue) || Number.MAX_VALUE;
    const filtered = bills.filter((bill) => {
      const currencyMatch = selectedCurrency ? bill.currency === selectedCurrency : true;
      return bill.value >= min && bill.value <= max && currencyMatch;
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

  const handleSelectBill = (bill: { id: number; value: number; currency: string; dueDate: string; bonusRate: number; address: string }) => {
    setSelectedBill(bill);
  };

  const closeModal = () => {
    setSelectedBill(null); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white my-4 text-center">That&apos;s on me!</h1>

      <div className="flex justify-center items-center mb-4 px-6">
        <button
          className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black flex items-center justify-between"
          onClick={() => setShowFilter(!showFilter)}
        >
          Filter
        </button>
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
              value={bill.value}
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
            <p className="text-lg text-teal-800">Value: {selectedBill.value} {selectedBill.currency}</p>
            <p className="text-lg text-teal-800">Due Date: {selectedBill.dueDate}</p>
            <p className="text-lg text-teal-800">Bonus Rate: {selectedBill.bonusRate}%</p>
            <Link href={`/payabill/billdetails/${selectedBill.id}`}>
              <button className="bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400 mt-4 w-full">
                Select Bill
              </button>
            </Link>
            <button
              onClick={closeModal}
              className="bg-red-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-red-400 mt-4 w-full"
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
