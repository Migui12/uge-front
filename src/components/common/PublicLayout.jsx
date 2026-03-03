import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { configService } from '../../services/api';
import Header from '../Layout/publicLayout/Header';
import Footer from '../Layout/publicLayout/Footer';

export default function PublicLayout() {
  const [cog, setCog] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    configService
    .obtener()
    .then((res) => setCog(res.data.data))
    .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cog={cog} loading={loading} />
      <main className="flex-1 mx-auto px-2 py-8 w-full bg-gray-100">
        <Outlet />
      </main>
      <Footer cog={cog} />
    </div>
  );
}