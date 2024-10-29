"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ApproveBillProps {
  params: Promise<{ id: string }>;
}

interface Bill {
  id: number;
  amount: number;
  currency: string;
  dueDate: string;
  bonusRate: number;
  status: string;
  receiptUrl?: string;
  receiptPathname?: string; 
  receiptUploadedAt?: string;
  uploader: {
    name: string;
  };
}

const ApproveBill: React.FC<ApproveBillProps> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [bill, setBill] = useState<Bill | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!id) return;

    const fetchBillDetails = async () => {
      try {
        const response = await fetch(`/api/bills/${id}`);
        if (!response.ok) throw new Error('Failed to fetch bill details');

        const data = await response.json();
        setBill(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load bill details');
      }
    };

    fetchBillDetails();
  }, [id]);

  const handleApprove = async () => {
    if (!id || !bill?.receiptUrl) {
      setError('Cannot approve bill without receipt');
      return;
    }
    
    setIsApproving(true);
    setError(null);
  
    try {
      const formData = new FormData();
      const file = new File([""], "receipt.jpg", { type: "image/jpeg" });

      formData.append("file", file);
  
      const response = await fetch(`/api/bills/${id}/approve`, {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve bill');
      }
  
      const updatedBill = await response.json();
      setBill(updatedBill);
      alert('Bill approved successfully!');
    } catch (err) {
      console.error('Failed to approve bill:', err);
      setError(err instanceof Error ? err.message : 'Failed to approve bill');
    } finally {
      setIsApproving(false);
    }
  };

  const ImageModal = () => {
    if (!isImageModalOpen || !bill?.receiptUrl) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Receipt Preview</h3>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          {bill.receiptUrl.endsWith('.pdf') ? (
            <iframe
              src={bill.receiptUrl}
              className="w-full h-[70vh]"
              title="Receipt PDF"
            />
          ) : (
            <div className="relative w-full h-[70vh]">
              <Image
                src={bill.receiptUrl}
                alt="Receipt"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen w-full bg-teal-500 flex flex-col items-center justify-center">
        <div className="bg-[#FFFAA0] rounded-lg border-2 border-black p-8 shadow-lg">
          <h2 className="text-2xl font-mono font-bold text-teal-900">{error}</h2>
          <Link href="/yourbills">
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
      <h1 className="text-4xl font-serif font-bold text-white my-8">Approve Bill - Bill ID: {id}</h1>

      <div className="bg-[#FFFAA0] w-[40vw] rounded-lg p-4 shadow-lg border-2 border-black">
        {bill ? (
          <>
            <div className="grid gap-3 mb-6">
              <p className="font-bold text-lg text-teal-900 border-b border-teal-900 pb-2">
                Bill Details
              </p>
              <p><span className="font-bold">Amount:</span> {bill.amount} {bill.currency}</p>
              <p><span className="font-bold">Bonus Rate:</span> {bill.bonusRate}%</p>
              <p><span className="font-bold">Status:</span> {bill.status}</p>
              <p><span className="font-bold">Uploaded by:</span> {bill.uploader.name}</p>
              <p><span className="font-bold">Due Date:</span> {new Date(bill.dueDate).toLocaleDateString()}</p>
            </div>

            {bill.receiptUrl && (
              <div className="mb-6">
                <p className="font-bold text-lg text-teal-900 border-b border-teal-900 pb-2 mb-3">
                  Receipt
                </p>
                <div className="flex flex-col items-center gap-2">
                  <button
                    onClick={() => setIsImageModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    View Receipt
                  </button>
                  <p className="text-sm text-gray-600">
                    Uploaded at: {new Date(bill.receiptUploadedAt || '').toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {bill.status === 'PROCESSING' && (
              <div className="mt-6 border-t border-teal-900 pt-4">
                <button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="w-full bg-yellow-400 text-black font-mono font-bold py-3 px-4 rounded-lg hover:bg-yellow-500 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isApproving ? 'Approving...' : 'Approve Bill'}
                </button>
                {error && (
                  <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-900"></div>
          </div>
        )}
      </div>

      <ImageModal />

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

export default ApproveBill;