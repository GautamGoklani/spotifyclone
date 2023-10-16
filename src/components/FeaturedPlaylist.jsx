// Import necessary dependencies and components
import { PlayIcon } from '@heroicons/react/24/solid'; // Import the PlayIcon component from Heroicons
import { useStateProvider } from '../utils/StateProvider'; // Import the StateProvider context
import React, { useEffect, useState } from 'react'; // Import React, useEffect, and useState from React library

// Define the FeaturedPlaylists component
const FeaturedPlaylists = ({ setView, setGlobalPlaylistId }) => {

  // Extract the Spotify access token from the state provider
  const [{ token }] = useStateProvider();

  // Define state variables
  const [playlists, setPlaylists] = useState([]); // Store featured playlists

  // Function to select a playlist and update the view and globalPlaylistId
  function selectPlaylist(playlist) {
    setView("playlist"); // Set the view to "playlist"
    setGlobalPlaylistId(playlist.id); // Set the globalPlaylistId to the selected playlist's id
  }

  // Use useEffect to fetch featured playlists when the token changes
  useEffect(() => {
    async function fetchData() {
      // Fetch featured playlists from the Spotify API
      const response = await fetch("https://api.spotify.com/v1/browse/featured-playlists?" + new URLSearchParams({
        country: "US"
      }), {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      setPlaylists(data.playlists.items); // Update the playlists state with fetched data
    }
    fetchData();
  }, [token]); // The effect depends on the token value

  return (
    <div className='flex flex-col gap-16 px-8 h-screen overflow-y-scroll'>
      <h2 className='text-xl font-bold'></h2> {/* Missing text */}
      <div className='flex flex-wrap gap-6 mb-48'>
        {/* Map through and render featured playlists */}
        {playlists?.map((playlist) => {
          return (
            <div onClick={() => selectPlaylist(playlist)} key={playlist.id} className='cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4'>
              <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6'>
                <PlayIcon className='h-6 w-6 text-black' /> {/* PlayIcon for each playlist */}
              </div>
              <img className='w-48 h-48 mb-4' src={playlist.images[0].url} /> {/* Playlist image */}
              <p className='text-base text-white mb-1 w-48 truncate'>{playlist.name}</p> {/* Playlist name */}
              <p className='text-sm text-neutral-400 mb-8 w-48 truncate'>By {playlist.owner.display_name}</p> {/* Owner's display name */}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturedPlaylists;