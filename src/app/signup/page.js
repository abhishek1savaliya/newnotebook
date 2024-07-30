'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import Loader from '../Loader/page';
import { MdCancel } from "react-icons/md";

const SignupPage = () => {
  const router = useRouter();

  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/');
      return;
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
  };

  const checkUsernameAvailability = async (username) => {
    if (username) {
      setCheckingUsername(true);
      try {
        const response = await fetch('https://confidentialnotes.onrender.com/api/auth/checkusername', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
        const data = await response.json();
        if (data.success) {
          setIsUsernameAvailable(true);
        } else {
          setIsUsernameAvailable(false);
        }
      } catch (error) {
        setIsUsernameAvailable(false);
      } finally {
        setCheckingUsername(false);
      }
    } else {
      setIsUsernameAvailable(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSignup = async () => {
    let newErrors = {};

    if (fName.length < 3) {
      newErrors.fName = 'First name must be at least 3 characters long';
    }
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!isUsernameAvailable) {
      newErrors.username = 'Username already exists';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const response = await fetch('https://confidentialnotes.onrender.com/api/auth/createuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fName, lName, username, email, password }),
      });
      const data = await response.json();
      if (data.authToken) {
        localStorage.setItem('token', data.authToken);
        router.push('/');
      } else {
        setErrors({ api: `${data.error}. Please click on login.` });
      }
    } catch (error) {
      setErrors({ api: `Error: ${error.message || 'Something went wrong'}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
            <div className="space-y-6">
              {errors.api && <p className="text-sm text-red-600">{errors.api}</p>}
              {errors.success && <p className="text-sm text-green-600">{errors.success}</p>}
              <div className="flex space-x-4">
                <div className="flex-1">
                  <label htmlFor="fName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    id="fName"
                    name="fName"
                    type="text"
                    required
                    className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="First Name"
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                  />
                  {errors.fName && <p className="text-sm text-red-600">{errors.fName}</p>}
                </div>
                <div className="flex-1">
                  <label htmlFor="lName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    id="lName"
                    name="lName"
                    type="text"
                    required
                    className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Last Name"
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <div className="flex items-center mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="w-full px-3 py-2 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {checkingUsername && (
                    <span className="ml-2 uloader"></span> // Ensure your Loader is styled with the `uloader` class
                  )}
                  {!checkingUsername && isUsernameAvailable === true && (
                    <span className="ml-2 text-green-600 wrapper">
                      <IoCheckmarkCircleSharp />
                    </span>
                  )}
                  {!checkingUsername && isUsernameAvailable === false && (
                    <span className="ml-2 text-red-600 wrapper">
                      <MdCancel />
                    </span>
                  )}
                </div>
              </div>
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
                  className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full px-3 py-2 mt-1 text-gray-900 placeholder-gray-500 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
              <div>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  Sign up
                </button>
              </div>
              <div className="text-sm">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

};

export default SignupPage;