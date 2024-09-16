'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Signup from "./components/Signup/Signup";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className={styles.page}>
      <h1>main page</h1>
    </div>
  );
}
