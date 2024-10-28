"use client";

import { useState } from "react";
import Link from "next/link";
import { createBill } from "./actions";
import { getCurrencyList } from './components/currencyList';
import { upload } from '@vercel/blob/client';

export default function PayBillPage() {
  const currencyOptions = getCurrencyList();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0].code);
  const [billFile, setBillFile] = useState<File | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    if (!billFile) {
      setError("Please attach a bill file before submitting.");
      setIsSubmitting(false);
      return;
    }

    try {
      const newBlob = await upload(billFile.name, billFile, {
        access: 'public',
        handleUploadUrl: '/api/bills/upload-bill',
      });

      setBlobUrl(newBlob.url);

      formData.append("billFile", newBlob.url);

      const result = await createBill(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        const form = document.getElementById("billForm") as HTMLFormElement;
        form.reset();
        setSelectedCurrency(currencyOptions[0].code);
        setBillFile(null); 
        setBlobUrl(null); 
      }
    } catch (e) {
      console.error("Something went wrong:", e);
      setError("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBillFile(file);
    }
  };

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
          <Link href="/paymybill/yourbills">
            <button className="bg-[#ADD8E6] hover:bg-[#87CEEB] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
              Your bills
            </button>
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-gray-700 mb-6">Pay my bill</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border-2 border-red-400 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border-2 border-green-400 rounded-lg text-green-700">
            Bill created successfully!
          </div>
        )}

        <form id="billForm" onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6">
          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              required
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              placeholder="Amount"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">
              Payment Type
            </label>
            <select
              name="paymentType"
              required
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
            >
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CRYPTO">Cryptocurrency</option>
              <option value="CARD">Credit/Debit Card</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">
              Currency
            </label>
            <select
              name="currency"
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
            >
              {currencyOptions.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {`${currency.name} (${currency.code})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">
              Due Date
            </label>
            <input
              type="date"
              name="dueDate"
              required
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-mono font-bold">
              Bonus Rate (%)
            </label>
            <input
              type="number"
              name="bonusRate"
              step="0.1"
              min="0"
              className="w-full h-[8vh] border-2 border-black rounded-md py-2 px-4 text-gray-700"
              placeholder="Bonus Rate"
            />
          </div>

          <div className="flex flex-col items-center space-y-2 mt-4">
            <input
              type="file"
              name="billFile"
              onChange={handleFileChange}
              className="hidden"
              id="upload-bill"
              required
            />
            <label
              htmlFor="upload-bill"
              className="w-40 h-12 bg-[#FFD700] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold text-center py-2 px-4 rounded-lg border-2 border-black cursor-pointer flex items-center justify-center"
            >
              Upload Bill
            </label>
            {billFile && (
              <span className="text-gray-700 font-mono">{billFile.name}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-[8vh] bg-[#FADA5E] hover:bg-[#FFD700] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-gray ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            } mt-4`}
          >
            {isSubmitting ? "Creating bill..." : `Submit (Using: ${selectedCurrency})`}
          </button>
        </form>
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
}
