import AddOrderStep1 from '@/components/AddOrderStep1';
import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import NotificationsScreen from '@/components/NotificationsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FinanceScreen from './(tabs)/finance';
import InventoryScreen from './(tabs)/inventory';
import OrdersScreen from './(tabs)/orders';
import ReportsScreen from './(tabs)/reports';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const params = useLocalSearchParams<{
    owners?: string;
    composers?: string;
    operators?: string;
    ownerName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    pressName?: string;
  }>();

  // Parse team data from params
  const [owners] = useState(() => {
    try {
      return params.owners ? JSON.parse(params.owners) : [];
    } catch {
      return [];
    }
  });

  const [composers] = useState(() => {
    try {
      return params.composers ? JSON.parse(params.composers) : [];
    } catch {
      return [];
    }
  });

  const [operators] = useState(() => {
    try {
      return params.operators ? JSON.parse(params.operators) : [];
    } catch {
      return [];
    }
  });

  const ownerName = params.ownerName || 'Account Owner';
  const phoneNumber = params.phoneNumber || '9876543210';
  const whatsappNumber = params.whatsappNumber || phoneNumber;
  const pressName = params.pressName || 'Press Name';
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'finance' | 'inventory' | 'reports'>('home');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationCount = 4;

  const dateFilterOptions = ['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'Current Month', 'All Time'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendar = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Day names
    dayNames.forEach((day) => {
      days.push(
        <Text key={`day-${day}`} style={[scss.calendarDayName, darkMode && scss.calendarDayNameDark]}>
          {day}
        </Text>
      );
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={[scss.calendarDay, scss.calendarDayEmpty]} />);
    }

    // Days of month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
      const isSelected = startDate && i === startDate.getDate() && selectedDate.getMonth() === startDate.getMonth();
      const isInRange =
        startDate &&
        endDate &&
        currentDate >= startDate &&
        currentDate <= endDate;

      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={[
            scss.calendarDay,
            isSelected && scss.calendarDaySelected,
            isInRange && scss.calendarDayInRange,
          ]}
          onPress={() => {
            if (!startDate) {
              setStartDate(currentDate);
            } else if (!endDate) {
              if (currentDate < startDate) {
                setEndDate(startDate);
                setStartDate(currentDate);
              } else {
                setEndDate(currentDate);
              }
            } else {
              setStartDate(currentDate);
              setEndDate(null);
            }
          }}
        >
          <Text style={[scss.calendarDayText, isSelected && scss.calendarDayTextSelected]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Show settings screen
  if (showSettings) {
    return (
      <SettingsScreen 
        onBack={() => setShowSettings(false)} 
        ownerName={ownerName}
        ownerPhone={phoneNumber}
        ownerWhatsapp={whatsappNumber}
        pressName={pressName}
        owners={owners}
        composers={composers}
        operators={operators}
      />
    );
  }

  // Show notifications screen
  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
  }

  // Footer navigation handler
  const handleTabPress = (tab: typeof activeTab) => setActiveTab(tab);

  // Render main content based on activeTab
  let mainContent;
  if (showAddOrder) {
    mainContent = <AddOrderStep1 onNext={() => {}} />;
  } else if (activeTab === 'orders') {
    mainContent = (
      <>
        <OrdersScreen activeTab={activeTab} onTabPress={handleTabPress} />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else if (activeTab === 'finance') {
    mainContent = (
      <>
        <FinanceScreen />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else if (activeTab === 'inventory') {
    mainContent = (
      <>
        <InventoryScreen />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else if (activeTab === 'reports') {
    mainContent = (
      <>
        <ReportsScreen />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else {
    mainContent = (
      <>
        <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Business Reports Section */}
          <View style={scss.sectionHeader}>
            <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('dashboard.businessReports')}</Text>
            <TouchableOpacity style={[scss.dateFilterBtn, darkMode && scss.dateFilterBtnDark]} onPress={() => setShowDatePicker(!showDatePicker)}>
              <Ionicons name="calendar-outline" size={16} color={darkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 6 }} />
              <Text style={[scss.dateFilterText, darkMode && scss.dateFilterTextDark]}>{dateFilter}</Text>
              <Ionicons name="chevron-down" size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>

          {/* Date Filter Dropdown */}
          {showDatePicker && (
            <View style={[scss.datePickerDropdown, darkMode && scss.datePickerDropdownDark]}>
              {/* Quick Filter Options */}
              <View style={scss.quickFilterContainer}>
                {dateFilterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[scss.quickFilterOption, dateFilter === option && scss.quickFilterOptionActive]}
                    onPress={() => {
                      setDateFilter(option);
                      setStartDate(null);
                      setEndDate(null);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        scss.quickFilterOptionText,
                        darkMode && scss.quickFilterOptionTextDark,
                        dateFilter === option && scss.quickFilterOptionTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Calendar */}
              <View style={scss.calendarContainer}>
                <View style={scss.calendarHeader}>
                  <TouchableOpacity
                    onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                  >
                    <Text style={[scss.calendarNavText, darkMode && scss.calendarNavTextDark]}>{'<'}</Text>
                  </TouchableOpacity>
                  <Text style={[scss.calendarTitle, darkMode && scss.calendarTitleDark]}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                  >
                    <Text style={[scss.calendarNavText, darkMode && scss.calendarNavTextDark]}>{'>'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={scss.calendarGrid}>{renderCalendar()}</View>
              </View>

              {/* Apply Button */}
              {startDate && endDate && (
                <TouchableOpacity
                  style={[scss.applyBtn]}
                  onPress={() => {
                    const rangeStr = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                    setDateFilter(rangeStr);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={scss.applyBtnText}>Apply Range</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* Report Cards Grid */}
          <View style={scss.reportGrid}>
            {/* Card 1: Total Orders */}
            <TouchableOpacity
              style={[scss.reportCard, darkMode && scss.reportCardDark]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('orders')}
            >
              <Text style={[scss.reportBigNum, { color: '#7C3AED' }]}>0</Text>
              <Text style={[scss.reportCardTitle, darkMode && scss.reportCardTitleDark]}>{t('dashboard.totalOrders')}</Text>
              <Text style={scss.reportPercentDrop}>▼ 100%</Text>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabel, darkMode && scss.reportSubLabelDark]}>In Progress:</Text><Text style={[scss.reportSubValue, darkMode && scss.reportSubValueDark]}>0</Text></View>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabel, darkMode && scss.reportSubLabelDark]}>Delivered:</Text><Text style={[scss.reportSubValue, darkMode && scss.reportSubValueDark]}>0</Text></View>
              {/* Completion Rate Bar */}
              <View style={scss.completionBarBg}>
                <View style={scss.completionBarFill} />
              </View>
            </TouchableOpacity>
            {/* Card 2: Total Sales */}
            <TouchableOpacity
              style={[scss.reportCard, darkMode && scss.reportCardDark]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('finance')}
            >
              <Text style={[scss.reportBigNum, { color: '#10B981' }]}>0</Text>
              <Text style={[scss.reportCardTitle, darkMode && scss.reportCardTitleDark]}>{t('dashboard.totalSales')}</Text>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabel, darkMode && scss.reportSubLabelDark]}>{t('dashboard.received')}:</Text><Text style={[scss.reportSubValue, darkMode && scss.reportSubValueDark]}>0</Text></View>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabel, darkMode && scss.reportSubLabelDark]}>{t('dashboard.due')}:</Text><Text style={[scss.reportSubValue, darkMode && scss.reportSubValueDark]}>0</Text></View>
            </TouchableOpacity>
            {/* Card 3: Average Order */}
            <TouchableOpacity
              style={[scss.reportCard, darkMode && scss.reportCardDark]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('orders')}
            >
              <Text style={[scss.reportBigNum, { color: '#7C3AED' }]}>0</Text>
              <Text style={[scss.reportCardTitle, darkMode && scss.reportCardTitleDark]}>{t('dashboard.avgOrderInRs')}</Text>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.highest')}</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
              <View style={scss.reportSubRow}><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.lowest')}</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
            </TouchableOpacity>
            {/* Card 4: Total Reports */}
            <TouchableOpacity
              style={[scss.reportCard, darkMode && scss.reportCardDark]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('reports')}
            >
              <Text style={[scss.reportBigNum, { color: '#EF4444' }]}>5</Text>
              <Text style={[scss.reportCardTitle, darkMode && scss.reportCardTitleDark]}>{t('dashboard.totalReports')}</Text>
              <View style={scss.reportSubRow}><Ionicons name="document-text-outline" size={16} color="#10B981" style={{ marginRight: 4 }} /><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.new')}:</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
              <View style={scss.reportSubRow}><Ionicons name="download-outline" size={16} color="#7C3AED" style={{ marginRight: 4 }} /><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.generated')}:</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
            </TouchableOpacity>
          </View>

          {/* Order Overview Section */}
          <View style={scss.sectionHeader}>
            <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('dashboard.orderOverview')}</Text>
          </View>
          <TextInput
            style={[scss.orderOverviewBox, darkMode && scss.orderOverviewBoxDark]}
            placeholder={t('dashboard.enterOrderDetails')}
            placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
          />

          {/* Category Breakdown Section */}
          <View style={scss.sectionHeader}>
            <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('dashboard.categoryBreakdown')}</Text>
          </View>
          <View style={[scss.categoryBox, darkMode && scss.categoryBoxDark]} />
        </ScrollView>
        {/* Floating Add New Order Button */}
        <View style={scss.fabContainer}>
          <TouchableOpacity style={scss.fabButton} onPress={() => setShowAddOrder(true)}>
            <Ionicons name="add-circle" size={22} color="#fff" style={scss.fabIcon} />
            <Text style={scss.fabButtonText}>{t('dashboard.addNewOrder')}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }


  // Render based on activeTab - some screens have their own navigation
  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      {/* Show different content based on activeTab */}
      {activeTab === 'orders' || activeTab === 'finance' || activeTab === 'inventory' || activeTab === 'reports' ? (
        mainContent
      ) : (
        <>
          {/* Header Bar: Hide when AddOrderStep1 is shown */}
          {!showAddOrder && (
            <HeaderBar
              title={t('nav.dashboard')}
              notificationCount={notificationCount}
              language={language}
              onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              onNotificationPress={() => setShowNotifications(true)}
              onSettingsPress={() => setShowSettings(true)}
            />
          )}
          {mainContent}
          {/* Glass Bottom Navigation Bar */}
          <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
        </>
      )}
    </SafeAreaView>
  );
}


const scss = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 125,
    alignItems: 'center',
    zIndex: 10,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 32,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fabIcon: {
    marginRight: 8,
  },
  fabButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  safeAreaDark: {
    backgroundColor: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sectionTitleDark: {
    color: '#F3F4F6',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateFilterBtnDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  datePickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  datePickerDropdownDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  quickFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickFilterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  quickFilterOptionActive: {
    backgroundColor: '#7C3AED',
  },
  quickFilterOptionText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  quickFilterOptionTextDark: {
    color: '#F3F4F6',
  },
  quickFilterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarContainer: {
    marginTop: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarNavText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#7C3AED',
  },
  calendarNavTextDark: {
    color: '#A78BFA',
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  calendarTitleDark: {
    color: '#F3F4F6',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  calendarDayName: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  calendarDayNameDark: {
    color: '#D1D5DB',
  },
  calendarDay: {
    width: '14.28%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    marginBottom: 4,
  },
  calendarDayEmpty: {
    height: 0,
    marginBottom: 0,
  },
  calendarDaySelected: {
    backgroundColor: '#7C3AED',
  },
  calendarDayInRange: {
    backgroundColor: '#EDE9FE',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  calendarDayTextDark: {
    color: '#F3F4F6',
  },
  calendarDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  applyBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dateFilterOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
  dateFilterOptionActive: {
    backgroundColor: '#7C3AED',
  },
  dateFilterOptionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  dateFilterOptionTextDarkInactive: {
    color: '#E5E7EB',
  },
  dateFilterOptionTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateFilterText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  dateFilterTextDark: {
    color: '#E5E7EB',
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reportCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
    elevation: 3,
  },
  reportCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  reportBigNum: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  reportCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  reportCardTitleDark: {
    color: '#E5E7EB',
  },
  reportPercentDrop: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reportSubLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 4,
  },
  reportSubLabelDark: {
    color: '#D1D5DB',
  },
  reportSubValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  reportSubValueDark: {
    color: '#F3F4F6',
  },
  reportSubLabelSmall: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 2,
  },
  reportSubValueSmall: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    marginRight: 6,
  },
  completionBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 2,
  },
  completionBarFill: {
    width: '0%',
    height: 6,
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
  orderOverviewBox: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#374151',
  },
  orderOverviewBoxDark: {
    borderColor: '#4B5563',
    backgroundColor: '#374151',
    color: '#E5E7EB',
  },
  categoryBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 18,
    boxShadow: '0px 2px 4px rgba(0,0,0,0.08)',
    elevation: 3,
  },
  categoryBoxDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  addOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '70%',
    borderRadius: 26,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  addOrderBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNavBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Platform.OS === 'ios' ? 20 : 12,
    height: 70,
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
    elevation: 10,
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navTabActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTabBg: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navTabText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  navTabTextActive: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    marginTop: 2,
  },
});

export default DashboardScreen;
