import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import NotificationsScreen from '@/components/NotificationsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

interface InventoryScreenProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
}

const InventoryScreen: React.FC<InventoryScreenProps> = ({ activeTab, onTabPress }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const notificationCount = 4;

  // Show settings screen
  if (showSettings) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SettingsScreen onBack={() => setShowSettings(false)} />
      </SafeAreaView>
    );
  }

  // Show notifications screen
  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
  }

  return (
    <>
      <HeaderBar 
        title={t('nav.inventory')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onNotificationPress={() => setShowNotifications(true)}
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
      {!showSettings && activeTab && onTabPress && (
        <FooterNav activeTab={activeTab} onTabPress={onTabPress} />
      )}
    </>
  );
};

  const scss = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
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
