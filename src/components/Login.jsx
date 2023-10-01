import React from 'react'

export default function Login() {
    const handleClick = async () => {
        const client_id = "2001f432f477474898e3d555e8c270a2";
        const redirect_uri = "http://localhost:3000/";
        const api_uri = "https://accounts.spotify.com/authorize";
        const scope = [
            "user-read-private",
            "user-read-email",
            "user-modify-playback-state",
            "user-read-playback-state",
            "user-read-currently-playing",
            "user-read-recently-played",
            "user-top-read",
            "user-read-email",
            "playlist-read-private",
            "playlist-read-collaborative",
        ];
        window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
            " "
        )}&response_type=token`;
    };
    return (

        <div class="flex justify-center items-center flex-col h-screen w-screen bg-green-500 gap-20">
            <img class="h-1/5" 
                src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png" 
                alt="Spotify" 
            />
            <button onClick={handleClick} class="px-20 py-4 rounded-full bg-black text-green-500 text-lg cursor-pointer">Connect Spotify</button>
        </div>

    );
}
