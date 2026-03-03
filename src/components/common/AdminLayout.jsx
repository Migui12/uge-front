import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import SideBar from '../Layout/adminLayout/SideBar';
import NavBar from '../Layout/adminLayout/NavBar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className='flex-1 flex flex-col min-w-0'>
        <NavBar open={sidebarOpen} setOpen={setSidebarOpen} />
        <main className='flex-1 overflow-y-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}