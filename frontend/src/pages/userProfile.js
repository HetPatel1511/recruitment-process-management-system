import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, updateUser } from '../features/users/usersApi';
import { useParams } from 'react-router';
import { selectSingleUser, selectSingleUserStatus, selectSingleUserError } from '../features/users/usersSlice';
import ErrorAlert from '../components/ErrorAlert';
import userPlaceholderImage from '../user-placeholder-image.png';
import { addSkillsToUser, getSkills, getUserSkills } from '../features/skills/skillsApi';
import { PERMISSIONS } from '../permissions/permission';
import useAccess from '../hooks/useAccess';
import SkillsCard from '../components/SkillsCard';
import SkillSelectionModal from '../components/SkillSelectionModal';
import { selectSkills, selectUserSkills } from '../features/skills/skillsSlice';
import EditUserFormModal from '../components/EditUserFormModal';
import { UserImage } from '../components/UserImage';

const UserProfile = () => {
  const { id: userId } = useParams();
  const dispatch = useDispatch();
  const allSkills = useSelector(selectSkills);
  const userSkills = useSelector(selectUserSkills);
  const singleUser = useSelector(selectSingleUser);
  const singleUserStatus = useSelector(selectSingleUserStatus);
  const singleUserError = useSelector(selectSingleUserError);
  const { CanAccess, hasPermission, IsOwner, isOwner } = useAccess();
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(allSkills.filter(skill => userSkills.some(s => s.id === skill.id)).map(skill => skill.id));

  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Software Engineer',
    headline: 'Full Stack Developer | React & .NET Enthusiast',
    about: 'Passionate software engineer with 5+ years of experience in building scalable web applications. Specialized in JavaScript, React, and .NET Core. Always eager to learn new technologies and contribute to meaningful projects.',
    skills: [
      { id: 1, name: 'JavaScript' },
      { id: 2, name: 'React' },
      { id: 3, name: 'Node.js' },
      { id: 4, name: '.NET Core' },
      { id: 5, name: 'SQL' },
      { id: 6, name: 'Git' },
      { id: 7, name: 'Docker' },
    ],
    createdAt: '2023-01-15T10:30:00Z',
    updatedAt: '2023-11-20T14:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  };

  useEffect(() => {
    dispatch(getSingleUser({ id: userId }));
    dispatch(getUserSkills({ userId }));
  }, []);

  useEffect(() => {
    setSelectedSkills(allSkills.filter(skill => userSkills.some(s => s.id === skill.id)).map(skill => skill.id));
  }, [allSkills, userSkills])

  const handleSkillToggle = (skillId) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSaveSkills = () => {
    dispatch(addSkillsToUser({ skillIds: selectedSkills }));
    setIsSkillModalOpen(false);
  };

  const handleUpdateUser = (userData) => {
    delete userData.imageUrl;
    dispatch(updateUser({...userData, id: userId}));
    setIsEditModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      {singleUserStatus === 'loading' ?
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading position details...</p>
          </div>
        </div> :
        singleUserStatus === 'failed' ?
          <ErrorAlert message={singleUserError} /> :
        singleUserStatus === 'succeeded' &&
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-6">
              <Card className="p-6">
                <div className="relative flex flex-col md:flex-row gap-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <UserImage
                      className="w-full h-full object-cover"
                      src={singleUser?.imageUrl}
                      alt={singleUser?.name}
                    />
                  </div>

                  <div className="flex-1 relative">
                    <div className="flex justify-between items-start">
                      <div>
                        {singleUser?.name ? <h1 className="text-3xl font-bold text-gray-900">{singleUser?.name}</h1> : <></>}
                        {singleUser?.role?.name ? <p className="text-lg text-gray-600">{singleUser?.role?.name}</p> : <></>}
                        {singleUser?.email ? <p className="text-gray-500">{singleUser?.email}</p> : <></>}
                      </div>
                      {isOwner(singleUser?.id) && hasPermission(PERMISSIONS.UPDATE_USER) && <button
                        className="absolute right-0 p-2 rounded-full text-gray-500 hover:text-gray-600"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>}
                    </div>

                    {singleUser?.headline ? <div className="mt-2">
                      <div className="flex items-center">
                        <p className="text-xl text-gray-700 font-medium">{singleUser?.headline}</p>
                      </div>
                    </div>
                      : <></>}

                    {singleUser?.about ? <div className="mt-2">
                      <div className="flex justify-between items-start">
                        <h2 className="text-lg font-semibold text-gray-600">About</h2>
                      </div>
                      <p className="mt-0 text-gray-600 whitespace-pre-line">{singleUser?.about}</p>
                    </div>
                      : <></>}
                  </div>
                </div>
              </Card>

              <Card>
                <SkillsCard
                  title="User Skills"
                  skills={userSkills}
                  onEdit={() => {
                    dispatch(getSkills());
                    setIsSkillModalOpen(true);
                  }}
                  showEditButton={isOwner(singleUser?.id) && hasPermission(PERMISSIONS.LINK_SKILLS_TO_USER)}
                  noSkillsMessage="User has no skills"
                />
              </Card>

              <CanAccess permission={PERMISSIONS.LINK_SKILLS_TO_USER}>
                <IsOwner ownerId={singleUser?.id}>
                  <SkillSelectionModal
                    isOpen={isSkillModalOpen}
                    onClose={() => setIsSkillModalOpen(false)}
                    allSkills={allSkills}
                    selectedSkills={selectedSkills}
                    onSkillToggle={handleSkillToggle}
                    onSave={handleSaveSkills}
                    title="Select Your Skills"
                  />
                </IsOwner>
              </CanAccess>

              <CanAccess permission={PERMISSIONS.UPDATE_USER}>
                <IsOwner ownerId={singleUser?.id}>
                  <EditUserFormModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleUpdateUser}
                    title="Edit Your Profile"
                    initialData={{
                      imageUrl: singleUser?.imageUrl ? singleUser?.imageUrl : userPlaceholderImage, 
                      name: singleUser?.name ? singleUser?.name : "", 
                      headline: singleUser?.headline ? singleUser?.headline : "", 
                      about: singleUser?.about ? singleUser?.about : "" 
                    }}
                  />
                </IsOwner>
              </CanAccess>

              {singleUser?.createdAt || singleUser?.updatedAt ? <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {singleUser?.createdAt ? <div>
                    <p className="text-sm text-gray-500">User Since</p>
                    <p className="text-gray-700">{formatDate(singleUser?.createdAt)}</p>
                  </div> : <></>}
                  {singleUser?.updatedAt ? <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-gray-700">{formatDate(singleUser?.updatedAt)}</p>
                  </div> : <></>}
                </div>
              </Card> : <></>}
            </div>
          </div>
      }
      {/* {singleUserStatus === 'failed' && <ErrorAlert message={singleUserError} />} */}
    </div>
  );
};

export default UserProfile;