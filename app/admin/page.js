"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminMain from '../components/Admin/Adminmain';

const AdminPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <AdminMain />
    </div>
  );
};

export default AdminPage;
