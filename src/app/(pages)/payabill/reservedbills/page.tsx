"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  status: string;
}

const ReservedBills = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  // Dados de teste para faturas reservadas, incluindo os novos status
  const teste_reserva: Bill[] = [
    {
      id: 1,
      amount: 150.0,
      currency: "USD",
      dueDate: "2024-11-01",
      status: "Reserved",
    },
    {
      id: 2,
      amount: 250.5,
      currency: "EUR",
      dueDate: "2024-11-10",
      status: "Reserved",
    },
    {
      id: 3,
      amount: 300.75,
      currency: "BRL",
      dueDate: "2024-11-15",
      status: "Reserved",
    },
    {
      id: 4,
      amount: 120.0,
      currency: "USD",
      dueDate: "2024-11-20",
      status: "Ready for Withdraw",
    },
    {
      id: 5,
      amount: 75.99,
      currency: "EUR",
      dueDate: "2024-11-25",
      status: "Wait Payment",
    },
    {
      id: 6,
      amount: 450.0,
      currency: "BRL",
      dueDate: "2024-11-30",
      status: "Reserved",
    },
    {
      id: 7,
      amount: 600.2,
      currency: "USD",
      dueDate: "2024-12-05",
      status: "Reserved",
    },
    {
      id: 8,
      amount: 89.99,
      currency: "EUR",
      dueDate: "2024-12-10",
      status: "Ready for Withdraw",
    },
    {
      id: 9,
      amount: 320.0,
      currency: "USD",
      dueDate: "2024-12-15",
      status: "Wait Payment",
    },
    {
      id: 10,
      amount: 200.75,
      currency: "BRL",
      dueDate: "2024-12-20",
      status: "Reserved",
    },
  ];

  useEffect(() => {
    const fetchReservedBills = async () => {
      try {
        const response = await fetch("/api/bills/person2");
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
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-300";
      case "ready for withdraw":
        return "bg-green-500";
      case "pending":
      case "reserved":
        return "bg-red-300";
      case "wait payment":
        return "bg-yellow-300";
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
          <option value="Reserved">Reserved</option>
          <option value="Ready for Withdraw">Ready for Withdraw</option>
          <option value="Wait Payment">Wait Payment</option>
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

              <div className="flex justify-around mt-4">
                {bill.status === "Reserved" && (
                  <button className="bg-red-500 hover:bg-red-600 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
                    Pay
                  </button>
                )}
                {bill.status === "Ready for Withdraw" && (
                  <button className="bg-green-500 hover:bg-green-600 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black">
                    Withdraw
                  </button>
                )}
                {bill.status === "Wait Payment" && (
                  <>
                    <button
                      className="bg-gray-500 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black cursor-not-allowed mr-2"
                      disabled
                    >
                      Pay
                    </button>
                    <button
                      className="bg-gray-500 text-white font-mono font-bold py-2 px-4 rounded-lg border-2 border-black cursor-not-allowed"
                      disabled
                    >
                      Withdraw
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
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

export default ReservedBills;
