import React from 'react';

// Define the Login component
export default function Login() {

    // Function to handle the "Connect Spotify" button click
    const handleClick = async () => {
        const client_id = "2001f432f477474898e3d555e8c270a2"; // Spotify API client ID
        const redirect_uri = "http://localhost:3000/"; // Redirect URI after authorization
        const api_uri = "https://accounts.spotify.com/authorize"; // Spotify authorization endpoint
        const scope = [
            "user-read-private", // Access user's private information
            "user-read-email", // Access user's email
            "user-modify-playback-state", // Control playback state
            "user-read-playback-state", // Access playback state
            "user-read-currently-playing", // Access currently playing track
            "user-read-recently-played", // Access recently played tracks
            "user-top-read", // Access user's top tracks
            "user-read-email", // Access user's email (repeated)
            "playlist-read-private", // Access private playlists
            "playlist-read-collaborative", // Access collaborative playlists
        ];

        // Redirect the user to the Spotify authorization page with the specified parameters
        window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
            " "
        )}&response_type=token`;
    };

    return (
        <div class="flex justify-center items-center flex-col h-screen w-screen bg-green-500 gap-20">
            {/* Spotify logo */}
            <img class="h-1/5" 
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png" 
                alt="Spotify" 
            />
            {/* "Connect Spotify" button */}
            <button onClick={handleClick} class="px-20 py-4 rounded-full bg-black text-green-500 text-lg cursor-pointer">Connect Spotify</button>
        </div>
    );
}
