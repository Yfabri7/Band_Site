"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      const res = await axios.post(`${serverUrl}/login`, new URLSearchParams({
        username: formData.username,
        password: formData.password,
      }));

      console.log('Logged in:', res.data);

      const { access_token, is_admin, instrument} = res.data;

      // JWT token received from backend to localStorage
      localStorage.setItem('isAdmin', is_admin);
      localStorage.setItem('token', access_token);
      localStorage.setItem('instrument', instrument)

      if (is_admin) {
        router.push('/admin');
      } else {
        router.push('/player');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h1 className={styles.title}>Login</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button type="submit" className={styles.submitButton} disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
