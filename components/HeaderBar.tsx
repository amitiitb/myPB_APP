import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface HeaderBarProps {
  title: string;
  notificationCount?: number;
  language?: 'en' | 'hi';
  onLanguageToggle?: () => void;
  onNotificationPress?: () => void;
  onSettingsPress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  notificationCount = 0,
  language = 'en',
  onLanguageToggle,
  onNotificationPress,
  onSettingsPress,
}) => {
  return (
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRightRow}>
        {/* Language Toggle */}
        {onLanguageToggle && (
          <TouchableOpacity style={styles.languageToggle} onPress={onLanguageToggle}>
            <Text style={styles.languageText}>
              {language === 'en' ? 'हिंदी' : 'English'}
            </Text>
          </TouchableOpacity>
        )}
        {/* Notification Bell */}
        <TouchableOpacity style={styles.iconWrapper} onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Settings Icon */}
        <TouchableOpacity style={styles.iconWrapper} onPress={onSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerBar: {
    height: 64,
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageToggle: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
    marginRight: 12,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    opacity: 0.95,
  },
  iconWrapper: {
    marginLeft: 12,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default HeaderBar;
