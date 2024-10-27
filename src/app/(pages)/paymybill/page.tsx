"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { getCurrencyList } from './components/currencyList';

const PayMyBill = () => {
  const currencyOptions = getCurrencyList();

  const [formData, setFormData] = useState({
    value: '',
    address: '',
    currency: currencyOptions[0].code,
    customCurrency: '',
    dueDate: '',
    bonusRate: '',
    file: null as File | null,
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      currency: value,
      customCurrency: value === 'Other' ? prevData.customCurrency : '',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      file: file,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
    setFormData({
      value: '',
      address: '',
      currency: currencyOptions[0].code,
      customCurrency: '',
      dueDate: '',
      bonusRate: '',
      file: null,
    });
  };

  const selectedCurrency = formData.customCurrency || formData.currency;

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-teal-500">
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          width: '40vw',
          height: '80vh',
          overflowY: 'auto',
        }}
        className="relative bg-[#FFFAA0] p-6 rounded-lg border-2 border-black shadow-lg"
      >
                <div className="absolute top-4 right-4">
          <Link href="/paymybill/yourbills" passHref>
            <button className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
              Your bills
            </button>
          </Link>
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-gray-700 mb-6">Pay my bill</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">Value</label>
            <input
              type="number"
              name="value"
              placeholder="Amount"
              value={formData.value}
              onChange={handleInputChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Billing Address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">Currency</label>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleCurrencyChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
            >
              {currencyOptions.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.name} ({currency.code})
                </option>
              ))}
            </select>
          </div>

          {formData.currency === 'Other' && (
            <div>
              <label className="block mb-2 text-gray-700 font-mono font-bold">Custom Currency</label>
              <input
                type="text"
                name="customCurrency"
                placeholder="Custom Currency Code"
                value={formData.customCurrency}
                onChange={handleInputChange}
                className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">Bonus Rate (%)</label>
            <input
              type="number"
              name="bonusRate"
              placeholder="Bonus Rate"
              value={formData.bonusRate}
              onChange={handleInputChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
            />
          </div>

          <div className="flex flex-col items-center space-y-2">
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
            Imput File
            </label>
            {formData.file && (
              <span className="text-gray-700 font-mono">{formData.file.name}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-[8vh] bg-[#FADA5E] hover:bg-[#FFD700] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-gray"
          >
            Submit (Using: {selectedCurrency})
          </button>
        </form>

        {showPopup && (
          <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg border-2 border-black shadow-lg">
              <p className="text-gray-700 font-mono font-bold">Bill submitted successfully in {selectedCurrency}!</p>
              <button
                className="mt-4 bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
          
        )}
        
      </div>
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

export default PayMyBill;
