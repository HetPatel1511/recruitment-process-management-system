import React from 'react';
import { Card } from './Card';

export const FeatureCard = ({ title, children, icon: Icon }) => {
  return (
    <Card hoverable className="p-8">
      {Icon && (
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-indigo-600" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
      <p className="text-gray-600 text-center">{children}</p>
    </Card>
  );
};

export default FeatureCard;
