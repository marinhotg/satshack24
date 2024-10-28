"use client"; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  status: string;
  uploader: {
    name: string;
  };
  reservedUntil?: string;
  paymentCode?: string;
}

const BillDetailsPage = () => {
  const [bill, setBill] = useState<Bill | null>(null);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");

  const getIdFromUrl = () => {
    const pathParts = window.location.pathname.split('/');
    const id = pathParts[pathParts.length - 1]; 
    return parseInt(id, 10); 
  };

  useEffect(() => {
    const fetchBillDetails = async () => {
      const id = getIdFromUrl();
      try {
        const response = await fetch(`/api/bills/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch bill details');
        }
        const data = await response.json();
        setBill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillDetails();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceipt(file);
    }
  };

  const handleUpload = () => {
    if (receipt) {
      console.log('Receipt uploaded:', receipt);
    } else {
      alert('Please attach a receipt.');
    }
  };

  const handleCreateInvoice = async () => {
    try {
      setError(null);
      const response = await fetch("/api/bills/light", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: bill?.uploader.name, amount, memo }), // Supondo que o userId seja o uploader.name, ajuste conforme necessário
      });

      const text = await response.text();
      console.log("Resposta da API:", text);

      if (!response.ok) {
        throw new Error("Erro ao criar o invoice: " + text);
      }

      const data = JSON.parse(text);
      setQrCodeURL(data.qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-teal-900">Loading bill details...</h2>
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
            <h2 className="text-2xl font-mono font-bold text-teal-900">Error Loading Bill</h2>
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

  if (!bill) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-yellow-200 rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">Bill not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-teal-500">
      <h1 className="text-4xl font-serif font-bold text-white mb-4">Bill Details</h1>
      
      <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-96">
        <h2 className="text-2xl font-bold text-teal-900 mb-2">Bill ID: {bill.id}</h2>
        <p className="text-lg text-teal-800">Value: {bill.amount.toFixed(2)} {bill.currency}</p>
        <p className="text-lg text-teal-800">Due Date: {new Date(bill.dueDate).toLocaleDateString()}</p>
        <p className="text-lg text-teal-800">Bonus Rate: {bill.bonusRate.toFixed(2)}%</p>
        <p className="text-lg text-teal-800">Status: {bill.status}</p>
        <p className="text-lg text-teal-800">Uploader: {bill.uploader.name}</p>
        {bill.paymentCode && (
          <p className="text-lg text-teal-800">Payment Code: {bill.paymentCode}</p>
        )}
        {bill.reservedUntil && (
          <p className="text-lg text-teal-800">
            Reserved Until: {new Date(bill.reservedUntil).toLocaleString()}
          </p>
        )}

        <div className="flex flex-col items-center space-y-2 mt-4">
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
            Input receipt
          </label>
          {receipt && (
            <span className="text-gray-700 font-mono">{receipt.name}</span>
          )}
        </div>

        <button
          onClick={handleUpload}
          className="w-full bg-green-300 text-teal-900 font-bold px-4 py-2 rounded-lg hover:bg-green-400 mt-4"
        >
          Send receipt
        </button>
        
        {/* Campos para gerar invoice */}
        <div className="mt-4">
          <h3 className="text-lg font-bold">Gerar Invoice</h3>
          <label>
            Valor em Milli-satoshis:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Ex: 100000"
              className="border p-2 rounded"
            />
          </label>
          <label>
            Memo:
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="Descrição do invoice"
              className="border p-2 rounded"
            />
          </label>
          <button onClick={handleCreateInvoice} className="bg-blue-300 text-white font-bold px-4 py-2 rounded mt-2">
            Criar Invoice e Gerar QR Code
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {qrCodeURL && (
            <div>
              <h2>QR Code do Invoice</h2>
              <Image
                src={qrCodeURL}
                alt="QR Code para pagamento do invoice"
                width={200}
                height={200}
              />
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-4">
        <Link href="/payabill/reservedbills">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BillDetailsPage;
