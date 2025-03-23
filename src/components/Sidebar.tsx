import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  Check,
  Layers,
  Database,
  Activity
} from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';

export function Sidebar() {
  const { logout } = useAuthContext();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { to: '/dashboard', icon: <Home size={20} />, text: 'Dashboard' },
    { to: '/teams', icon: <Users size={20} />, text: 'Teams' },
    { to: '/projects', icon: <Layers size={20} />, text: 'Projects' },
    { to: '/judging', icon: <Check size={20} />, text: 'Judging' },
    { to: '/leaderboard', icon: <Award size={20} />, text: 'Leaderboard' },
    { to: '/analytics', icon: <Activity size={20} />, text: 'Analytics' },
    { to: '/data-management', icon: <Database size={20} />, text: 'Data Management' },
    { to: '/settings', icon: <Settings size={20} />, text: 'Settings' },
  ];

  return (
    <>
      {/* Mobile hamburger menu */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-md bg-[#00123E] text-white hover:bg-[#002161] focus:outline-none focus:ring-2 focus:ring-[#0066ff]"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-[#000d1a] to-[#00123E] text-white transition-all duration-300 ease-in-out shadow-lg border-r border-[#0066ff]/20 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-[#0066ff]/20">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#007bff] to-[#00bfff]">
              {collapsed ? 'AJ' : 'AlgoJudge'}
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-[#00bfff] hover:bg-[#001a33] focus:outline-none hidden md:block"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
          <button
            onClick={closeMobileSidebar}
            className="p-1 rounded-md text-[#00bfff] hover:bg-[#001a33] focus:outline-none md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-2 py-4 overflow-y-auto h-[calc(100vh-64px)]">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                      isActive
                        ? 'bg-[#0066ff]/20 text-white'
                        : 'text-gray-300 hover:bg-[#001a33] hover:text-white'
                    }`
                  }
                  onClick={closeMobileSidebar}
                >
                  <span className="text-[#007bff]">{link.icon}</span>
                  {!collapsed && <span className="ml-3">{link.text}</span>}
                </NavLink>
              </li>
            ))}

            {/* Logout */}
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 mt-20 rounded-md text-gray-300 hover:bg-red-500/10 hover:text-white transition-colors duration-200"
              >
                <span className="text-red-400">
                  <LogOut size={20} />
                </span>
                {!collapsed && <span className="ml-3">Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Wrapper - adds margin to account for sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        } ml-0`}
      >
        {/* This is just a placeholder for the content area */}
      </div>
    </>
  );
} 