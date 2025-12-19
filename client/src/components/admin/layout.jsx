import React, { useState } from 'react';
// import logo from '../assets/flogo.jpg';
import AdminHeader from './header';
import AdminSidebar from './sidebar';
// import AdminDashboard from '@components/pages/admin/dashboard';
import { Outlet } from 'react-router-dom';
const AdminLayout = () => {



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-3 sm:p-6">
      {/* Mobile Menu Button */}
  <AdminSidebar/>

      {/* Main Content */}
      <div className="lg:ml-24 lg:mr-4">
        {/* Header */}
      <AdminHeader/>
      <div>
        <Outlet />
      </div>
      {/* <AdminDashboard/> */}

    
      </div>
    </div>
  );
};


export default AdminLayout