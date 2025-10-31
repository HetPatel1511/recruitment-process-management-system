import React from 'react';

export const Card = ({ 
  children, 
  className = '',
  hoverable = false,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl shadow-lg';
  const hoverStyles = hoverable ? 'hover:shadow-2xl transition-shadow' : '';
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
