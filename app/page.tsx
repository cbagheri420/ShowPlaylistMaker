'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import ShowSearch from './components/ShowSearch';
import PlaylistResult from './components/PlaylistResult';
import LoginButton from './components/LoginButton';

export default function HomePage() {
  const { data: session, status } = useSession();
  const [searchResults, setSearchResults] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShowSelect = async (show) => {
    if (!session) {
      setError('Please log in with Spotify to continue');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ show }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate playlist');
      }
      
      const data = await response.json();
      setPlaylist(data);
    } catch (err) {
      console.error(err);
      setError('Error generating playlist. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 md:px-12 lg:px-24">
      <Header />
      
      <motion.div 
        className="max-w-4xl mx-auto mt-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {status === 'loading' ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--accent-spotify))]"></div>
          </div>
        ) : session ? (
          <>
            <ShowSearch 
              onShowSelect={handleShowSelect} 
              setSearchResults={setSearchResults}
              searchResults={searchResults}
            />
            
            {error && (
              <div className="mt-6 text-red-400 text-center">
                {error}
              </div>
            )}
            
            {isLoading && (
              <div className="mt-16 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--accent-spotify))]"></div>
                <p className="mt-4 text-lg">Generating your playlist...</p>
              </div>
            )}
            
            {playlist && !isLoading && (
              <PlaylistResult playlist={playlist} show={searchResults} />
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h2 className="text-2xl font-bold mb-6">Connect with Spotify to continue</h2>
            <LoginButton />
          </div>
        )}
      </motion.div>
    </main>
  );
}