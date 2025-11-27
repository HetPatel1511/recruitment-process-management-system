import { XMarkIcon } from '@heroicons/react/24/outline';

const SkillSelectionModal = ({
  isOpen,
  onClose,
  allSkills = [],
  selectedSkills = [],
  onSkillToggle,
  onSave,
  title = 'Select Required Skills'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {title}
            </h3>
            <div className="mt-4 max-h-96 overflow-y-auto">
              {allSkills && allSkills.length > 0 ? (
                <div className="space-y-2">
                  {allSkills.map((skill) => (
                    <div key={skill.id} className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id={`skill-${skill.id}`}
                          name="skill"
                          type="checkbox"
                          checked={selectedSkills.includes(skill.id)}
                          onChange={() => onSkillToggle(skill.id)}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor={`skill-${skill.id}`} className="font-medium text-gray-700">
                          {skill.name}
                        </label>
                        {skill.description && (
                          <p className="text-gray-500">{skill.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No skills available</p>
              )}
            </div>
          </div>
          <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
              onClick={onSave}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillSelectionModal;
