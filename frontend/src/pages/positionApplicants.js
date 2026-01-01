import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getPositionApplicants } from '../features/positions/positionApplicantsApi';
import { 
  selectPositionApplicants, 
  selectPositionApplicantsStatus, 
  selectPositionApplicantsError,
} from '../features/positions/positionApplicantsSlice';
import { ApplicantCard } from '../components/ApplicantCard';
import ErrorAlert from '../components/ErrorAlert';
import Navbar from '../components/Navbar';

export const PositionApplicants = () => {
  const { positionId } = useParams();
  const dispatch = useDispatch();
  
  const positionApplicants = useSelector(selectPositionApplicants);
  const status = useSelector(selectPositionApplicantsStatus);
  const error = useSelector(selectPositionApplicantsError);

  useEffect(() => {
    if (positionId) {
      dispatch(getPositionApplicants({ positionId }));
    }
  }, [dispatch, positionId]);

  
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
      <>
      <div className="">
      <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading applicants...</p>
          </div>
        </div>
      </div>
      </>
    );
  }

  if (error) {
    return (
      <>
      <div className="min-h-screen">
      <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ErrorAlert message={error} />
          <div className="mt-4">
            <Link
              to={`/positions/${positionId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Position
            </Link>
          </div>
        </div>
      </div>
      </>
    );
  }

  if (!positionApplicants) {
    return (
      <div className="min-h-screen">
      <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-8">
            <p className="text-gray-600">No position data available.</p>
            <Link
              to={`/positions/${positionId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Position
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
    <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link
            to={`/positions/${positionId}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Position
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900">
            Applicants for {positionApplicants?.position?.title}
          </h1>
          
          <div className="mt-2 text-sm text-gray-500">
            <span>Posted on: {positionApplicants?.position?.createdAt ? formatDate(positionApplicants?.position?.createdAt) : 'N/A'}</span>
            {positionApplicants?.position?.status && (
              <span className="ml-4">
                Status: <span className="font-medium">{positionApplicants?.position?.status}</span>
              </span>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p className="text-gray-700 whitespace-pre-wrap">{positionApplicants?.position?.description}</p>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Applicants ({positionApplicants?.applicants?.length})
            </h3>
          </div>
          
          {positionApplicants?.applicants?.length === 0 ? (
            <div className="px-4 py-5 sm:p-6 text-center">
              <p className="text-gray-500">No applicants yet.</p>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-b-lg">
              <ul className="divide-y divide-gray-200">
                {positionApplicants?.applicants?.map((applicant) => (
                  <li key={applicant.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <ApplicantCard applicant={applicant} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionApplicants;
