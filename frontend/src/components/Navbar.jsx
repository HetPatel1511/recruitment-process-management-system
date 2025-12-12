import React from 'react';
import { Link } from 'react-router';
import { Button } from './Button';
import { selectCurrentUser, selectIsAuthenticated } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import useAccess from '../hooks/useAccess';
import { PERMISSIONS } from '../permissions/permission';
import { UserIcon, BriefcaseIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';

export const Navbar = ({ logo = 'HiringHub' }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
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
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center"
                >
                  <BriefcaseIcon className="h-4 w-4 mr-1" /> Positions
                </Link>}
                <Link 
                  to={`/users/${user?.id}`} 
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center"
                >
                  <UserIcon className="h-4 w-4 mr-1" /> Profile
                </Link>
                <Button onClick={logoutUser}>
                  <ArrowLeftStartOnRectangleIcon className="h-4 w-4 mr-1" /> Logout
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
