"use client"; 
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './player.module.css';

const PlayerMain = () => {
  const [songData, setSongData] = useState(null);
  const [wsError, setWsError] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userInstrument = localStorage.getItem('instrument');
    if (userInstrument) {
      setInstrument(userInstrument);
    } else {
      console.error("User instrument not found");
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
      try {
        const data = JSON.parse(event.data);
        if (data && data.action === "start_song") {
          setSongData(data);
          localStorage.setItem("playerData",  JSON.stringify(data))
          if(userInstrument){
            router.push(`/live?instrument=${userInstrument}`);
        } else {
          console.error("Instrument is not set, cannot redirect")
        }
      } else{
        console.error("Invalid song data:", data);
      }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => wsConnection.close();
}, []);

return (
  <div className={styles.liveContainer}>
      {/* Display WebSocket error if any */}
      {wsError && <div className={styles.errorMessage}>{wsError}</div>}

        <h1>Waiting for next song...</h1>
  </div>
);
};

export default PlayerMain;
