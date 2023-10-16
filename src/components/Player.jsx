import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';
import { useStateProvider } from '../utils/StateProvider';

// Define the Player component
const Player = ({ globalCurrentSongId, setGlobalCurrentSongId, globalIsTrackPlaying, setGlobalIsTrackPlaying }) => {
  // Extract the Spotify access token from the state provider
  const [{ token }] = useStateProvider();

  // Define state variables
  const [songInfo, setSongInfo] = useState(null); // Store information about the currently playing song
  const [loading, setLoading] = useState(false); // Loading indicator
  const [error, setError] = useState(null); // Error message

  // Function to fetch information about a song using its trackId
  async function fetchSongInfo(trackId) {
    try {
      if (trackId) {
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setError('Error fetching song info');
          return;
        }

        const data = await response.json();
        setSongInfo(data);
      }
    } catch (error) {
      console.error('Error fetching song info:', error);
      setError('Error fetching song info');
    }
  }

  // Function to get information about the currently playing track
  async function getCurrentlyPlaying() {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204) {
        console.log("204 response from currently playing");
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching currently playing:', error);
      setError('Error fetching currently playing');
      return null;
    }
  }

  // Function to handle play/pause button click
  async function handlePlayPause() {
    if (token) {
      try {
        setLoading(true);
        setError(null);
        const data = await getCurrentlyPlaying();

        console.log('Data from getCurrentlyPlaying:', data);

        if (data && data.is_playing) {
          // Pause the currently playing track
          const pauseResponse = await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (pauseResponse.status === 204) {
            setGlobalIsTrackPlaying(false);
          }
        } else {
          // Resume or play a track
          const trackId = data?.item?.id;

          if (trackId) {
            // Play the specified track
            const playResponse = await fetch("https://api.spotify.com/v1/me/player/play", {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                uris: [`spotify:track:${trackId}`],
              }),
            });

            console.log('Play response:', playResponse);

            if (playResponse.status === 204) {
              setGlobalIsTrackPlaying(true);
              setGlobalCurrentSongId(trackId);
            }
          }
        }
      } catch (error) {
        console.error('Error handling play/pause:', error);
        setError('Error handling play/pause');
      } finally {
        setLoading(false);
      }
    }
  }

  // Use useEffect to fetch data and update the state when token, globalCurrentSongId, or setGlobalIsTrackPlaying change
  useEffect(() => {
    // Fetch data and update state based on the current song
    async function fetchData() {
      try {
        if (token) {
          if (!globalCurrentSongId) {
            const data = await getCurrentlyPlaying();

            if (data) {
              setGlobalCurrentSongId(data?.item?.id);

              if (data?.is_playing) {
                setGlobalIsTrackPlaying(true);
              }

              await fetchSongInfo(data?.item?.id);
            }
          } else {
            await fetchSongInfo(globalCurrentSongId);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      }
    }

    fetchData(); // Call the fetchData function

    // Specify dependencies for this effect
  }, [token, globalCurrentSongId, setGlobalCurrentSongId, setGlobalIsTrackPlaying]);

  // Render the Player component
  return (
    <div className='h-24 bg-neutral-800 border-t border-neutral-700 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      <div className='flex items-center space-x-4'>
        {songInfo?.album?.images?.[0]?.url && (
          <img className='hidden md:inline h-10 w-10' src={songInfo.album.images[0].url} alt='Album Cover' />
        )}
        <div>
          <p className='text-white text-sm'>{loading ? 'Loading...' : error || songInfo?.name || 'No Song Playing'}</p>
          <p className='text-neutral-400 text-xs'>{loading ? 'Loading...' : error || songInfo?.artists?.[0]?.name || 'Unknown Artist'}</p>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {globalIsTrackPlaying ? (
              // Render the pause button when a track is playing
              <PauseCircleIcon
                onClick={handlePlayPause}
                className='h-10 w-10 cursor-pointer'
                aria-label='Pause'
                role='button'
              />
            ) : (
              // Render the play button when no track is playing
              <PlayCircleIcon
                onClick={handlePlayPause}
                className='h-10 w-10 cursor-pointer'
                aria-label='Play'
                role='button'
              />
            )}
          </>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Player;