"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useAuth } from "@/contexts/AuthContext";

interface Bill {
  id: number;
  amount: number;
  paymentType: string;
  currency: string;
  dueDate: string;
  bonusRate: number;
  status: string;
  uploader: {
    name: string;
  };
  reservedUntil?: string;
  paymentCode?: string;
  fileUrl?: string;
  filePathname?: string;
  fileUploadedAt?: string;
}

const ReservedBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchReservedBills = async () => {
      if (!user) {
        setError("Please log in to view your reserved bills");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/bills/paid?userId=${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch bills");
        }
        const data = await response.json();
        setBills(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bills");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservedBills();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "reserved":
        return "bg-red-300";
      case "processing":
        return "bg-yellow-300";
      case "approved":
        return "bg-blue-300";
      case "completed":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  const filteredBills =
    selectedStatus === "All"
      ? bills
      : bills.filter((bill) => bill.status === selectedStatus);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-700 border-t-transparent"></div>
            <h2 className="text-2xl font-mono font-bold text-gray-700">
              Loading your reserved bills...
            </h2>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <Link href="/login">
              <button className="w-full p-4 bg-yellow-100 hover:bg-yellow-200 border-2 border-yellow-400 rounded-lg text-yellow-700 font-mono font-bold text-center cursor-pointer transition-colors">
                Please log in to view your reserved bills
              </button>
            </Link>
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
            <h2 className="text-2xl font-mono font-bold text-gray-700">
              Error Loading Reserved Bills
            </h2>
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
      <h1 className="text-4xl font-serif font-bold text-white my-8">
        Your Reserved Bills
      </h1>

      <div className="mb-4">
        <label htmlFor="statusFilter" className="text-white font-bold mr-2">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="bg-white border-2 border-black rounded-lg p-2"
        >
          <option value="All">All</option>
          <option value="RESERVED">Reserved</option>
          <option value="PROCESSING">Processing - Wait for approving</option>
          <option value="APPROVED">Approved - Wait for payment </option>
          <option value="COMPLETED">Make the rating</option>
        </select>
      </div>

      {filteredBills.length === 0 ? (
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <p className="text-2xl font-mono font-bold text-gray-700">
            No reserved bills found
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4 lg:px-16">
          {filteredBills.map((bill) => (
            <div
              className="bg-[#FFFAA0] w-[20vw] p-4 rounded-lg border-2 border-black shadow-lg text-center mx-2"
              key={bill.id}
            >
              <h2 className="text-2xl font-serif font-bold text-gray-700 mb-4">
                Bill {bill.id}
              </h2>

              <div
                className={`${getStatusColor(
                  bill.status
                )} inline-block px-4 py-2 rounded-lg border-2 border-black text-gray-700 font-mono font-bold mb-4`}
              >
                Status: {bill.status}
              </div>

              <div className="mb-2">
                <span className="font-bold">Value:</span>{" "}
                {bill.amount.toFixed(2)} {bill.currency}
              </div>
              <div className="mb-2">
                <span className="font-bold">Due Date:</span>{" "}
                {new Date(bill.dueDate).toLocaleDateString()}
              </div>

              <div className="flex flex-col gap-2 mt-4">
                {bill.status === "RESERVED" && (
                  <>
                    {bill.fileUrl && (
                      <button
                        onClick={() => setSelectedFile(bill.fileUrl ?? null)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black mb-2"
                      >
                        View Bill File
                      </button>
                    )}
                    <Link href={`reservedbills/billdetails/${bill.id}`}>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-2 px-20 rounded-lg border-2 border-black">
                        Pay
                      </button>
                    </Link>
                  </>
                )}
                {bill.status === "PROCESSING" && (
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-mono font-bold py-2 px-4 rounded-lg border-2 border-black cursor-not-allowed"
                    disabled
                  >
                    Wait for approving
                  </button>
                )}
                {bill.status === "APPROVED" && (
                  <button
                    className="bg-blue-400 text-black font-mono font-bold py-2 px-4 rounded-lg border-2 border-black cursor-not-allowed"
                    disabled
                  >
                    Wait for payment
                  </button>
                )}
                {bill.status === "COMPLETED" && (
                  <Link href={`reservedbills/billrate/${bill.id}`}>
                    <button className="bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
                      Rate the process
                    </button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Bill File Preview</h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {selectedFile.endsWith('.pdf') ? (
              <iframe
                src={selectedFile}
                className="w-full h-[70vh]"
                title="Bill File PDF"
              />
            ) : (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedFile}
                  alt="Bill File"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-4 left-4">
        <Link href="/payabill">
          <button className="bg-[#FFFAA0] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
            Go Back
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ReservedBills;