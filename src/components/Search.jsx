import {  MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { useStateProvider } from '../utils/StateProvider';
import FeaturedPlaylist from './FeaturedPlaylist';
import SearchResults from './SearchResults';

const Search = ({ setView, setGlobalPlaylistId, setGlobalCurrentSongId, setGlobalIsTrackPlaying, setGlobalArtistId }) => {
    const [{ token }] = useStateProvider();

    // State variables
    const [searchData, setSearchData] = useState(null); // Store search results
    const [inputValue, setInputValue] = useState(''); // Store user input
    const inputRef = useRef(null); // Reference to the search input field

    // Function to update search results based on user input
    async function updateSearchResults(query) {
        // Send a request to Spotify API for search results
        const response = await fetch("https://api.spotify.com/v1/search?" + new URLSearchParams({
            q: query,
            type: ["artist", "playlist", "track"]
        }), {
            headers: {
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            }
        });

        // Parse the response JSON and update searchData state
        const data = await response.json();
        setSearchData(data);
    }

    // Use effect to focus on the search input field when the component mounts
    useEffect(() => {
        inputRef.current.focus();
    }, [inputRef]);

    return (
        <div className='flex-grow h-screen'>
            <header className='text-white sticky top-0 h-20 z-10 text-4xl flex items-center px-8'>
                {/* Search icon */}
                <MagnifyingGlassIcon className='absolute top-7 left-10 h-6 w-6 text-neutral-800' />
                {/* Search input field */}
                <input
                    value={inputValue}
                    onChange={async (e) => {
                        setInputValue(e.target.value);
                        // Call the updateSearchResults function when the input value changes
                        await updateSearchResults(e.target.value);
                    }}
                    ref={inputRef}
                    className='rounded-full bg-white w-96 pl-12 text-neutral-900 text-base py-2 font-normal outline-0'
                />
            </header>
            <div>
                {/* Conditional rendering based on searchData */}
                {searchData === null ? (
                    // Render the featured playlist when no search results are available
                    <FeaturedPlaylist
                        setView={setView}
                        setGlobalPlaylistId={setGlobalPlaylistId}
                    />
                ) : (
                    // Render search results when searchData is available
                    <SearchResults
                        playlists={searchData?.playlists?.items}
                        songs={searchData?.tracks?.items}
                        artists={searchData?.artists?.items}
                        setView={setView}
                        setGlobalPlaylistId={setGlobalPlaylistId}
                        setGlobalCurrentSongId={setGlobalCurrentSongId}
                        setGlobalIsTrackPlaying={setGlobalIsTrackPlaying}
                        setGlobalArtistId={setGlobalArtistId}
                    />
                )}
            </div>
        </div>
    );
}

export default Search;
