"use client"
import Playermain from '../components/Player/Playermain';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PlayerPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); 
    }
  }, [router]);

  return (
    <div>
      <Playermain />
    </div>
  );
};

export default PlayerPage;
