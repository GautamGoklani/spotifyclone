import { PlayIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring"; // Importing animation utilities
import { useStateProvider } from "../utils/StateProvider";

const Song = ({
  sno,
  track,
  setView,
  setGlobalArtistId,
}) => {
  const [{ token }] = useStateProvider(); // Destructuring token from state
  const [hover, setHover] = useState(false); // State to track hover state
  const [loading, setLoading] = useState(false); // State to track loading state

  // Defining a fade-in animation for the song component
  const fadeIn = useSpring({
    opacity: loading ? 0 : 1, // Animate opacity from 0 to 1 when not loading
    from: { opacity: 0 }, // Starting opacity is 0
  });

  // Function to play a song
  async function playSong(track) {
    try {
      // Sending a request to play the song
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/play",
        {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris: [track.uri],
          }),
        }
      );

      console.log("on play", response.status);

      if (!response.ok) {
        console.error("Error playing song:", response.statusText);
      }
    } catch (error) {
      console.error("Error playing song:", error);
    } finally {
      setLoading(false); // Set loading state to false when the operation is done
    }
  }

  // Function to convert milliseconds to minutes and seconds
  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  // Function to select an artist and update the view
  function selectArtist(artist) {
    setGlobalArtistId(artist.id);
    console.log(artist.id)
    setView("artist");
  }

  return (
    <animated.div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={fadeIn}
      className="grid grid-cols-2 text-neutral-400 text-sm py-4 px-5 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-default"
    >
      <div className="flex items-center space-x-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {hover ? (
              <PlayIcon
                onClick={() => playSong(track)}
                className="h-5 w-5 text-white"
                aria-label="Play"
                role="button"
              />
            ) : (
              <p className="w-5">{sno + 1}</p>
            )}
          </>
        )}
        {track?.album?.images[0]?.url && (
          <img
            className="h-10 w-10"
            src={track.album.images[0].url}
            alt="Album Cover"
          />
        )}
        <div>
          <p className="w-36 lg:w-64 truncate text-white text-base">
            {track.name}
          </p>
          <p className="w-36 truncate">
            {track.artists.map((artist, i) => (
              <React.Fragment key={i}>
                <span
                  onClick={() => selectArtist(artist)}
                  className="hover:underline"
                >
                  {artist.name}
                </span>
                {i !== track.artists.length - 1 && ", "}
              </React.Fragment>
            ))}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between ml-auto md:ml-0">
        <p className="w-40 truncate hidden md:inline">{track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.duration_ms)}</p>
      </div>
    </animated.div>
  );
};

export default Song;
