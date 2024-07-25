'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Page = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleLogin = async () => {
    let valid = true;

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setMessage('');

    if (!validateEmail(email)) {
      setEmailError('Invalid email address');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      valid = false;
    }

    if (!valid) {
      // Trigger shake animation
      triggerShakeAnimation();
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://confidentialnotes.onrender.com/api/auth/login', {
        email,
        password
      });
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
    setEmailError((prev) => (prev ? '' : ' '));
    setPasswordError((prev) => (prev ? '' : ' '));
    setTimeout(() => {
      setEmailError((prev) => (prev ? ' ' : 'Invalid email address'));
      setPasswordError((prev) => (prev ? ' ' : 'Password must be at least 6 characters long'));
    }, 10);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <div className="space-y-6">
        {message && <p className="text-sm text-red-600">{`${message}. Please enter correct !`}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${emailError && 'border-red-500 animate-shake'}`}
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
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
              className={`w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${passwordError && 'border-red-500 animate-shake'}`}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
            />
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          <div>
            {loading ? <loading /> : <button
              type="button"
              onClick={handleLogin}
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>}

          </div>
        </div>
        <p className="mt-2 text-sm text-center text-gray-600">
          Not registered? <Link href="/singup" className="font-medium text-indigo-600 hover:text-indigo-500">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Page;