'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function SpotifyPlayer({ track }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Reset expanded state when track changes
  useEffect(() => {
    setIsExpanded(false);
  }, [track.id]);

  return (
    <motion.div 
      className="glass-card border-t border-white/20 backdrop-blur-xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", bounce: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center py-3">
          <div className="flex-shrink-0 relative w-12 h-12 mr-4">
            <Image
              src={track.album.images[0]?.url || '/placeholder-album.png'}
              alt={track.album.name}
              fill
              className="rounded-md object-cover"
            />
          </div>
          
          <div className="flex-grow overflow-hidden mr-4">
            <div className="font-medium truncate">{track.name}</div>
            <div className="text-sm text-gray-300 truncate">
              {track.artists.map(artist => artist.name).join(', ')}
            </div>
          </div>
          
          <a 
            href={track.external_urls.spotify} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-shrink-0 btn-secondary text-sm py-2 px-4 mr-3"
          >
            Listen on Spotify
          </a>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <svg className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <motion.div 
          className="border-t border-white/10 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <div className="relative w-full pb-[100%] md:max-w-xs">
                  <Image
                    src={track.album.images[0]?.url || '/placeholder-album.png'}
                    alt={track.album.name}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h3 className="text-2xl font-bold mb-1">{track.name}</h3>
                <p className="text-lg text-gray-300 mb-4">
                  {track.artists.map(artist => artist.name).join(', ')}
                </p>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">Album</div>
                  <div className="font-medium">{track.album.name}</div>
                  <div className="text-sm text-gray-300">
                    {new Date(track.album.release_date).getFullYear()}
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-gray-400 mb-1">Duration</div>
                  <div className="font-medium">
                    {Math.floor(track.duration_ms / 60000)}:
                    {String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href={track.external_urls.spotify} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary flex items-center"
                  >
                    <svg width="16" height="16" className="mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.3 16.7 16.05 16.8 15.8 16.8C15.55 16.8 15.3 16.7 15.1 16.5C13.55 14.95 11.45 14.95 9.9 16.5C9.7 16.7 9.45 16.8 9.2 16.8C8.95 16.8 8.7 16.7 8.5 16.5C8.1 16.1 8.1 15.5 8.5 15.1C10.75 12.85 14.25 12.85 16.5 15.1C16.9 15.5 16.9 16.1 16.5 16.5Z" fill="currentColor"/>
                    </svg>
                    Play on Spotify
                  </a>
                  
                  <a 
                    href={`https://open.spotify.com/album/${track.album.id}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    View Album
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}