'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ShowSearch({ onShowSelect, setSearchResults, searchResults }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchShows = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/search-show?query=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to search shows');
      }
      
      const data = await response.json();
      setResults(data.results || []);
      setIsDropdownOpen(true);
    } catch (err) {
      console.error(err);
      setError('Error searching shows. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchShows(value);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const handleShowClick = (show) => {
    setSearchResults(show);
    setQuery(show.name);
    setIsDropdownOpen(false);
    onShowSelect(show);
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Find Your Show&apos;s Perfect Soundtrack</h2>
        <p className="text-lg text-gray-300 mb-8">Enter a TV show and discover a custom playlist that perfectly matches its vibe</p>
      </div>
      
      <motion.div 
        className="relative mx-auto max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a TV show..."
            value={query}
            onChange={handleSearch}
            onFocus={() => {
              if (results.length > 0) setIsDropdownOpen(true);
            }}
            className="input-search"
          />
          {isLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-2 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        <AnimatePresence>
          {isDropdownOpen && results.length > 0 && (
            <motion.div 
              className="absolute z-10 mt-2 w-full rounded-xl glass-card overflow-hidden max-h-96 overflow-y-auto"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {results.map((show) => (
                <div 
                  key={show.id}
                  className="flex items-center p-3 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => handleShowClick(show)}
                >
                  {show.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                      alt={show.name}
                      width={45}
                      height={68}
                      className="rounded-md"
                    />
                  ) : (
                    <div className="w-[45px] h-[68px] bg-gray-700 rounded-md flex items-center justify-center">
                      <span className="text-xs">No Image</span>
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="font-medium">{show.name}</div>
                    <div className="text-sm text-gray-300">
                      {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown year'}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}