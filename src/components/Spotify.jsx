import React, { useState } from 'react'
import Sidebar from './Sidebar';
import PlaylistView from './PlaylistView'
import Home from "./Home"
import Search from "./Search"
import Library from "./Library"
import Artist from "./Artist"
import Player from "./Player"

function Spotify() {
  // State variables to manage various aspects of the app
  const [view, setView] = useState("home"); // Determine the current view
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null); // Store the current playlist ID
  const [globalArtistId, setGlobalArtistId] = useState(null); // Store the current artist ID
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState(null); // Store the current song ID
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false); // Track if a song is playing or not

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex w-full">
        {/* Sidebar component for navigation */}
        <Sidebar 
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
        
        {/* Conditionally render different views based on 'view' state */}
        {view === "playlist" && <PlaylistView
            setView={setView}
            globalPlaylistId={globalPlaylistId}
            setGlobalArtistId={setGlobalArtistId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalPlaylistId={setGlobalPlaylistId}
          />}
        {view === "home" && <Home 
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setGlobalArtistId={setGlobalArtistId}
          />}
        {view === "search" && <Search
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            setGlobalArtistId={setGlobalArtistId}
          />}
        {view === "library" && <Library
            setView={setView}
            setGlobalPlaylistId={setGlobalPlaylistId}
          />}
        {view === "artist" && <Artist
            setView={setView}
            globalArtistId={globalArtistId}
            setGlobalArtistId={setGlobalArtistId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
          />}
      </div>
      
      <div className="sticky z-20 bottom-0 w-full">
        {/* Player component for controlling and displaying music playback */}
        <Player
            globalCurrentSongId={globalCurrentSongId}
            setGlobalCurrentSongId={setGlobalCurrentSongId}
            setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
            globalIsTrackPlaying={globalIsTrackPlaying}
          />
      </div>
    </div>
  )
}

export default Spotify
