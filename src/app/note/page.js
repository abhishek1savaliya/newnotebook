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
  const [tag, setTag] = useState({
    loading: []
  })

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

  return (
    <>
      {loading && (

        <Loader />
      )}
      <div className="relative  p-2">

        <button
          className="mb-6 px-4 py-2 mt-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
        >
          <Link href='/addnote'>Add Note</Link>
        </button>
        <div className="mb-4 flex items-center space-x-4">
          <span>Filter:</span>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="px-4 py-2 border rounded-lg"
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
              <div><Pencilloader /></div>
            ) : (
              <div>No notes available</div>
            )}
          </div>

        ) : (
          <>

            {loading ? (
              <div><Pencilloader /></div>
            ) : (
              <div> <h1 className="text-center text-2xl font-bold mb-4">All notes</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">

                  {notes.map(note => {
                    const emoji = note.tag.match(/[\p{Emoji}]/u);
                    return (
                      <div
                        key={note.id}
                        className={`p-4 border rounded-md shadow-sm relative ${note.color || 'bg-gray-50'}`}
                      >
                        {emoji && (
                          <span className="absolute top-2 right-2 text-2xl">
                            {emoji[0]}
                          </span>
                        )}
                        <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                        <p className="text-gray-700 mb-2">{note.description}</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Date: {moment(note.date).tz('Asia/Kolkata').format('DD/MM/YYYY hh:mm A')}
                        </p>
                        <div className="flex justify-end space-x-2">
                          <button
                            className="px-3 py-1 text-teal-700"
                          >
                            <Link href={`/editnote/${note.id}`}>
                              <FaRegEdit className="text-lg" />
                            </Link>
                          </button>
                          <button
                            className="px-3 py-1 text-red-700"
                            onClick={() => handleDelete(note.id)}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div></div>
            )}


          </>
        )}
      </div >
    </>
  );
};

export default NotesPage;