import { useState, useRef } from 'react';
import { XMarkIcon, UserCircleIcon, CameraIcon } from '@heroicons/react/24/outline';

const EditUserFormModal = ({
  isOpen,
  onClose,
  onSave,
  title = 'Edit Your Profile',
  initialData = {
    name: '',
    headline: '',
    about: '',
    profileImage: null
  }
}) => {
  const [formData, setFormData] = useState(initialData);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    console.log(e.target);
    const file = e.target.files[0];
    console.log(file);
    
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 space-y-6">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative">
                {previewImage || initialData.imageUrl ? (
                  <img
                    src={previewImage || initialData.imageUrl}
                    alt="Profile"
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <></>
                )}
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Click to change photo</p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Enter your name"
              />
            </div>

            {/* Headline Field */}
            <div>
              <label htmlFor="headline" className="block text-sm font-medium text-gray-700">
                Headline
              </label>
              <input
                type="text"
                name="headline"
                id="headline"
                value={formData.headline}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="E.g., Software Engineer at Company"
              />
            </div>

            {/* About Field */}
            <div>
              <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                About
              </label>
              <textarea
                id="about"
                name="about"
                rows={4}
                value={formData.about}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserFormModal;
