import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DocumentPlusIcon, DocumentTextIcon, EyeIcon, PencilIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleUser, updateUser, uploadUserCV } from '../features/users/usersApi';
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
  const [cvFile, setCvFile] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState(allSkills.filter(skill => userSkills.some(s => s.id === skill.id)).map(skill => skill.id));

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

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      console.log('CV file selected:', file.name);
    }
  };

  const handleSubmitCV = async (e) => {
    e.preventDefault();
    if (cvFile) {
      const formData = new FormData();
      formData.append('file', cvFile);
      await dispatch(uploadUserCV(formData)).unwrap();
      setCvFile(null);
    }
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
                      <CanAccess permission={PERMISSIONS.UPDATE_USER}>
                        <IsOwner ownerId={singleUser?.id}>
                          <button
                            className="absolute right-0 p-2 rounded-full text-gray-500 hover:text-gray-600"
                            onClick={() => setIsEditModalOpen(true)}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </IsOwner>
                      </CanAccess>
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
                  title="Skills"
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

              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">Resume</h2>
                </div>
                {isOwner(singleUser?.id) || singleUser?.cvPath ? 
                <>
                  <IsOwner ownerId={singleUser?.id}>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleCvUpload}
                    />

                    {!singleUser?.cvPath && !cvFile && (
                      <div className="space-y-4">
                        <div 
                          className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => document.getElementById('cv-upload').click()}
                        >
                          <DocumentPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No CV uploaded</h3>
                          <p className="mt-1 text-sm text-gray-500">Upload your CV to make it easier to apply for positions</p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full"
                          disabled
                        >
                          Upload CV
                        </Button>
                      </div>
                    )}

                    {cvFile && (
                      <div className="space-y-4">
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {cvFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(cvFile.size / 1024).toFixed(1)} KB | Ready to upload
                            </p>
                          </div>
                          <button
                            onClick={() => document.getElementById('cv-upload').click()}
                            className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={handleSubmitCV}
                        >
                          Upload CV
                        </Button>
                      </div>
                    )}

                  </IsOwner>

                  {singleUser?.cvPath && !cvFile && (
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                          <DocumentTextIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {singleUser.cvPath.split('/').pop()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <a 
                            href={singleUser.cvPath} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:text-blue-800"
                            title="View CV"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </a>
                          <button
                            onClick={() => document.getElementById('cv-upload').click()}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Change CV"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      {cvFile ? (
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={handleSubmitCV}
                        >
                          Update CV
                        </Button>
                      ) : null}
                    </div>
                  )}
                </> : 
                <div className="mt-4 text-center py-6 text-gray-500">
                  <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">No CV available</p>
                </div>
                }
              </Card>

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