// Navbar Component
// Shows navigation based on user role

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from './ConfirmDialog';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  const handleChangeRole = () => {
    navigate('/choose-role');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            🌱 Taskie
          </Link>

          {/* Navigation links based on role */}
          <div className="flex items-center space-x-6">
            {user?.currentRole === 'requester' && (
              <>
                <Link to="/requester/tasks" className="hover:text-primary-200 transition-colors">
                  My Tasks
                </Link>
                <Link to="/requester/messages" className="hover:text-primary-200 transition-colors">
                  Messages
                </Link>
                <Link to="/requester/profile" className="hover:text-primary-200 transition-colors">
                  Account
                </Link>
              </>
            )}

            {user?.currentRole === 'tasker' && (
              <>
                <Link to="/tasker/search" className="hover:text-primary-200 transition-colors">
                  Find Jobs
                </Link>
                <Link to="/tasker/favorites" className="hover:text-primary-200 transition-colors">
                  Favorites
                </Link>
                <Link to="/tasker/messages" className="hover:text-primary-200 transition-colors">
                  Messages
                </Link>
                <Link to="/tasker/profile" className="hover:text-primary-200 transition-colors">
                  Account
                </Link>
              </>
            )}

            {user?.currentRole === 'admin' && (
              <>
                <Link to="/admin/dashboard" className="hover:text-primary-200 transition-colors">
                  Dashboard
                </Link>
                <Link to="/admin/account" className="hover:text-primary-200 transition-colors">
                  Account
                </Link>
              </>
            )}

            {/* User info and actions */}
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-base bg-gradient-to-r from-yellow-300 to-amber-300 text-transparent bg-clip-text font-bold drop-shadow-lg">
                  Hello, <span className="text-lg">{user.fullName}</span>
                </span>
                
                {user.currentRole !== 'admin' && (
                  <button
                    onClick={handleChangeRole}
                    className="bg-primary-500 hover:bg-primary-700 px-3 py-1 rounded text-sm transition-colors"
                  >
                    Switch Role
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Yes, Logout"
        cancelText="No, Stay"
        confirmButtonClass="bg-red-500 hover:bg-red-600"
      />
    </nav>
  );
};

export default Navbar;

