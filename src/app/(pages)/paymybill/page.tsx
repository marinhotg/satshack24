"use client";

import { useState } from "react";
import Link from "next/link";
import { createBill } from "./actions";
import { getCurrencyList } from './components/currencyList';

export default function PayBillPage() {
  const currencyOptions = getCurrencyList();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyOptions[0].code);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const result = await createBill(formData);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        const form = document.getElementById("billForm") as HTMLFormElement;
        form.reset();
        setSelectedCurrency(currencyOptions[0].code);
      }
    } catch (e) {
      setError("Something went wrong: ", e);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCurrency(e.target.value);
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

        <form id="billForm" action={handleSubmit} className="space-y-6">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full h-[8vh] bg-[#FADA5E] hover:bg-[#FFD700] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-gray ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
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