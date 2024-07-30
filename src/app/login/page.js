'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Loader from '../Loader/page';

const Page = () => {
  const router = useRouter();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
      return;
    }
  }, []);

  const isEmail = (str) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(str);
  };

  const handleLogin = async () => {
    let valid = true;

    setIdentifierError('');
    setPasswordError('');
    setMessage('');

    if (!identifier) {
      setIdentifierError('Please enter an email address or username');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    if (!valid) {
      triggerShakeAnimation();
      return;
    }

    setLoading(true);
    try {
      const payload = isEmail(identifier)
        ? { email: identifier, password }
        : { username: identifier, password };

      const response = await axios.post('https://confidentialnotes.onrender.com/api/auth/login', payload);

      if (response.data.authToken) {
        localStorage.setItem('token', response.data.authToken);
        router.push('/');
      }
    } catch (error) {
      setMessage(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const triggerShakeAnimation = () => {
    setIdentifierError((prev) => (prev ? '' : ' '));
    setPasswordError((prev) => (prev ? '' : ' '));
    setTimeout(() => {
      setIdentifierError((prev) => (prev ? ' ' : 'Please enter an email address or username'));
      setPasswordError((prev) => (prev ? ' ' : 'Password must be at least 6 characters long'));
    }, 10);
  };

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    setIdentifierError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  return (
<>
  {!loading ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <div className="space-y-6">
          {message && (
            <p className="text-sm text-red-600">{`${message}. Please enter correct !`}</p>
          )}
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
              Email address or Username
            </label>
            <input
              id="identifier"
              name="identifier"
              type="text"
              autoComplete="identifier"
              required
              className={`w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${identifierError ? 'border-red-500 animate-shake' : ''}`}
              placeholder="Email address or Username"
              value={identifier}
              onChange={handleIdentifierChange}
            />
            {identifierError && <p className="mt-1 text-sm text-red-600">{identifierError}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={`w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${passwordError ? 'border-red-500 animate-shake' : ''}`}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          <div>
            <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </div>
        <p className="mt-2 text-sm text-center text-gray-600">
          Not registered? <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Create an account</Link>
        </p>
      </div>
    </div>
  ) : (
    <Loader />
  )}
</>

  
  );
};

export default Page;