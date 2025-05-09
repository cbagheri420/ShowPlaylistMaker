'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SpotifyPlayer from './SpotifyPlayer';

export default function PlaylistResult({ playlist, show }) {
  const [activeTrack, setActiveTrack] = useState(null);
  const [savedToSpotify, setSavedToSpotify] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSavePlaylist = async () => {
    setIsSaving(true);
    setError('');
    
    try {
      const response = await fetch('/api/save-playlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: playlist.tracks,
          showName: show.name,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save playlist');
      }
      
      setSavedToSpotify(true);
    } catch (err) {
      console.error(err);
      setError('Error saving playlist. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start mb-12">
        {show?.poster_path ? (
          <div className="relative w-48 h-72 md:mr-8 mb-6 md:mb-0">
            <Image
              src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
              alt={show.name}
              fill
              className="rounded-lg object-cover shadow-xl"
            />
          </div>
        ) : (
          <div className="w-48 h-72 bg-gray-800 rounded-lg shadow-xl flex items-center justify-center md:mr-8 mb-6 md:mb-0">
            <span className="text-lg">No Image</span>
          </div>
        )}
        
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-bold mb-2">{show?.name}</h2>
          <p className="text-gray-300 mb-4">
            {show?.first_air_date ? new Date(show.first_air_date).getFullYear() : ''}
            {show?.vote_average ? ` • ${show.vote_average.toFixed(1)}/10` : ''}
          </p>
          <p className="max-w-xl text-gray-300 mb-6 line-clamp-3">
            {show?.overview}
          </p>
          
          <h3 className="text-xl font-semibold mb-4">Your Custom Playlist</h3>
          <p className="text-gray-300 mb-6">Based on the mood, era, and themes of "{show?.name}"</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSavePlaylist}
              disabled={savedToSpotify || isSaving}
              className={`btn-primary flex items-center ${savedToSpotify ? 'bg-green-700 cursor-default' : ''}`}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                  Saving...
                </>
              ) : savedToSpotify ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                  Saved to Spotify
                </>
              ) : (
                <>
                  <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.3 16.7 16.05 16.8 15.8 16.8C15.55 16.8 15.3 16.7 15.1 16.5C13.55 14.95 11.45 14.95 9.9 16.5C9.7 16.7 9.45 16.8 9.2 16.8C8.95 16.8 8.7 16.7 8.5 16.5C8.1 16.1 8.1 15.5 8.5 15.1C10.75 12.85 14.25 12.85 16.5 15.1C16.9 15.5 16.9 16.1 16.5 16.5Z" fill="currentColor"/>
                  </svg>
                  Save to Spotify
                </>
              )}
            </motion.button>
          </div>
          
          {error && (
            <div className="mt-4 text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4"
      >
        {playlist?.tracks?.map((track, index) => (
          <motion.div
            key={track.id}
            variants={item}
            className={`glass-card p-4 flex items-center transition-colors cursor-pointer ${activeTrack?.id === track.id ? 'border-[rgb(var(--accent-spotify))] bg-white/20' : ''}`}
            onClick={() => setActiveTrack(track)}
          >
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">
              {index + 1}
            </div>
            
            <div className="flex-shrink-0 relative w-12 h-12 mr-4">
              <Image
                src={track.album.images[0]?.url || '/placeholder-album.png'}
                alt={track.album.name}
                fill
                className="rounded-md object-cover"
              />
            </div>
            
            <div className="flex-grow overflow-hidden">
              <div className="font-medium truncate">{track.name}</div>
              <div className="text-sm text-gray-300 truncate">
                {track.artists.map(artist => artist.name).join(', ')}
              </div>
            </div>
            
            <div className="ml-4 text-sm text-gray-300">
              {Math.floor(track.duration_ms / 60000)}:
              {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
            </div>
          </motion.div>
        ))}
      </motion.div>
      
      {activeTrack && (
        <div className="fixed bottom-0 left-0 right-0">
          <SpotifyPlayer track={activeTrack} />
        </div>
      )}
    </motion.div>
  );
}