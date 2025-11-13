import React from 'react';
import { Link } from 'react-router';
import { Button } from './Button';
import { selectIsAuthenticated } from '../features/auth/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export const Navbar = ({ logo = 'HiringHub' }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log(isAuthenticated);
  
  const logoutUser = () => {
    console.log("aaa");
    
    dispatch(logout());
    console.log("b");
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
          <div className="flex gap-4">
            {!isAuthenticated ?
            <>
              <Button to="/auth/login" variant="ghost">
                Login
              </Button>
              <Button to="/auth/register">
                Register
              </Button>
            </> :
              <Button onClick={logoutUser}>
                Logout
              </Button>
            }
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
