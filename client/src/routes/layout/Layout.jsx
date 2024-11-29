import React from 'react';
import Navbar from '../../components/navbar/Navbar';
import SideBar from '../../components/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
import './layout.scss';

function Layout() {
  return (
    <div className="main-container">
      <div className="sub-container-one">
        <Navbar />
      </div>
      <div className="sub-container-two">
        <div className="sidebar">
          <SideBar />
        </div>
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
