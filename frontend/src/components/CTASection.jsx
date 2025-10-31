import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

export const CTASection = ({ 
  title = "Get Started!", 
  description = "Join us today",
  primaryAction = { to: "/auth/register", text: "Create Account" },
  secondaryAction = { to: "/auth/login", text: "Sign In" }
}) => {
  return (
    <Card className="p-12 text-center">
      <h3 className="text-3xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-lg text-gray-600 mb-8">{description}</p>
      <div className="flex gap-4 justify-center">
        <Button to={primaryAction.to} size="lg">
          {primaryAction.text}
        </Button>
        <Button to={secondaryAction.to} variant="secondary" size="lg">
          {secondaryAction.text}
        </Button>
      </div>
    </Card>
  );
};

export default CTASection;
