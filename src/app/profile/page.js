'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '@/app/Navbar/page';
import Loader from '../Loader/page';
import Pencilloader from '../Pencilloader/page';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('https://confidentialnotes.onrender.com/api/auth/getuser', {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('token'),
                    },
                });
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setError('Failed to fetch user data.');
                }
            } catch (error) {
                setError('Failed to fetch user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <>
            <Navbar />
            {loading ? (
                <>
                    <Loader />
                    <Pencilloader />
                </>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="max-w-md mx-auto mt-1 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">My Profile</h2>
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <img
                                src={user.image || 'https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg'}
                                alt="Profile"
                                className="w-7 h-7 rounded-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                            <p className="mt-1 text-gray-900">{user.fName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                            <p className="mt-1 text-gray-900">{user.lName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Username</label>
                            <p className="mt-1 text-gray-900">{user.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-gray-900">{user.email}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date Joined</label>
                            <p className="mt-1 text-gray-900">{new Date(user.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;