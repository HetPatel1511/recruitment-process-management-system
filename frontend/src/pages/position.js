import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '../components/Navbar';
import { FunnelIcon, MagnifyingGlassIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { applyForPosition, getPositions } from '../features/positions/positionsApi';
import { selectPositions, selectPositionStatus, selectPositionError } from '../features/positions/positionsSlice';
import ErrorAlert from '../components/ErrorAlert';
import CreateItem from '../components/CreateItem';
import Button from '../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PERMISSIONS } from '../permissions/permission';
import useAccess from '../hooks/useAccess';

export const Position = () => {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const status = useSelector(selectPositionStatus);
  const error = useSelector(selectPositionError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const { CanAccess, IsOwner } = useAccess()

  useEffect(() => {
    dispatch(getPositions());
  }, [dispatch]);

  const filteredPositions = positions.filter(position => {
    if (!position) return false;
    const matchesSearch = position.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || position.status?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ErrorAlert message={error || 'Failed to load positions. Please try again later.'} />
        </div>
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        {!false ? (
          <CreateItem
            title="No positions found"
            description="Click here to create a position"
            to="/positions/new"
          />
        ) : (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className=" text-lg font-medium text-gray-900">
                  No positions found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  There are currently no open positions. Please check back
                  later.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Open Positions</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and track all your job positions in one place.
            </p>
          </div>
          <CanAccess permission={PERMISSIONS.CREATE_POSITIONS}>
            <div className="mt-4 md:mt-0">
              <Link
                to="/positions/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Position
              </Link>
            </div>
          </CanAccess>
        </div>

        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="relative">
                <select
                  id="status"
                  name="status"
                  className="block w-full pl-3 pr-5 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md h-10"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredPositions.length > 0 ? (
              filteredPositions.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No positions found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filter !== 'all' ? 'Try adjusting your search or filter to find what you\'re looking for.' : 'Get started by creating a new position.'}
                  </p>
                </div>
              ) : (
                filteredPositions.map((position) => (
                  <li key={position.id} className="hover:bg-gray-50">
                    <Link to={`/positions/${position.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-indigo-600">
                            {position.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <IsOwner ownerId={position.recruiterId}>
                              <CanAccess permission={PERMISSIONS.READ_POSITION_APPLICANTS}>
                                <Button
                                  to={`/positions/${position.id}/applicants`}
                                  variant="ghost"
                                  size="xs"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs"
                                >
                                  <UserIcon className="h-3 w-3 mr-1" />
                                  View Applicants
                                </Button>
                              </CanAccess>
                            </IsOwner>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              position.status === 'open' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {position.status}
                            </span>
                            {/* {position.status === 'open' && (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  dispatch(applyForPosition({ id: position.id }))
                                    .unwrap()
                                    .catch(() => {
                                      // Error is already handled by the toast in the slice
                                    });
                                }}
                                disabled={status === 'loading'}
                                className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                  status === 'loading' 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                                }`}
                              >
                                {status === 'loading' ? 'Applying...' : 'Apply'}
                              </button>
                            )} */}
                          </div>
                        </div>
                        <p className="mt-2 text-gray-600 truncate w-full">
                          {position.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                          <span>Experience: {position.yearsOfExperienceRequired || 0}+ years</span>
                          <span>
                            Posted on {new Date(position.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              )
            ) : (
              <li className="px-4 py-12 text-center text-gray-500">
                No positions found matching your criteria.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Position;
