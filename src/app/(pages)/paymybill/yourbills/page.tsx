"use client";
import React, { useState } from 'react';
import BillCard from '../components/BillCard';

const YourBills = () => {
  // Mock bills
  const [bills] = useState([
    { id: 1, value: 1.23, currency: 'BRL', dueDate: '01/01/1111', status: 'payed' },
    { id: 2, value: 4.56, currency: 'USD', dueDate: '02/02/2222', status: 'unpaid' },
    { id: 3, value: 7.89, currency: 'EUR', dueDate: '03/03/3333', status: 'payed' },
    { id: 4, value: 0.99, currency: 'BRL', dueDate: '04/04/4444', status: 'unpaid' },
  ]);

  return (
    <div className="flex flex-col items-center h-screen w-screen bg-teal-500 pt-16">
      <h1 className="text-4xl font-serif font-bold text-white my-8">Your Bills</h1>
      
      {/* Flexbox layout for BillCard */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-6xl px-4 lg:px-16">
        {bills.map(bill => (
          <div className="flex-shrink-0 w-full sm:w-[30%] lg:w-[30%] mx-2" key={bill.id}>
            <BillCard
              billNumber={bill.id}
              status={bill.status}
              value={bill.value}
              currency={bill.currency}
              dueDate={bill.dueDate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBills;
