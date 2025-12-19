import React from 'react'
import Topbar from './topbar';
import { Outlet } from 'react-router-dom';

const Layoutsettings = () => {
 return (

      <div>
        {/* Header */}
      <Topbar/>
      <div>
        <Outlet />
      </div>
      {/* <AdminDashboard/> */}

    
      </div>
  );
}

export default Layoutsettings