"use client";
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './live.module.css';

const LivePage = () => {
  const [songTitle, setSongTitle] = useState('Waiting for next song...');
  const [songAuthor, setSongAuthor] = useState('');
  const [lyrics, setLyrics] = useState([]);
  const [instrument, setInstrument] = useState('')
  const [wsError, setWsError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminWs, setAdminWs] = useState(null)

  const router = useRouter();
  const scrollInterval = useRef(null);


  useEffect(() => {
    const serverURL = process.env.NEXT_PUBLIC_WS_URL;
    const checkAdmin = localStorage.getItem('isAdmin');
    setIsAdmin(checkAdmin === 'true');
    const data = JSON.parse(localStorage.getItem('playerData'));
    setLyrics(data.lyrics)
    const queryInstrument = localStorage.getItem('instrument');
    setInstrument(queryInstrument);
    setSongTitle(data.name);
    setSongAuthor(data.author);
    if (!queryInstrument) {
      console.log("Instrument is not set, skipping WebSocket connection.");
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_WS_URL;
    const wsConnection = new WebSocket(`${serverUrl}player`);

    wsConnection.onopen = () => {
      console.log('WebSocket connection established for player');
    };

    wsConnection.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsConnection.onclose = (event) => {
      console.log("WebSocket connection closed", event);
    };

    wsConnection.onmessage = (event) => {
      // Prevent starting with scrolling down
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
      if (event?.data === "quit") {
        const checkAdmin = localStorage.getItem('isAdmin');
        if(checkAdmin !== 'true'){
          router.push("player");
        }
        return;
      }
      const {name, author, lyrics} = JSON.parse(event.data)
      setSongTitle(name)
      setSongAuthor(author)
      setLyrics(lyrics)
    };
 }, []);

  const toggleScroll = () => {
    if (!scrollInterval.current) {
      const interval = setInterval(() => {
        window.scrollBy(0, 1);
      }, 50);
      scrollInterval.current = interval;
    } else {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  const onQuit = async () => {
    const serverUrl = process.env.NEXT_PUBLIC_WS_URL;
    const wsAdminConnection = new WebSocket(`${serverUrl}admin`);

    // Listen for the 'open' event to ensure the connection is established
    wsAdminConnection.onopen = () => {

        wsAdminConnection.send("quit");
        router.push("admin");
    };

    // Handle potential connection errors
    wsAdminConnection.onerror = (error) => {
        console.error("WebSocket error:", error);
    };

    // Optional: Handle when the connection closes
    wsAdminConnection.onclose = () => {
        console.log("WebSocket connection closed.");
    };
  };

  return (
    <div className={styles.liveContainer}>
    {/* Display WebSocket error if any */}
    {wsError && <div className={styles.errorMessage}>{wsError}</div>}

    {/* Song Title */}
    <h1 className={styles.songTitle}>{songTitle}</h1>
    {/* Song Author */}
    <h1 className={styles.songAuthor}>By {songAuthor}</h1>

    {/* Lyrics and Chords */}
    <div className={styles.lyrics}>
        {lyrics.map((paragraph, index) => (
          <div key={index}>
            {paragraph.map((line, lineIndex) => (
              <p key={lineIndex}>
                {line.lyrics} 
                {/* Display chords only if instrument is not vocals */}
                {instrument.toLowerCase() !== "vocals" && line.chords && <span>({line.chords})</span>}
              </p>
            ))}
          </div>
        ))}
      </div>

    {/* Floating Scroll Button */}
    <button className={styles.floatingButton} onClick={toggleScroll}>
      ↓
    </button>
    {isAdmin &&
     <button className={styles.quitButton} onClick={onQuit}>quit</button> 
    }
   
  </div>
  );
};

export default LivePage;
