import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import OpenAI from "openai";
import { authOptions } from "../auth/[...nextauth]/route";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to get show details from TMDB
async function getShowDetails(showId) {
  try {
    const apiKey = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/tv/${showId}?api_key=${apiKey}&append_to_response=keywords,credits`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`TMDB API responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching show details:", error);
    throw error;
  }
}

// Helper function to search Spotify for tracks
async function searchSpotifyTracks(query, accessToken) {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        query
      )}&type=track&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Spotify API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return data.tracks.items[0] || null;
  } catch (error) {
    console.error("Error searching Spotify:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    const { show } = await request.json();

    if (!show || !show.id) {
      return NextResponse.json(
        { error: "Show information is required" },
        { status: 400 }
      );
    }

    // Get detailed information about the show
    const showDetails = await getShowDetails(show.id);

    // Extract relevant information for the AI prompt
    const genres = showDetails.genres.map((g) => g.name).join(", ");
    const era = showDetails.first_air_date
      ? new Date(showDetails.first_air_date).getFullYear()
      : "unknown era";
    const creators = showDetails.created_by.map((c) => c.name).join(", ");
    const keywords =
      showDetails.keywords?.results?.map((k) => k.name).join(", ") || "";

    // Create the prompt for OpenAI
    const prompt = `
      Create a playlist of 5 songs that would be the perfect soundtrack for the TV show "${show.name}".
      
      Information about the show:
      - Genres: ${genres}
      - Era: ${era}
      - Created by: ${creators}
      - Overview: ${show.overview}
      - Keywords: ${keywords}
      
      For each song, provide:
      1. Song title
      2. Artist name
      3. A brief explanation of why this song fits the show (max 2 sentences)
      
      Format your response as a JSON array with objects containing songTitle, artist, and reason fields.
      Don't include any text before or after the JSON.
    `;

    // Get song recommendations from OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Update to whatever model is current
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const recommendations = JSON.parse(completion.choices[0].message.content);

    // Search for each recommended song on Spotify
    const tracks = [];
    for (const rec of recommendations) {
      const searchQuery = `${rec.songTitle} ${rec.artist}`;
      const track = await searchSpotifyTracks(searchQuery, session.accessToken);

      if (track) {
        tracks.push({
          ...track,
          reason: rec.reason,
        });
      }
    }

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      { error: "Failed to generate playlist" },
      { status: 500 }
    );
  }
}
