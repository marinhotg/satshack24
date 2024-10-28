"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type LoginFormData = {
  email: string;
  senha: string;
};

type SignupFormData = {
  email: string;
  senha: string;
  name: string;
  nodeId: string;
};

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState<LoginFormData | SignupFormData>({
    email: '',
    senha: '',
    name: '',
    nodeId: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
  }, [formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (isSignup) {
      const signupData = formData as SignupFormData;
      if (!signupData.email || !signupData.senha || !signupData.name || !signupData.nodeId) {
        setError('Please fill in all fields.');
        return false;
      }
    } else {
      const loginData = formData as LoginFormData;
      if (!loginData.email || !loginData.senha) {
        setError('Please fill in all fields.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create account');
        }

        router.push('/tasks');
      } else {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            senha: formData.senha
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Invalid email or password');
        }

        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/tasks');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-teal-500 p-4">
      <h1 className="text-5xl font-serif font-bold text-white my-8 text-center">
        {isSignup ? 'Sign Up' : 'Login'}
      </h1>

      <div className="bg-yellow-200 border-2 border-black rounded-lg p-6 shadow-md w-full max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-teal-900 mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="border border-teal-700 p-2 w-full rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-sm font-medium text-teal-900 mb-1">
              Password:
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
              className="border border-teal-700 p-2 w-full rounded-lg"
            />
          </div>

          {isSignup && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-teal-900 mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={(formData as SignupFormData).name}
                  onChange={handleInputChange}
                  required
                  className="border border-teal-700 p-2 w-full rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="nodeId" className="block text-sm font-medium text-teal-900 mb-1">
                  Node ID:
                </label>
                <input
                  type="text"
                  id="nodeId"
                  name="nodeId"
                  value={(formData as SignupFormData).nodeId}
                  onChange={handleInputChange}
                  required
                  className="border border-teal-700 p-2 w-full rounded-lg"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="bg-green-300 text-teal-900 font-bold border border-black rounded-lg px-4 py-2 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full mt-4 text-teal-900 text-sm hover:underline"
        >
          {isSignup 
            ? 'Already have an account? Login' 
            : 'Don\'t have an account? Sign up'}
        </button>
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-5 left-5">
          <Link href="/tasks">
            <button className="bg-[#ADD8E6] text-gray-700 font-bold p-6 text-3xl rounded-lg border-2 border-black hover:bg-[#87CEEB]">
              Go to tasks (dev only)
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default LoginPage;