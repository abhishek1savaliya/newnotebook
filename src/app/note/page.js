'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import moment from 'moment-timezone';
import Link from 'next/link';
import Loader from '../Loader/page';
import Pencilloader from '../Pencilloader/page';

const NotesPage = () => {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tag, setTag] = useState({ available_tag: [] });

  useEffect(() => {
    const fetchNotes = async () => {
      if (!localStorage.getItem('token')) {
        router.push('/login');
        return;
      }

      setLoading(true);

      try {
        const url = selectedTag
          ? `https://confidentialnotes.onrender.com/api/notes/getnotebytag/${encodeURIComponent(selectedTag)}`
          : 'https://confidentialnotes.onrender.com/api/notes/fetchallnotes';

        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            'token': localStorage.getItem('token'),
          },
        });

        if (url.includes('fetchallnotes')) {
          const tags = response.data
            .map(note => note.tag)
            .filter((value, index, self) => self.indexOf(value) === index);

          setTag({ available_tag: tags });
        }

        setNotes(response.data);
      } catch (err) {
        console.log(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [router, selectedTag]);

  const handleDelete = async (noteId) => {
    try {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));

      await axios.delete(`https://confidentialnotes.onrender.com/api/notes/deletenote/${noteId}`, {
        headers: {
          'token': localStorage.getItem('token'),
        },
      });

    } catch (err) {
      console.log(err);
      setError('Failed to delete the note. Please try again.');
    }
  };

  const handleTagChange = (event) => {
    setSelectedTag(event.target.value);
  };

  const handleClearFilter = () => {
    setSelectedTag('');
  };

  const backgroundColors = [
    'bg-gray-50',
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-red-50',
    'bg-purple-50',
    'bg-pink-50',
    'bg-teal-50'
  ];

  const getRandomBackgroundColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    return backgroundColors[randomIndex];
  };



  return (
    <>
      {loading && <Loader />}
      <div className="relative p-4 md:p-6 lg:p-8">
        <button
          className="mb-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        >
          <Link href='/addnote'>Add Note</Link>
        </button>
        <div className="mb-4 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-lg font-medium">Filter:</span>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="px-4 py-2 border rounded-lg flex-grow"
          >
            <option value="">Select a tag</option>
            {Object.entries(tag).map(([category, tags]) => (
              <optgroup key={category} label={category}>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <button
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600"
            onClick={handleClearFilter}
          >
            Clear
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {notes.length === 0 ? (
          <div className='text-center'>
            {loading ? (
              <Pencilloader />
            ) : (
              <div>No notes available</div>
            )}
          </div>
        ) : (
          <>
            {loading ? (
              <Pencilloader />
            ) : (
              <div>
                <h1 className="text-center text-2xl font-bold mb-4">All notes</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {notes.map(note => {
                    // Extract emojis from the tag
                    const emojis = note.tag.match(/[\p{Emoji}]/gu) || [];

                    // Set the background color; you can adjust or add more Tailwind colors here
                    const backgroundColor = note.color || 'bg-gray-50';

                    return (
                      <div
                        key={note.id}
                        className={`w-64 h-64 p-4 border rounded-md shadow-sm relative ${backgroundColor} overflow-auto`} // Added overflow-auto
                      >
                        {emojis.length > 0 && (
                          <span className="absolute top-2 right-2 text-2xl">
                            {emojis[0]} {/* Display the first emoji */}
                          </span>
                        )}
                        <h2 className="text-xl font-bold text-blue-800 mb-2 truncate">{note.title}</h2> {/* Title color */}
                        <p className="text-gray-800 mb-2 max-w-full break-words">{note.description}</p> {/* Break long words and wrap text */}

                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-sm text-gray-500">
                          <p className="flex-1 truncate">
                            {moment(note.date).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A')}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              className="px-3 py-1 text-teal-700 hover:text-teal-900 transition-colors"
                            >
                              <Link href={`/editnote/${note.id}`}>
                                <FaRegEdit className="text-lg" />
                              </Link>
                            </button>
                            <button
                              className="px-3 py-1 text-red-700 hover:text-red-900 transition-colors"
                              onClick={() => handleDelete(note.id)}
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}


                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NotesPage;