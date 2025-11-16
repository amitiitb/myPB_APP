import HeaderBar from '@/components/HeaderBar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface CustomersScreenProps {
  activeTab?: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress?: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const CustomersScreen: React.FC<CustomersScreenProps> = ({ activeTab, onTabPress }) => {
  const [showSettings, setShowSettings] = React.useState(false);
  const [language, setLanguage] = React.useState<'en' | 'hi'>('en');
  const notificationCount = 4;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      <HeaderBar 
        title="Customers" 
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={toggleLanguage}
        onNotificationPress={() => console.log('Notifications pressed')}
        onSettingsPress={() => setShowSettings(true)}
      />
      <View style={scss.container}>
        <ScrollView contentContainerStyle={scss.scrollContent}>
        <Text style={scss.title}>Customers</Text>
        {/* TODO: Render customers list here */}
        <View style={scss.placeholderBox}>
          <Text style={scss.placeholderText}>No customers yet. Add your first customer!</Text>
        </View>
      </ScrollView>
    </View>
    </>
  );
};

const scss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  placeholderBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  placeholderText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CustomersScreen;
