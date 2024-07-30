'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from 'next/link';

const NotesPage = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (!localStorage.getItem('token')) {
        router.push('/login');
        return;
      }
      try {
        const response = await axios.get('https://confidentialnotes.onrender.com/api/notes/fetchallnotes', {
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
          },
        });

        setNotes(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleEdit = (noteId) => {
    console.log('Edit note', noteId);
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`https://confidentialnotes.onrender.com/api/notes/deletenote/${noteId}`, {
        headers: {
          'token': localStorage.getItem('token'),
        },
      });

      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));

    } catch (err) {
      console.log(err);
      setError('Failed to delete the note. Please try again.');
    }
  };

  if (loading) return <loading />;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="bg-gray-100 p-2 relative">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
      >
        <Link href='/addnote'>Add Note</Link>
      </button>
      <h1 className="text-2xl font-bold mb-4">Notes</h1>
      {notes.length === 0 ? (
        <p>No notes available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {notes.map(note => (
            <div
              key={note._id}
              className={`p-4 border rounded-md shadow-sm ${note.color || 'bg-gray-50'}`}
            >
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              <p className="text-gray-700 mb-2">{note.description}</p>
              <p className="text-sm text-gray-500 mb-2">Tag: {note.tag}</p>
              <p className="text-sm text-gray-400 mb-4">Date: {new Date(parseInt(note.date)).toLocaleString()}</p>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-3 py-1 text-teal-700"
                >   <Link href={`/editnote/${note.id}`}>  <FaRegEdit className="text-lg" /></Link>

                </button>
                <button
                  className="px-3 py-1 text-red-700"
                  onClick={() => handleDelete(note.id)}
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesPage;
