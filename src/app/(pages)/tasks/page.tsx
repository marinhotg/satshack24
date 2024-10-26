"use client";

import React from 'react';
import Link from 'next/link';

const BillButtons: React.FC = () => {
  return (
    <div className="flex flex-col bg-teal-500 justify-center items-center h-screen w-screen gap-x-8">
      <h1 className="text-6xl font-serif font-bold text-white my-2">Sorry, was that your bill?</h1>
      <h2 className="text-xl font-serif italic text-white mb-4">Using Lightning to provide a private bill payment solution</h2>
      <h3 className="text-xl font-serif font-semibold text-white mb-4">Select an option:</h3>

      <div className="flex justify-center gap-8">
        <Link href="/paymybill">
          <div
            className="bg-[#FFFAA0] h-[15vh] w-[30vw] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black flex items-center justify-center"
          >
            Pay my bill, please
          </div>
        </Link>

        <Link href="/payabill">
          <div
            className="bg-[#FFFAA0] h-[15vh] w-[30vw] hover:bg-[#FADA5E] text-gray-700 font-mono font-bold py-2 px-4 rounded-lg border-2 border-black flex items-center justify-center"
          >
            That&apos;s on me!
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BillButtons;