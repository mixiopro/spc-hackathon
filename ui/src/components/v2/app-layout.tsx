"use client";

import { useState } from 'react';
import MainContent from './main-content';
import Sidebar from './sidebar';


export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <MainContent />
    </div>
  );
}