// components/Header.tsx
"use client";

import { useAuth } from '@/contexts/AuthContext';
// import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className="fixed top-0 right-0 p-4 z-50">
      <div className="flex items-center gap-4 bg-white shadow-md rounded-lg p-2">
        <span className="text-sm text-gray-600">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}