// app/page.tsx
"use client";

import Link from 'next/link';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-teal-500 p-4 text-center">
      <h1 className="text-5xl font-serif font-bold text-white my-8">Welcome to Private Bills</h1>

      <section className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-full max-w-4xl mb-8">
        <h2 className="text-4xl font-bold text-teal-900 mb-4">What We Offer</h2>
        <p className="text-lg text-teal-900 mb-4">
           Private Bills is the innovative solution that connects the growing community of Bitcoin-first users with those looking to acquire Bitcoin in a practical and direct way.
        </p>
        <p className="text-lg text-teal-900 mb-4">
          If you’re a Bitcoin holder needing to pay bills like rent and utilities, our platform allows you to do so without converting your bitcoins into fiat.
        </p>
        <p className="text-lg text-teal-900 mb-4">
          Simply upload your bills and let other users eager to acquire Bitcoin take care of the payments. In return, they receive satoshis via the Lightning Network along with an additional incentive set by the bill owner.
        </p>
        <p className="text-lg text-teal-900 mb-4">
          With a reputation system to ensure trust and flexible bonus rates, Private Bills creates a win-win scenario for both parties.
        </p>
        <h2 className="text-lg font-bold text-teal-900 mb-4">Join us and transform the way you handle your bills and Bitcoin!</h2>
      </section>

      <Link href="/login">
        <button className="bg-yellow-300 text-teal-900 font-bold border border-black rounded-lg px-12 py-6 hover:bg-yellow-400 text-3xl">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
