import React, { useState } from 'react'
import Sidebar from './Sidebar';
import PlaylistView from './PlaylistView'
import Home from "./Home"
import Search from "./Search"
import Library from "./Library"
import Artist from "./Artist"
import Player from "./Player"

function Spotify() {
  const [view, setView] = useState("home")
  const [globalPlaylistId, setGlobalPlaylistId] = useState(null)
  const [globalArtistId, setGlobalArtistId] = useState(null)
  const [globalCurrentSongId, setGlobalCurrentSongId] = useState(null)
  const [globalIsTrackPlaying, setGlobalIsTrackPlaying] = useState(false)

  return (
    <div className="h-screen overflow-hidden bg-black text-white">
      <div className="flex w-full">
        <Sidebar 
          view={view}
          setView={setView}
          setGlobalPlaylistId={setGlobalPlaylistId}
        />
         {view === "playlist" && <PlaylistView
            setView={setView}
            globalPlaylistId={globalPlaylistId}
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