import React from 'react';
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const SkillsCard = ({ 
  title = 'Skills', 
  skills = [], 
  onEdit, 
  showEditButton = true,
  showIcons = true,
  noSkillsMessage = 'No skills added yet'
}) => {
  return (
    <div className={`p-6`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {showEditButton && onEdit && (
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit Skills
          </button>
        )}
      </div>
      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={skill?.id || index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              title={skill?.description}
            >
              {showIcons && <AcademicCapIcon className="h-4 w-4 mr-1" />}
              {skill?.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">{noSkillsMessage}</p>
      )}
    </div>
  );
};

export default SkillsCard;
