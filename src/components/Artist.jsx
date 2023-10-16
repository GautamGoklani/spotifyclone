// Import necessary dependencies and components
import React, { useEffect, useState } from 'react';
import Song from './Song'; // Import the Song component
import { useStateProvider } from '../utils/StateProvider'; // Import the StateProvider context
import { shuffle } from 'lodash'; // Import the shuffle function from lodash library
import { PlayIcon } from '@heroicons/react/24/solid'; // Import a PlayIcon from the Heroicons library

// Define an array of CSS color classes
const colors = [
    'from-indigo-500',
    'from-blue-500',
    'from-green-500',
    'from-red-500',
    'from-yellow-500',
    'from-pink-500',
    'from-purple-500'
]

// Define the Artist component
const Artist = ({ setView, globalArtistId, setGlobalArtistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying }) => {
    
    // Extract the Spotify access token from the state provider
    const [{ token }] = useStateProvider();

    // Define state variables
    const [color, setColor] = useState(colors[0]); // Current background color
    const [opacity, setOpacity] = useState(0); // Opacity of the header
    const [textOpacity, setTextOpacity] = useState(0); // Opacity of text in the header
    const [artistData, setArtistData] = useState(null); // Data of the artist
    const [topTracks, setTopTracks] = useState([]); // Top tracks of the artist
    const [relatedArtists, setRelatedArtists] = useState([]); // Related artists to the current artist

    // Function to change opacity based on scroll position
    function changeOpacity(scrollPos) {
        // Calculate opacity and textOpacity based on scroll position
        const offset = 300;
        const textOffset = 10;
        if (scrollPos < offset) {
            // Header fades in and text is hidden as you scroll down
            const newOpacity = 1 - ((offset - scrollPos) / offset);
            setOpacity(newOpacity);
            setTextOpacity(0);
        } else {
            // Header remains fully opaque, and text fades in as you scroll further
            setOpacity(1);
            const delta = scrollPos - offset;
            const newTextOpacity = 1 - ((textOffset - delta) / textOffset);
            setTextOpacity(newTextOpacity);
        }
    }

    // Function to fetch artist data from Spotify API
    async function getArtistData() {
        const response = await fetch(`https://api.spotify.com/v1/artists/${globalArtistId}`, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return data;
    }

    // Function to fetch top tracks of the artist from Spotify API
    async function getTopTracks() {
        const response = await fetch(`https://api.spotify.com/v1/artists/${globalArtistId}/top-tracks?` + new URLSearchParams({ market: "US" }), {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return data.tracks;
    }

    // Function to fetch related artists from Spotify API
    async function getRelatedArtists() {
        const response = await fetch(`https://api.spotify.com/v1/artists/${globalArtistId}/related-artists`, {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        return data.artists;
    }

    // Use useEffect to fetch data when the token or globalArtistId changes
    useEffect(() => {
        async function fetchData() {
            // Fetch artist data, top tracks, and related artists
            setArtistData(await getArtistData());
            setTopTracks(await getTopTracks());
            setRelatedArtists(await getRelatedArtists());
        }
        fetchData();
    }, [token, globalArtistId,setArtistData,setTopTracks,setRelatedArtists]);

    // Use useEffect to change the background color when globalArtistId changes
    useEffect(() => {
        // Shuffle the colors array and set the background color to the last color
        setColor(shuffle(colors).pop());
    }, [globalArtistId]);

    // Render the Artist component
    return (
        <div className='flex-grow h-screen'>
            {/* Header */}
            <header style={{ opacity: opacity }} className='text-white sticky top-0 h-20 z-10 text-4xl bg-neutral-800 p-8 flex items-center font-bold'>
                <div style={{ opacity: textOpacity }} className='flex items-center'>
                    {/* Artist image */}
                    {artistData && <img className='h-8 w-8 mr-6' src={artistData?.images[0]?.url} />}
                    {/* Artist name */}
                    <p>{artistData?.name}</p>
                </div>
            </header>
            <div onScroll={(e) => changeOpacity(e.target.scrollTop)} className='relative -top-20 h-screen overflow-y-scroll bg-neutral-900'>
                {/* Artist information section */}
                <section className={`flex items-end space-x-7 bg-gradient-to-b to-neutral-900 ${color} h-80 text-white p-8`}>
                    {artistData && <img className='h-44 w-44 rounded-full' src={artistData?.images[0]?.url} />}
                    <div>
                        <p className='text-sm font-bold'>Artist</p>
                        <h1 className='text-2xl md:text-3xl lg:text-5xl font-extrabold'>{artistData?.name}</h1>
                    </div>
                </section>
                {/* Top tracks section */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-bold px-8'>Top tracks</h2>
                    <div className='text-white px-8 flex flex-col space-y-1 pb-6'>
                        {/* Map through top tracks and render Song components */}
                        {topTracks?.map((track, i) => {
                            // Song component
                            return <Song
                                setView={setView}
                                setGlobalArtistId={setGlobalArtistId}
                                setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                                setGlobalCurrentSongId={setGlobalCurrentSongId}
                                key={track.id}
                                sno={i}
                                track={track}
                            />
                        })}
                    </div>
                </div>
                {/* Related artists section */}
                <div className='space-y-4'>
                    <h2 className='text-xl font-bold px-8'>Related artists</h2>
                    <div className='flex flex-wrap gap-4 px-8 pb-28'>
                        {/* Map through related artists and render artist cards */}
                        {relatedArtists?.slice(0, 4)?.map((artist) => {
                            return <div onClick={() => setGlobalArtistId(artist?.id)} key={artist.id} className='cursor-pointer relative group w-56 mb-2 bg-neutral-800 hover:bg-neutral-600 rounded-md p-4'>
                                <div className='absolute opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200 shadow-2xl shadow-neutral-900 z-10 h-12 w-12 flex items-center justify-center rounded-full bg-green-500 top-[156px] group-hover:top-[148px] right-6'>
                                    <PlayIcon className='h-6 w-6 text-black' />
                                </div>
                                {/* Artist image */}
                                <img className='w-48 h-48 mb-4 rounded-full' src={artist?.images[0]?.url} />
                                {/* Artist name */}
                                <p className='text-base text-white mb-1 w-48 truncate'>{artist?.name}</p>
                                {/* Artist type */}
                                <p className='text-sm text-neutral-400 mb-8 w-48 truncate'>Artist</p>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Artist;
