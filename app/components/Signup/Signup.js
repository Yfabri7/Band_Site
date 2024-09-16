"use client";
import { useState } from 'react';
import styles from './signup.module.css';
import axios from 'axios'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    instrument: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
    } else {
      setError('');
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL
      const res = await axios.post(`${serverUrl}/signup`, formData)
      console.log(res)
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
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

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="instrument">Instrument</label>
          <select
            id="instrument"
            name="instrument"
            value={formData.instrument}
            onChange={handleInputChange}
            className={styles.inputField}
            required
          >
            <option value="">Select an instrument</option>
            <option value="Vocals">Vocals</option>
            <option value="Guitar">Guitar</option>
            <option value="Piano">Piano</option>
            <option value="Drums">Drums</option>
            <option value="Violin">Violin</option>
            <option value="Cello">Cello</option>
            <option value="Saxophone">Saxophone</option>
            <option value="Trumpet">Trumpet</option>
            <option value="Flute">Flute</option>
          </select>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <button type="submit" className={styles.submitButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};
export default Signup;
