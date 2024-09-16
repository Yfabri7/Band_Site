"use client";
import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosInstance';
import styles from './admin.module.css';
import { useRouter } from 'next/navigation';

const AdminMain = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [ws, setWs] = useState(null);
  const [instrument, setInstrument] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userInstrument = localStorage.getItem('instrument');
    if (userInstrument) {
      setInstrument(userInstrument);
    } else {
      console.error("User instrument not found");
    }

    const serverURL = process.env.NEXT_PUBLIC_WS_URL;
    const wsConnection = new WebSocket(`${serverURL}admin`);
    const playerWebSocket = new WebSocket(`${serverURL}player`);

    playerWebSocket.onmessage = (event) => {
      if (event.data !== "quit") {
        const onMessageInstrument = localStorage.getItem('instrument');
        localStorage.setItem("playerData", event.data);
        router.push(`/live?instrument=${onMessageInstrument}`);
      }
    };

    wsConnection.onopen = () => {
      console.log('WebSocket connection to server established.');
    };

    wsConnection.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsConnection.onclose = (event) => {
      console.log('WebSocket connection closed.', event);
    };

    setWs(wsConnection);

    return () => {
      wsConnection.close();
    };
  }, []);

  const handleSearch = async () => {
    if (query.trim() === "") {
      alert("Please enter a song name.");
      return;
    }

    try {
      const res = await axiosInstance.get(`/search-song?input_song=${query}`);
      if (res.data.length === 0) {
        alert("Song not found, try again.");
        return;
      }
      // Store the search results in localStorage and redirect to AdminResults page
      localStorage.setItem('searchResults', JSON.stringify(res.data));
      router.push('/adminresults');
    } catch (error) {
      console.error('Error searching for songs:', error);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Search Any Song...</h1>
      <input
        type="text"
        placeholder="Enter song name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.inputField}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>
    </div>
  );
};

export default AdminMain;
