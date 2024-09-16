"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminResults from '../components/Adminresults/Adminresults';

const AdminresultsPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div>
      <AdminResults />
    </div>
  );
};

export default AdminresultsPage;
