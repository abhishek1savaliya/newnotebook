'use client'
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = (event) => {
    // Check if the mouse is still over the dropdown or profile image
    if (dropdownRef.current && dropdownRef.current.contains(event.relatedTarget)) {
      return;
    }
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-sky-600 p-4 flex justify-between items-center">
      <Link href="/" className="text-white text-lg font-semibold">
        Confidential
      </Link>

      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href="/profile">
          <Image
            src="https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
          />
        </Link>

        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
              Profile
            </Link>

            <span className="block px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100" onClick={handleLogout}>
              Logout
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;