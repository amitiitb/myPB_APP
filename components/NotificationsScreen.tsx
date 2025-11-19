import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Notification {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

interface NotificationsScreenProps {
  onBack: () => void;
  activeTab?: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress?: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ 
  onBack, 
  activeTab = 'home',
  onTabPress = () => {},
}) => {
  const { darkMode } = useTheme();
  const [showMore, setShowMore] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      icon: '📦',
      title: 'Ready for Delivery',
      description: 'Order #3npYbi for Amit is ready for delivery.',
      timestamp: '10 days ago',
      isRead: true,
    },
    {
      id: '2',
      icon: '🖨️',
      title: 'Ready for Printing',
      description: 'Order #3npYbi for customer has been approved and is ready for printing.',
      timestamp: '10 days ago',
      isRead: true,
    },
    {
      id: '3',
      icon: '📄',
      title: 'Ready for Proofreading',
      description: 'Order #3npYbi for customer is ready for proofreading.',
      timestamp: '10 days ago',
      isRead: true,
    },
    {
      id: '4',
      icon: '👤',
      title: 'Composer Assigned',
      description: 'Order #3npYbi for customer has been assigned to Amit 01st Nov',
      timestamp: '10 days ago',
      isRead: false,
    },
    {
      id: '5',
      icon: '👤',
      title: 'Composer Assigned',
      description: 'Order #3npYbi for customer has been assigned to team member.',
      timestamp: '9 days ago',
      isRead: false,
    },
    {
      id: '6',
      icon: '💰',
      title: 'Payment Received',
      description: 'Payment of Rs. 5000 received for Order #3npYbi.',
      timestamp: '8 days ago',
      isRead: true,
    },
    {
      id: '7',
      icon: '⚠️',
      title: 'Amount Pending',
      description: 'Amount of Rs. 2000 pending for Order #2mpXai.',
      timestamp: '7 days ago',
      isRead: true,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications([]);
    setShowMore(false);
  };

  // Sample notifications data
  const allNotifications: Notification[] = notifications;

  const displayedNotifications = showMore ? allNotifications : allNotifications.slice(0, 5);

  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      <View style={[scss.container, darkMode && scss.containerDark]}>
          {/* Header */}
          <View style={[scss.header, darkMode && scss.headerDark]}>
            <Text style={scss.headerTitle}>Notifications</Text>
            <TouchableOpacity style={scss.markAllBtn} onPress={handleMarkAllAsRead}>
              <Text style={scss.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          </View>

          {/* Notifications List */}
          <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
        {allNotifications.length === 0 ? (
          <View style={scss.emptyState}>
            <Ionicons name="checkmark-circle-outline" size={64} color={darkMode ? '#6B7280' : '#D1D5DB'} />
            <Text style={[scss.emptyStateText, darkMode && scss.emptyStateTextDark]}>All notifications read</Text>
          </View>
        ) : (
          <>
            {displayedNotifications.map((notification: Notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[scss.notificationCard, darkMode && scss.notificationCardDark, !notification.isRead && scss.notificationCardUnread]}
              >
                {/* Icon */}
                <View style={scss.iconContainer}>
                  <Text style={scss.notificationIcon}>{notification.icon}</Text>
                  {!notification.isRead && <View style={scss.unreadDot} />}
                </View>

                {/* Content */}
                <View style={scss.contentContainer}>
                  <Text style={[scss.notificationTitle, darkMode && scss.notificationTitleDark]}>
                    {notification.title}
                  </Text>
                  <Text style={[scss.notificationDescription, darkMode && scss.notificationDescriptionDark]}>
                    {notification.description}
                  </Text>
                  <Text style={[scss.notificationTime, darkMode && scss.notificationTimeDark]}>
                    {notification.timestamp}
                  </Text>
                </View>

                {/* Read indicator */}
                {!notification.isRead && (
                  <View style={scss.readIndicator}>
                    <Ionicons name="ellipse" size={10} color="#7C3AED" />
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {/* Show More Button */}
            {!showMore && allNotifications.length > 5 && (
              <TouchableOpacity
                style={[scss.showMoreBtn, darkMode && scss.showMoreBtnDark]}
                onPress={() => setShowMore(true)}
              >
                <Text style={[scss.showMoreText, darkMode && scss.showMoreTextDark]}>Show More</Text>
                <Ionicons name="chevron-down" size={18} color={darkMode ? '#9CA3AF' : '#6B7280'} />
              </TouchableOpacity>
            )}
          </>
        )}
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const scss = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#7C3AED',
  },
  safeAreaDark: {
    backgroundColor: '#5B21B6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    height: 64,
  },
  headerDark: {
    backgroundColor: '#7C3AED',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  markAllBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  markAllText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateTextDark: {
    color: '#E5E7EB',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  notificationCardDark: {
    backgroundColor: '#374151',
  },
  notificationCardUnread: {
    borderLeftColor: '#7C3AED',
  },
  iconContainer: {
    position: 'relative',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  notificationIcon: {
    fontSize: 24,
  },
  unreadDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  notificationTitleDark: {
    color: '#F3F4F6',
  },
  notificationDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  notificationDescriptionDark: {
    color: '#D1D5DB',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  notificationTimeDark: {
    color: '#6B7280',
  },
  readIndicator: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  showMoreBtnDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  showMoreText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginRight: 6,
  },
  showMoreTextDark: {
    color: '#D1D5DB',
  },
});

export default NotificationsScreen;
