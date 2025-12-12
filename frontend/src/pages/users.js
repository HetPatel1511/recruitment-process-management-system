import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Navbar } from '../components/Navbar';
import { MagnifyingGlassIcon, PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { getUsers } from '../features/users/usersApi';
import { selectUsers, selectUsersStatus, selectUsersError } from '../features/users/usersSlice';
import ErrorAlert from '../components/ErrorAlert';
import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToast.css';
import { PERMISSIONS, ROLES } from '../permissions/permission';
import useAccess from '../hooks/useAccess';
import placeholder from '../user-placeholder-image.png';

export const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingRole, setEditingRole] = useState(null);
  const { CanAccess } = useAccess();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const filteredUsers = users?.filter(user => {
    if (!user) return false;
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || user.role?.name?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // await dispatch(deleteUser(userId)).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update role');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <ErrorAlert message={error || 'Failed to load users. Please try again later.'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              View and manage all user accounts in the system.
            </p>
          </div>
          <CanAccess permission={PERMISSIONS.CREATE_USERS}>
            <div className="mt-4 md:mt-0">
              <Link
                to="/users/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New User
              </Link>
            </div>
          </CanAccess>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-10 border p-2"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  id="role-filter"
                  name="role"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md h-10 border"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {Object.values(ROLES).map(role => (
                    <option key={role} value={role.toLowerCase()}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TH scope="col">
                    #
                  </TH>
                  <TH scope="col">
                    User
                  </TH>
                  <TH scope="col">
                    Email
                  </TH>
                  <TH scope="col">
                    Role
                  </TH>
                  <TH scope="col">
                    Created At
                  </TH>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers && filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <TD>
                        {index + 1}
                      </TD>
                      <TD>
                        <Link to={`/users/${user.id}`} className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.imageUrl ? (
                              <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt={user.name} />
                            ) : (
                              <img className="h-10 w-10 rounded-full" src={placeholder} alt={user.name} />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">ID: {user.id}</div>
                          </div>
                        </Link>
                      </TD>
                      <TD>
                        {user.email}
                      </TD>
                      <TD className="w-48">
                        {editingRole === user.id ? (
                          <select
                            className="block px-3 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            onBlur={() => setEditingRole(null)}
                            autoFocus
                          >
                            {Object.values(ROLES).map(role => (
                              <option key={role} value={role} selected={user.role.name.toLowerCase() === role.toLowerCase()}>
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                              user.role.name.toLowerCase() === 'admin' 
                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' 
                                : user.role.name.toLowerCase() === 'hr'
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                                : user.role.name.toLowerCase() === 'recruiter'
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : user.role.name.toLowerCase() === 'interviewer'
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : user.role.name.toLowerCase() === 'reviewer'
                                ? 'bg-pink-100 text-pink-800 hover:bg-pink-200'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                            onClick={() => setEditingRole(user.id)}
                          >
                            {user.role.name}
                          </span>
                        )}
                      </TD>
                      <TD>
                        {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                      </TD>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <TD colSpan="5">
                      <div className="text-center">
                        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {searchTerm || filter !== 'all' 
                            ? 'No users match your search criteria. Try adjusting your search or filter.'
                            : 'Get started by creating a new user.'}
                        </p>
                      </div>
                    </TD>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const TH = ({ className, children, ...props }) => {
  return (
    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`} {...props}>
      {children}
    </th>
  );
};

const TD = ({ className, children, ...props }) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </td>
  );
};

export default Users;
