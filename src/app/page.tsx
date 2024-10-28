// app/page.tsx
"use client";

import Link from 'next/link';
import logo from './image/logo.png';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen text-center p-4">
      {/* Título centralizado */}
      <h1 className="text-6xl font-serif font-bold text-white mb-8">Welcome to Private Bills</h1>

      {/* Contêiner da imagem e texto lado a lado */}
      <div className="bg-yellow-200 border-2 border-black rounded-lg p-2 shadow-md w-full max-w-7xl flex items-center mb-8"> {/* Adicionado mb-8 aqui */}
        {/* Imagem à esquerda */}
        <div className="w-1/2 flex items-center justify-center p-4">
          <img 
            src={logo.src} 
            alt="Logo" 
            className="object-contain max-w-full max-h-full"
          />
        </div>

        {/* Texto à direita */}
        <div className="w-1/2 text-left p-4">
          <h2 className="text-3xl font-bold text-teal-900 mb-4">What We Offer</h2>
          <p className="text-lg text-teal-900 mb-3">
            Private Bills is the innovative solution that connects the growing community of Bitcoin-first users with those looking to acquire Bitcoin in a practical and direct way.
          </p>
          <p className="text-lg text-teal-900 mb-3">
            If you’re a Bitcoin holder needing to pay bills like rent and utilities, our platform allows you to do so without converting your bitcoins into fiat.
          </p>
          <p className="text-lg text-teal-900 mb-3">
            Simply upload your bills and let other users eager to acquire Bitcoin take care of the payments. In return, they receive satoshis via the Lightning Network along with an additional incentive set by the bill owner.
          </p>
          <p className="text-lg text-teal-900 mb-3">
            With a reputation system to ensure trust and flexible bonus rates, Private Bills creates a win-win scenario for both parties.
          </p>
          <h2 className="text-lg font-bold text-teal-900 mb-3">Join us and transform the way you handle your bills and Bitcoin!</h2>
        </div>
      </div>

      <Link href="/login">
        <button className="bg-yellow-300 text-teal-900 font-bold border border-black rounded-lg px-12 py-6 hover:bg-yellow-400 text-3xl">
          Get Started
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
