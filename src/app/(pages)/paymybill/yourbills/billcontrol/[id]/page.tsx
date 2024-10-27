"use client";
import React, { useEffect, useState } from 'react';

interface BillControlProps {
  params: Promise<{ id: string }>;
}

const BillControl: React.FC<BillControlProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [billData, setBillData] = useState<any>(null);
  const [currency, setCurrency] = useState<string>('BRL');
  const [value, setValue] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>('');
  const [bonusRate, setBonusRate] = useState<number>(0);

  const mockBillData: { [key: string]: { bonusRate: number; value: number; currency: string; dueDate: string } } = {
    '1': { bonusRate: 5, value: 1.23, currency: 'BRL', dueDate: '01/01/1111' },
    '2': { bonusRate: 10, value: 4.56, currency: 'USD', dueDate: '02/02/2222' },
    '3': { bonusRate: 7, value: 7.89, currency: 'EUR', dueDate: '03/03/3333' },
    '4': { bonusRate: 3, value: 0.99, currency: 'BRL', dueDate: '04/04/4444' },
  };

  useEffect(() => {
    params.then((resolvedParams) => {
      setId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (id) {
      const bill = mockBillData[id];
      if (bill) {
        setBillData(bill);
        setCurrency(bill.currency);
        setValue(bill.value);
        setDueDate(bill.dueDate);
        setBonusRate(bill.bonusRate);
      } else {
        console.error("Bill not found");
      }
    }
  }, [id]);

  const handlePayment = () => {
    alert(`Payment of ${value} ${currency} has been made!`);
  };

  const handleSaveChanges = () => {
    alert("Changes saved successfully!");
  };

  const handleAccessReceipt = () => {
    alert("Receipt accessed!");
  };

  if (!billData) return <div>Loading...</div>;

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-teal-500 pt-16">
      <h1 className="text-4xl font-serif font-bold text-white my-8">Bill Control - Bill ID: {id}</h1>

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
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
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
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
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

        <div className="flex flex-row items-center justify-between mt-3 space-x-2">
          <button
            onClick={handleAccessReceipt}
            className="bg-gray-500 text-white font-semibold py-2 px-4 w-full rounded-lg hover:bg-gray-600 text-sm"
          >
            Access Receipt
          </button>

          <button
            onClick={handlePayment}
            className="bg-blue-500 text-white font-semibold py-2 px-4 w-full rounded-lg hover:bg-blue-600 text-sm"
          >
            Make Payment
          </button>
        </div>

        <div className="flex flex-col items-center mt-3">
          <button
            onClick={handleSaveChanges}
            className="bg-green-500 text-white font-semibold py-2 px-4 w-full rounded-lg hover:bg-green-600 text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillControl;
