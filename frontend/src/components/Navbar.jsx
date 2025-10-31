import React from 'react';
import { Link } from 'react-router';
import { Button } from './Button';

export const Navbar = ({ logo = 'Recruitment System' }) => {
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
            <Button to="/auth/login" variant="ghost">
              Login
            </Button>
            <Button to="/auth/register">
              Register
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
