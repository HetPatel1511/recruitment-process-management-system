import React from 'react';
import { Link } from 'react-router';
import { Button } from './Button';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import useAccess from '../hooks/useAccess';
import { PERMISSIONS } from '../permissions/permission';

export const Navbar = ({ logo = 'HiringHub' }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { hasPermission } = useAccess()
  
  const logoutUser = () => {
    dispatch(logout());
  }
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              {logo}
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button to="/auth/login" variant="ghost">
                  Login
                </Button>
                <Button to="/auth/register">
                  Register
                </Button>
              </>
            ) : (
              <>
                {hasPermission(PERMISSIONS.READ_POSITIONS) && <Link 
                  to="/positions" 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium"
                >
                  Positions
                </Link>}
                <Button onClick={logoutUser}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
