import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import SettingsScreen from '../components/SettingsScreen';

const SettingsPage: React.FC = () => {
  const handleBack = () => {
    // Implement navigation back logic here
  };

  return (
    <View style={styles.container}>
      <SettingsScreen onBack={handleBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
});

export default SettingsPage;
