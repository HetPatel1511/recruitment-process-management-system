import React from 'react';
import { Navbar } from '../components/Navbar';
import { FeatureCard } from '../components/FeatureCard';
import { CTASection } from '../components/CTASection';
import { UserGroupIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { CreateItem } from '../components/CreateItem';
import { FormInput } from '../components/FormInput';

export const Home = () => {
  const features = [
    {
      title: 'Candidate Management',
      description: 'Efficiently track and manage candidates throughout the hiring process with our intuitive dashboard.',
      icon: UserGroupIcon
    },
    {
      title: 'Job Posting',
      description: 'Create and manage job postings that attract top talent with our easy-to-use job board.',
      icon: DocumentTextIcon
    },
    {
      title: 'Analytics Dashboard',
      description: 'Gain insights into your hiring process with comprehensive analytics and reporting tools.',
      icon: ChartBarIcon
    }
  ];

  return (
    <div className="">
      <Navbar logo="HiringHub" />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-indigo-600">HiringHub</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The ultimate solution for streamlining recruitment, connecting top talent with the right opportunities, and building strong, successful teams.
          </p>
          
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                title={feature.title}
                icon={feature.icon}
              >
                {feature.description}
              </FeatureCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
