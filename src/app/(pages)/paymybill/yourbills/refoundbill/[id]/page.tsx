"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import QRCodeDisplay from "./QrCodeDisplay";

interface RefoundBillProps {
  params: Promise<{ id: string }>;
}

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
}

const RefoundBill: React.FC<RefoundBillProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memo, setMemo] = useState("");
  const [invoiceCode, setInvoiceCode] = useState<string | null>(null);
  const [qrCodeURL, setQrCodeURL] = useState<string | null>(null);
  const [btcValue, setBtcValue] = useState<number>(0);

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
        if (!response.ok) throw new Error("Failed to fetch bill details");

        const data = await response.json();
        setBill(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bill details"
        );
      }
    };

    const fetchBtcValue = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`
        );
        const data = await response.json();
        setBtcValue(data.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching BTC value:", error);
      }
    };

    fetchBillDetails();
    fetchBtcValue();
  }, [id]);

  const handleRefound = async () => {
    if (!id) return;
    setIsPaying(true);
    try {
      const response = await fetch(`/api/bills/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: "dummy-invoice",
          refoundHash: "dummy-hash",
        }),
      });
      if (!response.ok) throw new Error("Failed to process refound");

      alert("Refound processed successfully!");
      setBill((prevBill) =>
        prevBill ? { ...prevBill, status: "COMPLETED" } : prevBill
      );
    } catch (err) {
      console.error("Failed to process refound:", err);
      alert("Failed to process refound. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCreateInvoice = async () => {
    if (!id) return;
    setIsLoadingInvoice(true);

    if (!bill) return;

    try {
      const response = await fetch("/api/bills/light", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId: id,
          amount: bill.amount * (1 + bill.bonusRate / 100),
          memo: memo,
        }), // Envia apenas o id para a rota
      });

      const text = await response.text();
      console.log("Resposta da API:", text);

      if (!response.ok) {
        throw new Error("Erro ao criar o invoice: " + text);
      }

      const data = JSON.parse(text);
      setInvoiceCode(data.invoiceCode);
      setQrCodeURL(data.qrCode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      console.error("Erro:", err);
    } finally {
      setIsLoadingInvoice(false);
    }
  };

  const calculatedAmount = bill ? bill.amount * (1 + bill.bonusRate / 100) : 0;

  if (error) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">
            {error}
          </h2>
          <Link href="/paymybill/yourbills">
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
      <h1 className="text-4xl font-serif font-bold text-white my-8">
        Make Refound - Bill ID: {id}
      </h1>

      <div className="bg-[#FFFAA0] w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black">
        {bill ? (
          <>
            <p className="mb-3">
              <span className="font-bold">Amount:</span> {bill.amount}{" "}
              {bill.currency}
            </p>
            <p className="mb-3">
              <span className="font-bold">Bonus Rate:</span> {bill.bonusRate}%
            </p>

            <p className="mb-5">
              <span className="font-bold">Total Amount to Pay:</span>{" "}
              {calculatedAmount.toFixed(2)} {bill.currency}
            </p>

            <button
              onClick={handleRefound}
              disabled={isPaying}
              className="w-full bg-blue-400 hover:bg-blue-600 text-black font-mono font-bold py-2 px-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPaying ? "Processing..." : "Make Refound"}
            </button>
          </>
        ) : (
          <p>Loading bill details...</p>
        )}
      </div>
      <div className="bg-yellow-200 w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black mt-8">
        <h2 className="text-lg font-bold">Invoice Code</h2>
        <p>{invoiceCode}</p>
      </div>

      <div className="bg-yellow-200 w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black mt-8">
        <h3 className="text-lg font-bold">Make Invoice</h3>
        <label>
          Amount in Milli-Satoshis:
          <input
            type="number"
            value={(calculatedAmount / btcValue) * 1000000}
            readOnly
            className="border p-2 rounded"
          />
        </label>
        <label>
          Memo:
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="border p-2 rounded"
          />
        </label>
        <button
          onClick={handleCreateInvoice}
          disabled={isLoadingInvoice}
          className="w-full bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          {isLoadingInvoice ? "Creating Invoice..." : "Create Invoice"}
        </button>
        {qrCodeURL && (
          <div className="mt-4">
            {qrCodeURL && <QRCodeDisplay dataUrl={qrCodeURL} />}
          </div>
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

export default RefoundBill;
