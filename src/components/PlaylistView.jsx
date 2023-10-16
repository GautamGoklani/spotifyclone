import { shuffle } from 'lodash';
import React, { useEffect, useState } from 'react';
import Song from './Song';
import { useStateProvider } from '../utils/StateProvider';

// Array of gradient colors for the playlist header
const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500'
];

// Define the PlaylistView component
const PlaylistView = ({ globalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setView, setGlobalArtistId }) => {
  // Extract the Spotify access token from the state provider
  const [{ token }] = useStateProvider();

  // Define state variables
  const [playlistData, setPlaylistData] = useState(null); // Store playlist information
  const [color, setColor] = useState(colors[0]); // Store gradient color for the header
  const [opacity, setOpacity] = useState(0); // Opacity for the header
  const [textOpacity, setTextOpacity] = useState(0); // Opacity for header text
  const [loading, setLoading] = useState(true); // Loading indicator

  // Function to change the opacity of the header based on scroll position
  function changeOpacity(scrollPos) {
    const offset = 300;
    const textOffset = 10;

    if (scrollPos < offset) {
      const newOpacity = 1 - ((offset - scrollPos) / offset);
      setOpacity(newOpacity);
      setTextOpacity(0);
    } else {
      setOpacity(1);
      const delta = scrollPos - offset;
      const newTextOpacity = 1 - ((textOffset - delta) / textOffset);
      setTextOpacity(newTextOpacity);
    }
  }

  // Use useEffect to fetch playlist data and update the state when the token or globalPlaylistId changes
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch playlist data using the Spotify API
        const response = await fetch(`https://api.spotify.com/v1/playlists/${globalPlaylistId}`, {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          console.error('Error fetching playlist data:', response.statusText);
          return;
        }

        const data = await response.json();
        setPlaylistData(data);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData(); // Call the fetchData function

    // Specify dependencies for this effect
  }, [token, globalPlaylistId]);

  // Use useEffect to select a random gradient color when globalPlaylistId changes
  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [globalPlaylistId]);

  // Render the PlaylistView component
  return (
    <div className='flex-grow h-screen'>
      <header style={{ opacity: opacity }} className='text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold'>
        <div style={{ opacity: textOpacity }} className='flex items-center'>
          {playlistData && <img className='h-8 w-8 mr-6' src={playlistData.images[0].url} alt="Playlist Cover" />}
          <p>{playlistData?.name}</p>
        </div>
      </header>
      <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className='relative -top-20 h-screen overflow-y-scroll bg-neutral-900'>
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
          {playlistData && <img className='h-44 w-44' src={playlistData.images[0].url} alt="Playlist Cover" />}
          <div>
            <p className='text-sm font-bold'>Playlist</p>
            <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold'>{playlistData?.name}</h1>
          </div>
        </section>
        <div className='text-white px-8 flex flex-col space-y-1 pb-28'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            playlistData?.tracks.items && playlistData.tracks.items.length > 0 ? (
              // Map through the tracks in the playlist and render Song components
              playlistData.tracks.items.map((track, i) => (
                <Song
                  setView={setView}
                  setGlobalArtistId={setGlobalArtistId}
                  setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                  setGlobalCurrentSongId={setGlobalCurrentSongId}
                  key={track.track.id}
                  sno={i}
                  track={track.track}
                />
              ))
            ) : (
              <p>No songs in the playlist</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;