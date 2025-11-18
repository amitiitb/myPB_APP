import React from 'react';
import SettingsScreen from '../components/SettingsScreen';

const SettingsPage: React.FC = () => {
  const handleBack = () => {
    // Implement navigation back logic here
  };


  return (
    <SettingsScreen onBack={handleBack} />
  );
};

export default SettingsPage;
