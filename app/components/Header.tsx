'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import UserMenu from './UserMenu';
import { motion } from 'framer-motion';

export default function Header() {
  const { data: session } = useSession();

  return (
    <motion.header 
      className="flex justify-between items-center py-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <div className="mr-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.5 16.5C16.3 16.7 16.05 16.8 15.8 16.8C15.55 16.8 15.3 16.7 15.1 16.5C13.55 14.95 11.45 14.95 9.9 16.5C9.7 16.7 9.45 16.8 9.2 16.8C8.95 16.8 8.7 16.7 8.5 16.5C8.1 16.1 8.1 15.5 8.5 15.1C10.75 12.85 14.25 12.85 16.5 15.1C16.9 15.5 16.9 16.1 16.5 16.5ZM18.2 13.8C18 14 17.8 14.1 17.5 14.1C17.2 14.1 17 14 16.8 13.8C14.4 11.4 11.6 11.4 9.2 13.8C9 14 8.8 14.1 8.5 14.1C8.2 14.1 8 14 7.8 13.8C7.4 13.4 7.4 12.8 7.8 12.4C11 9.2 15 9.2 18.2 12.4C18.6 12.8 18.6 13.4 18.2 13.8ZM19.9 11.1C19.7 11.3 19.5 11.4 19.2 11.4C18.9 11.4 18.7 11.3 18.5 11.1C15.3 7.9 10.7 7.9 7.5 11.1C7.3 11.3 7.1 11.4 6.8 11.4C6.5 11.4 6.3 11.3 6.1 11.1C5.7 10.7 5.7 10.1 6.1 9.7C10.1 5.7 15.9 5.7 19.9 9.7C20.3 10.1 20.3 10.7 19.9 11.1Z" fill="#1ED760"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold">ShowTunes</h1>
      </div>
      
      {session && (
        <UserMenu user={session.user} />
      )}
    </motion.header>
  );
}