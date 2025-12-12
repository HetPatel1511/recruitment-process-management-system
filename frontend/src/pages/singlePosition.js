import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { applyForPosition, getSinglePosition, updatePosition } from '../features/positions/positionsApi';
import { selectSinglePosition, selectSinglePositionStatus, selectSinglePositionError, selectUpdateStatus } from '../features/positions/positionsSlice';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import ErrorAlert from '../components/ErrorAlert';
import {
  CalendarIcon,
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { selectPositionSkills, selectPositionSkillsError, selectPositionSkillsStatus, selectSkills } from '../features/skills/skillsSlice';
import { addSkillsToPosition, getPositionSkills, getSkills } from '../features/skills/skillsApi';
import { toast } from 'react-toastify';
import useAccess from '../hooks/useAccess';
import { PERMISSIONS } from '../permissions/permission';
import SkillSelectionModal from '../components/SkillSelectionModal';
import SkillsCard from '../components/SkillsCard';

export const SinglePosition = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const position = useSelector(selectSinglePosition);
  const status = useSelector(selectSinglePositionStatus);
  const error = useSelector(selectSinglePositionError);
  const updateStatus = useSelector(selectUpdateStatus);
  const allSkills = useSelector(selectSkills);
  const skillsRequired = useSelector(selectPositionSkills);
  const skillsStatus = useSelector(selectPositionSkillsStatus);
  const skillsError = useSelector(selectPositionSkillsError);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(allSkills.filter(skill => skillsRequired.some(s => s.id === skill.id)).map(skill => skill.id));
  const { CanAccess, hasPermission } = useAccess()

  useEffect(() => {
    setSelectedSkills(allSkills.filter(skill => skillsRequired.some(s => s.id === skill.id)).map(skill => skill.id));
  }, [allSkills, skillsRequired])
  
  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSaveSkills = () => {
    dispatch(addSkillsToPosition({ positionId: id, skillIds: selectedSkills }));
    setIsSkillModalOpen(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(getSinglePosition({ id }));
      dispatch(getPositionSkills({ positionId: id }));
    }
  }, [dispatch, id]);

  const handleStatusChange = () => {
    if (!position) return;

    const newStatus = position.status === 'open' ? 'closed' : 'open';
    const updateData = {
      id: position.id,
      status: newStatus,
      // ...(newStatus === 'closed' && { reasonForClosure: 'Closed by recruiter' })
    };

    dispatch(updatePosition(updateData));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleApply = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(applyForPosition({ id: position.id }))
  };

  if (status === 'loading' || skillsStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading position details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'failed' || !position || skillsStatus === 'failed' || !skillsRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error ? 'Error Loading Position' : 'Position Not Found'}
            </h1>
            {error && (
              <div className="mb-8">
                <ErrorAlert message={error} />
              </div>
            )}
            <p className="text-gray-600 mb-8">
              {error ? 'There was an error loading the position details. Please try again later.' : 'The position you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Button to="/positions">
              Back to Positions
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            to="/positions"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Back to Positions
          </Link>
          
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{position.title}</h1>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${position.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {position.status === 'open' ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <XCircleIcon className="h-5 w-5 text-red-500" />}
                    <span className="ml-1">{position.status}</span>
                  </span>
                  {position.yearsOfExperienceRequired!==null && (
                    <div className="flex items-center text-sm text-gray-500">
                      <BriefcaseIcon className="h-4 w-4 mr-1" />
                      {position.yearsOfExperienceRequired}+ years experience
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{position.description}</p>
              </div>
            </Card>

            <Card>
              <SkillsCard
                title="Skills Required"
                skills={skillsRequired}
                onEdit={() => {
                  dispatch(getSkills());
                  setIsSkillModalOpen(true);
                }}
                showEditButton={hasPermission(PERMISSIONS.LINK_SKILLS_TO_POSITION)}
                noSkillsMessage="No skills required"
              />
            </Card>

            <CanAccess permission={PERMISSIONS.LINK_SKILLS_TO_POSITION}>
              <SkillSelectionModal
                isOpen={isSkillModalOpen}
                onClose={() => setIsSkillModalOpen(false)}
                allSkills={allSkills}
                selectedSkills={selectedSkills}
                onSkillToggle={handleSkillToggle}
                onSave={handleSaveSkills}
                title="Select Required Skills"
              />
            </CanAccess>

            {position.status === 'closed' && position.reasonForClosure && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Reason for Closure</h2>
                <p className="text-gray-600">{position.reasonForClosure}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {position.recruiter && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recruiter Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{position.recruiter.name}</p>
                      {position.recruiter?.role?.name && <p className="text-sm text-gray-500">{position.recruiter?.role?.name}</p>}
                    </div>
                  </div>
                  {position.recruiter.email && (
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-900">{position.recruiter.email}</p>
                        <p className="text-sm text-gray-500">Email</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-900">Created</p>
                    <p className="text-sm text-gray-500">{position.createdAt ? formatDate(position.createdAt) : 'Not available'}</p>
                  </div>
                </div>
                {position.updatedAt && position.updatedAt !== position.createdAt && (
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-900">Last Updated</p>
                      <p className="text-sm text-gray-500">{formatDate(position.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {((hasPermission(PERMISSIONS.APPLY_POSITION) && (position.applied || position.status === 'open' || (position.applied && position.status === 'closed'))) || hasPermission(PERMISSIONS.UPDATE_POSITIONS)) && <Card className="p-6">
              <CanAccess permission={PERMISSIONS.APPLY_POSITION}>
                
                {!position.applied ?
                  <>
                    {position.status === 'open' && (
                      <Button className="w-full" onClick={handleApply}>
                        Apply for This Position
                      </Button>)}
                  </> :
                  <div className="w-full p-3 bg-green-50 border border-green-100 rounded-md">
                    <div className="flex items-center justify-center text-green-700 space-x-2">
                      <CheckCircleIcon className="h-5 w-5" />
                      <span className="font-medium">Application Submitted</span>
                    </div>
                    <p className="text-sm text-green-600 text-center mt-1">
                      We've received your application.
                    </p>
                  </div>
                }
                
              </CanAccess>
              <CanAccess permission={PERMISSIONS.UPDATE_POSITIONS}>
                <Button
                  onClick={handleStatusChange}
                  variant="secondary"
                  className="w-full"
                  disabled={updateStatus === 'loading'}
                >
                  {updateStatus === 'loading' ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      {position.status === 'open' ? 'Close Position' : 'Reopen Position'}
                    </>
                  )}
                </Button>
              </CanAccess>
            </Card>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SinglePosition;
