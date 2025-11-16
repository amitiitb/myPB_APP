import HeaderBar from '@/components/HeaderBar';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface InventoryScreenProps {
  activeTab?: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress?: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ activeTab, onTabPress }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showSettings, setShowSettings] = React.useState(false);
  const notificationCount = 4;

  // Show settings screen
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <>
      <HeaderBar 
        title={t('nav.inventory')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onNotificationPress={() => console.log('Notifications pressed')}
        onSettingsPress={() => setShowSettings(true)}
      />
      <View style={[scss.container, darkMode && scss.containerDark]}>
        <ScrollView contentContainerStyle={scss.scrollContent}>
        {/* TODO: Render inventory items here */}
        <View style={[scss.placeholderBox, darkMode && scss.placeholderBoxDark]}>
          <Text style={[scss.placeholderText, darkMode && scss.placeholderTextDark]}>{t('inventory.noItems')}</Text>
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
    containerDark: {
      backgroundColor: '#1F2937',
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
      marginBottom: 12,
    },
    titleDark: {
      color: '#F3F4F6',
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
    placeholderBoxDark: {
      backgroundColor: '#374151',
      borderColor: '#4B5563',
    },
    placeholderText: {
      fontSize: 16,
      color: '#6B7280',
      textAlign: 'center',
    },
    placeholderTextDark: {
      color: '#D1D5DB',
    },
  });

export default InventoryScreen;
