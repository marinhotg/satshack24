"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Novo estado para controlar a navegação

  useEffect(() => {
    setError('');
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    console.log('Autenticando:', { email, password });
    
    // Simula autenticação e define isAuthenticated como true
    setIsAuthenticated(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-teal-500">
      <h1 className="text-5xl font-serif font-bold text-white my-8 text-center">Login</h1>

      <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-96">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-teal-900 mb-1">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-teal-700 p-2 w-full rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-teal-900 mb-1">Senha:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-teal-700 p-2 w-full rounded-lg"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          
          <button
            type="submit"
            className="bg-green-300 text-teal-900 font-bold border border-black rounded-lg px-4 py-2 hover:bg-green-400"
          >
            Login
          </button>
        </form>

        {/* Link condicional com base em isAuthenticated */}
        {isAuthenticated && (
          <Link href="/tasks">
            <p className="text-center text-teal-900 font-bold mt-4">Redirecionando para Tasks...</p>
          </Link>
        )}
      </div>

      <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
        <Link href="/tasks">
          <button
            className="bg-[#ADD8E6] text-gray-700 font-bold py-2 px-4 rounded-lg border-2 border-black flex items-center justify-between hover:bg-[#87CEEB]"
            style={{ padding: '30px 60px', fontSize: '30px', borderRadius: '5px', textAlign: 'center' }}
          >
            Ir para tasks (só de testes)
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;