"use client";
import { useState, useEffect } from 'react';
import styles from './adminresults.module.css';
import { useRouter } from 'next/navigation';

const AdminResults = () => {
  const [results, setResults] = useState([]);
  const [ws, setWs] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the search results from localStorage
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    setResults(searchResults || []);

    // Initialize WebSocket
    const serverURL = process.env.NEXT_PUBLIC_WS_URL;
    const wsConnection = new WebSocket(`${serverURL}admin`);
    setWs(wsConnection);

    wsConnection.onopen = () => {
      console.log('WebSocket connection to server established.');
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsConnection.onclose = (event) => {
      console.log('WebSocket connection closed.', event);
    };

    return () => {
      wsConnection.close();
    };
  }, []);

  const handleSongSelect = (song) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(song.song_name); // Assuming song_name is a unique identifier
      // Redirect to live page with the selected song
      router.push(`/live?instrument=${localStorage.getItem('instrument')}`);
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  return (
    <div className={styles.adminResultsContainer}>
      <h1>Search Results</h1>
      <ul className={styles.resultList}>
        {results.map((song, index) => (
          <li 
            key={index} 
            className={styles.resultItem}
            onClick={() => handleSongSelect(song)}
          >
            <div>
              {/* Display the song details */}
              <span>{song.song_name} by {song.author}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminResults;
