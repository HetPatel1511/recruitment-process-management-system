import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';

export const CreateItem = ({ 
  title = 'Create a new item',
  description = 'Click here to add your first item',
  to = '/create',
  onClick,
  className = ''
}) => {
  const content = (
    <div className={`group relative block w-full border-2 border-dashed border-gray-400 rounded-lg p-12 text-center hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors cursor-pointer ${className}`}>
      <PlusIcon className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        {content}
      </div>
    );
  }

  return (
    <Link to={to} className="py-12 px-4 sm:px-6 lg:px-8 block max-w-md mx-auto">
      {content}
    </Link>
  );
};

export default CreateItem;
