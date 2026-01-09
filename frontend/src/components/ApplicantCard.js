import React from 'react';
import { Link } from 'react-router';
import { EnvelopeIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { UserImage } from './UserImage';
import Button from './Button';

export const ApplicantCard = ({ applicant }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
      <div className="px-4 py-2">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <UserImage
              className="h-12 w-12 rounded-full object-cover" 
              src={applicant.imageUrl} 
              alt={applicant.name}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {applicant.name}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <EnvelopeIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
              <span className="truncate">{applicant.email}</span>
            </div>
            {applicant.appliedAt && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
                <span>Applied on {formatDate(applicant.appliedAt)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {applicant.cvPath ? (
              <Button
                to={applicant.cvPath}
                target="_blank"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                View CV
              </Button>
            ) : (
              <span className="text-sm text-gray-500">CV not uploaded</span>
            )}
            <Link
              to={`/users/${applicant.id}`}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
  );
};
