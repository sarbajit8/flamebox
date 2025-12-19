import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminAuthLayout = () => {
  return (
    <div>        
        <Outlet />
</div>
  )
}

export default AdminAuthLayout