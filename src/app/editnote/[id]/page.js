'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import { TAGS } from '@/utils/page';
import Loader from '../../Loader/page';
import Pencilloader from '@/app/Pencilloader/page';
import Navbar from '@/app/Navbar/page';

const EditNotePage = () => {
    const router = useRouter();
    const { id } = useParams();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTag, setSelectedTag] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        
        if (!localStorage.getItem('token')) {
            router.push('/login');
            return;
          }

        const fetchNote = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://confidentialnotes.onrender.com/api/notes/getnote/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('token'),
                    },
                });
                const note = response.data;
                setTitle(note.title);
                setDescription(note.description);
                setSelectedTag(note.tag);
                // Format the date correctly for the input
                const formattedDate = new Date(note.date).toISOString().slice(0, 16);
                setDate(formattedDate);
            } catch (error) {
                setError('Failed to fetch note.');
            } finally {
                setLoading(false);
            }
        };

        fetchNote();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(
                `https://confidentialnotes.onrender.com/api/notes/updatenote/${id}`,
                {
                    title,
                    description,
                    tag: selectedTag,
                    date,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'token': localStorage.getItem('token'),
                    },
                }
            );
            if (response.data) {
                router.push('/');
            }
        } catch (error) {
            setError('Failed to update note.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            {loading ? (
                <>
                    <Loader />
                    <Pencilloader />
                </>
            ) : (
                <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Edit Note</h2>
                    {error && <p className="text-red-500">{error}</p>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="tag" className="block text-sm font-medium text-gray-700">Tag</label>
                            <select
                                id="tag"
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a tag</option>
                                {Object.entries(TAGS).map(([category, tags]) => (
                                    <optgroup key={category} label={category}>
                                        {tags.map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                id="date"
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Update Note
                        </button>
                    </form>
                </div>
            )}
        </>

    );
};

export default EditNotePage;
