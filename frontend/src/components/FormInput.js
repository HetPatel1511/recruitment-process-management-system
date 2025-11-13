import React from 'react';

export const FormInput = ({
  id,
  name,
  type = 'text',
  label,
  value,
  onChange,
  error,
  disabled = false,
  autoComplete = '',
  placeholder = '',
  required = false,
  options = [],
  rows = 4,
}) => {
  return (
    <>
      {type == "checkbox" || type == "radio" ?
        <>
          {options.map((option) => (
            <>
              <input
                id={id}
                name={name}
                type={type}
                value={option.value}
                onChange={onChange}
                className={`appearance-none block px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''
                  }`}
              />
              <label key={option.value} htmlFor={id} className="block text-sm font-medium text-gray-700">{option.label}</label>
            </>
          ))}
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </> : type == "textarea" ?
          <>
            <div>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <div className='mt-1'>
                <textarea
                  id={id}
                  name={name}
                  value={value}
                  onChange={onChange}
                  rows={rows}
                  placeholder={placeholder}
                  className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''
                    }`}
                />
              </div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </> :
            <div>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                {label}
                {required && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1">
                <input
                  id={id}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  value={value}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder={placeholder}
                  className={`appearance-none block w-full px-3 py-2 border ${error ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${disabled ? 'bg-gray-100' : ''
                    }`}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>
            </div>
      }
          </>
  );
};
