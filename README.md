TV Show to Spotify Playlist Generator
A web application that generates custom Spotify playlists based on TV shows. Simply enter your favorite TV show, and our AI will create a playlist of 5 songs that match the show's mood, era, and themes.
Features

Search for any TV show
AI-powered song recommendations based on show characteristics
Spotify integration for playback and playlist saving
Responsive and animated UI

Tech Stack

React with Next.js
Tailwind CSS for styling
Framer Motion for animations
Spotify Web API
OpenAI API for recommendations
TMDB API for TV show information

Getting Started
Prerequisites

Node.js 18+ and npm
Spotify Developer Account
OpenAI API Key
TMDB API Key

Installation

Clone the repository
bashgit clone https://github.com/yourusername/spotify-tv-matcher.git
cd spotify-tv-matcher

Install dependencies
bashnpm install

Create a .env.local file in the root directory with the following variables:
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback/spotify
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key
TMDB_API_KEY=your_tmdb_api_key

Run the development server
bashnpm run dev

Open http://localhost:3000 in your browser

API Setup
Spotify API

Go to Spotify Developer Dashboard
Create a new application
Set the redirect URI to http://localhost:3000/api/auth/callback/spotify
Copy the Client ID and Client Secret to your .env.local file

OpenAI API

Get your API key from OpenAI
Add it to your .env.local file

TMDB API

Create an account on TMDB
Go to settings > API and request an API key
Add it to your .env.local file

Usage

Sign in with your Spotify account
Search for a TV show
View the generated playlist
Play songs directly or save the playlist to your Spotify account

License
MIT
Acknowledgments

Spotify Web API
OpenAI
The Movie Database (TMDB)
