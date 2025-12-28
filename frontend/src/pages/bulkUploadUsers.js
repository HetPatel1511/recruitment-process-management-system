import React, { useState } from 'react';
import { DocumentArrowUpIcon, CheckCircleIcon, ExclamationTriangleIcon, PlusIcon, UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { bulkUploadUsers } from '../features/users/usersApi';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import { selectBulkUploadData, selectBulkUploadError, selectBulkUploadStatus } from '../features/users/usersSlice';

export const BulkUploadUsers = () => {
  const [file, setFile] = useState(null);
  const [blur, setBlur] = useState(false);
  const dispatch = useDispatch();
  const bulkUploadData = useSelector(selectBulkUploadData);
  const bulkUploadStatus = useSelector(selectBulkUploadStatus);
  const bulkUploadError = useSelector(selectBulkUploadError);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setBlur(false);
    if (selectedFile && (selectedFile?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && selectedFile?.type !== 'application/vnd.ms-excel')) {
      alert('Please select an Excel file');
      return;
    }
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    dispatch(bulkUploadUsers({ file }))
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setBlur(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile?.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && droppedFile?.type !== 'application/vnd.ms-excel')) {
      alert('Please drop an Excel file');
      return;
    }
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setBlur(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setBlur(false);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Bulk Upload Users</h1>

        {/* Upload Section */}
        <Card className="relative overflow-hidden mb-8 p-6 border-2 border-dashed border-gray-300 bg-gray-50" onDrop={handleDrop} onDragOver={handleDragOver}>
          <div className="text-center">
            <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {file ? file.name : 'Drag and drop your Excel file here, or click to browse'}
            </h3>
            <div className="mt-4">
              <label className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                Select File
                <input
                  type="file"
                  className="sr-only"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                />
              </label>
              {file && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="ml-3 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Only .xlsx and .xls files are accepted
            </p>
          </div>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="text-sm font-medium text-blue-800">Instructions:</h4>
            <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>Ensure your Excel file has exactly these columns: <span className="font-mono">Name</span> and <span className="font-mono">Email</span></li>
              <li>Both columns are required</li>
              <li>The first row should contain the column headers</li>
            </ul>
          </div>

          {blur && (
            <>
              {/* blur only the card */}
              <div className="absolute inset-0 backdrop-blur-sm" onDrop={handleDrop} onDragLeave={handleDragLeave}>
                <div className="flex items-center justify-center h-full">
                  <PlusIcon className="mx-auto h-36 w-36 text-blue-800" />
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mb-8">
          <Button
            variant={file ? 'primary' : 'secondary'}
            disabled={!file}
            onClick={handleUpload}
            className={!file ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Upload & Process
          </Button>
        </div>
        {bulkUploadStatus === 'loading' ?
          (
            <div className="mb-8 flex items-center justify-center">
              <h3 className="text-2xl font-medium text-gray-900 mb-3 ms-2 flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                Processing...
              </h3>
            </div>
          ) :
          <>
            {bulkUploadData?.newUsers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3 ms-2 flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  New Users
                </h3>
                <UsersList users={bulkUploadData?.newUsers} />
              </div>
            )}

            {bulkUploadData?.alreadyExists.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-3 ms-2 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Existing Users
                </h3>
                <UsersList users={bulkUploadData?.alreadyExists} />
              </div>
            )}

            {bulkUploadData?.failedToUpload.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3 ms-2 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  Failed to Upload
                </h3>
                <UsersList users={bulkUploadData?.failedToUpload} />
              </div>
            )}
          </>
        }
      </div>
    </>
  );
};

const UsersList = ({ users }) => {
  return (
    <Card className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <li key={index} className="px-4 py-3 sm:px-6">
            <div className="flex items-center">
              <div className="min-w-0 flex-1 flex items-center">
                {/* if "user" is a string */}
                {typeof user === 'string' ? (
                  <div className="text-sm font-medium text-gray-900 truncate">{user}</div>
                ) : (
                  <div className="text-sm font-medium text-gray-900 truncate">{user?.email}</div>
                )}
              </div>
              {user?.reason && <div className="ml-4 flex-shrink-0">
                <span className="text-sm text-red-600">{user?.reason}</span>
              </div>}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
};