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
  TouchableOpacity,
  View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FinanceScreen from './(tabs)/finance';
import InventoryScreen from './(tabs)/inventory';
import OrdersScreen from './(tabs)/orders';
import ReportsScreen from './(tabs)/reports';

// Order type for dashboard calculations
interface Order {
  id: string;
  customerName: string;
  productType: string;
  delivery: string;
  deliveryDate?: string;
  designVersions?: number;
  amount: number;
  pending: number;
  advancePaid?: number;
  status: string;
  assignedTo?: string;
  assignedRole?: string;
  contact?: string;
  orderPlaced?: string;
  customerType?: string;
  whatsapp?: string;
  material?: string;
  quantity?: number;
  printingType?: string;
  inkColor?: string;
  attachments?: {
    sample?: string;
    orderForm?: string;
    voiceNote?: string;
  };
}

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
          <Text style={[scss.calendarDayText, darkMode && scss.calendarDayTextDark, isSelected && scss.calendarDayTextSelected]}>
            {i}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Footer navigation handler
  const handleTabPress = (tab: typeof activeTab) => {
    setShowSettings(false); // Close settings when navigating
    setShowNotifications(false); // Close notifications when navigating
    setActiveTab(tab);
  };

  // Show settings screen
  if (showSettings) {
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
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
        </SafeAreaView>
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  }

  // Show notifications screen
  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
  }

  // Orders data for dashboard calculations (should be replaced with real data source in production)
  const orders: Order[] = [
    {
      id: '#3npYbi',
      customerName: 'Amit',
      productType: 'Marriage Card',
      delivery: '10 Nov',
      deliveryDate: 'November 10th, 2025',
      designVersions: 1,
      amount: 20000,
      advancePaid: 2000,
      pending: 18000,
      status: 'Ready to Deliver',
      contact: '9876543210',
      orderPlaced: '06 Nov, 2025',
      customerType: 'individual',
      whatsapp: '+91 88790 49091',
      material: "Card (10*12)",
      quantity: 1998,
      printingType: 'Digital',
      inkColor: 'Red, Orange',
      attachments: { sample: 'View', orderForm: 'View (1)', voiceNote: 'None' },
    },
    {
      id: '#7kqRst',
      customerName: 'Rohit Singh',
      productType: 'Sticker',
      delivery: '24 Nov',
      designVersions: undefined,
      amount: 233000,
      advancePaid: 500,
      pending: 232787,
      status: 'Composing',
      contact: '9876543211',
      orderPlaced: '01 Nov, 2025',
      customerType: 'business',
      whatsapp: '+91 88790 49091',
      material: 'Vinyl',
      quantity: 5000,
      printingType: 'Offset',
      inkColor: 'CMYK',
      attachments: { sample: 'None', orderForm: 'View (2)', voiceNote: 'None' },
    },
    {
      id: '#2mxPqw',
      customerName: 'Priya Sharma',
      productType: 'Wedding Invitation',
      delivery: '28 Nov',
      designVersions: 2,
      amount: 15000,
      advancePaid: 0,
      pending: 15000,
      status: 'Order Placed',
      contact: '9123456789',
      orderPlaced: '15 Nov, 2025',
      customerType: 'individual',
      whatsapp: '+91 91234 56789',
      material: 'Premium Card Stock',
      quantity: 250,
      printingType: 'Digital',
      inkColor: 'Gold, Maroon',
      attachments: { sample: 'View', orderForm: 'View (1)', voiceNote: 'View' },
    },
  ];

  // Calculate received, balance, and total sales
  const received = orders.reduce((sum, order) => sum + ((order.amount || 0) - (order.pending || 0)), 0);
  const balance = orders.reduce((sum, order) => sum + (order.pending || 0), 0);
  const totalSales = received + balance;
  // For dashboard: totalRevenue = totalSales, totalPending = balance
  const totalRevenue = totalSales;
  const totalPending = balance;

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
        <FinanceScreen activeTab={activeTab} onTabPress={handleTabPress} />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else if (activeTab === 'inventory') {
    mainContent = (
      <>
        <InventoryScreen activeTab={activeTab} onTabPress={handleTabPress} />
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
          {/* Hero Section with Key Insight */}
          <View style={[scss.heroCard, darkMode && scss.heroCardDark]}>
            <View style={scss.heroTop}>
              <View>
                <Text style={[scss.heroLabel, darkMode && scss.heroLabelDark]}>Today's Performance</Text>
                <Text style={[scss.heroValue, darkMode && scss.heroValueDark]}>{orders.length} Active Orders</Text>
              </View>
              <TouchableOpacity 
                style={[scss.dateFilterBtn, darkMode && scss.dateFilterBtnDark]} 
                onPress={() => setShowDatePicker(!showDatePicker)}
                activeOpacity={0.7}
              >
                <Ionicons name="calendar-outline" size={18} color={darkMode ? '#A78BFA' : '#7C3AED'} />
                <Text style={[scss.dateFilterText, darkMode && scss.dateFilterTextDark]}>{dateFilter}</Text>
              </TouchableOpacity>
            </View>
            <View style={scss.heroBottom}>
              <View style={scss.heroMetric}>
                <Ionicons name="time-outline" size={18} color="#10B981" />
                <Text style={[scss.heroMetricText, darkMode && scss.heroMetricTextDark]}>{orders.filter(o => o.status !== 'Delivered' && o.status !== 'Completed').length} in production</Text>
              </View>
              <View style={scss.heroMetric}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#7C3AED" />
                <Text style={[scss.heroMetricText, darkMode && scss.heroMetricTextDark]}>{orders.filter(o => o.status === 'Delivered' || o.status === 'Completed').length} delivered today</Text>
              </View>
            </View>
          </View>

          {/* Date Filter Dropdown */}
          {showDatePicker && (
            <View style={[scss.datePickerDropdown, darkMode && scss.datePickerDropdownDark]}>
              {/* Quick Filter Options */}
              <View style={[scss.quickFilterContainer, darkMode && scss.quickFilterContainerDark]}>
                {dateFilterOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      scss.quickFilterOption,
                      darkMode && scss.quickFilterOptionDark,
                      dateFilter === option && scss.quickFilterOptionActive
                    ]}
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
          {/* Insights Grid */}
          <View style={scss.insightsGrid}>
            {/* Revenue Card - Full Width */}
            <TouchableOpacity
              style={[scss.insightCardFull, darkMode && scss.insightCardDark]}
              activeOpacity={0.7}
              onPress={() => setActiveTab('finance')}
            >
              <View style={scss.insightCardContent}>
                <View style={scss.insightLeft}>
                  <View style={[scss.insightIconBg, { backgroundColor: '#D1FAE5' }]}>
                    <Ionicons name="wallet" size={24} color="#10B981" />
                  </View>
                  <View style={scss.insightInfo}>
                    <Text style={[scss.insightLabel, darkMode && scss.insightLabelDark]}>MONTHLY REVENUE</Text>
                    <Text style={[scss.insightValue, darkMode && scss.insightValueDark]}>₹{totalRevenue.toLocaleString()}</Text>
                    <Text style={[scss.insightSubtext, darkMode && scss.insightSubtextDark]}>₹{totalPending.toLocaleString()} pending collection</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={darkMode ? '#6B7280' : '#9CA3AF'} />
              </View>
            </TouchableOpacity>

            {/* Workflow Status */}
            <TouchableOpacity
              style={[scss.insightCard, darkMode && scss.insightCardDark]}
              activeOpacity={0.7}
              onPress={() => setActiveTab('orders')}
            >
              <View style={[scss.insightIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="print" size={22} color="#F59E0B" />
              </View>
              <Text style={[scss.insightLabel, darkMode && scss.insightLabelDark, { marginTop: 12 }]}>PRINTING</Text>
              <Text style={[scss.insightValue, darkMode && scss.insightValueDark]}>1</Text>
              <Text style={[scss.insightSubtext, darkMode && scss.insightSubtextDark]}>Order in queue</Text>
            </TouchableOpacity>

            {/* Proofreading */}
            <TouchableOpacity
              style={[scss.insightCard, darkMode && scss.insightCardDark]}
              activeOpacity={0.7}
              onPress={() => setActiveTab('orders')}
            >
              <View style={[scss.insightIconBg, { backgroundColor: '#E0E7FF' }]}>
                <Ionicons name="glasses" size={22} color="#6366F1" />
              </View>
              <Text style={[scss.insightLabel, darkMode && scss.insightLabelDark, { marginTop: 12 }]}>PROOFING</Text>
              <Text style={[scss.insightValue, darkMode && scss.insightValueDark]}>1</Text>
              <Text style={[scss.insightSubtext, darkMode && scss.insightSubtextDark]}>Awaiting review</Text>
            </TouchableOpacity>
          </View>

          {/* Order Overview Section */}
          <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Order Pipeline</Text>
          <View style={[scss.orderOverviewCard, darkMode && scss.orderOverviewCardDark]}>
            {/* Active Orders */}
            <TouchableOpacity 
              style={scss.orderStatusRow}
              onPress={() => setActiveTab('orders')}
              activeOpacity={0.7}
            >
              <View style={scss.orderStatusLeft}>
                <View style={[scss.statusDot, { backgroundColor: '#3B82F6' }]} />
                <Text style={[scss.orderStatusLabel, darkMode && scss.orderStatusLabelDark]}>Active Orders</Text>
              </View>
              <View style={scss.orderStatusRight}>
                <Text style={[scss.orderStatusCount, darkMode && scss.orderStatusCountDark]}>2</Text>
              </View>
            </TouchableOpacity>

            {/* Proofreading */}
            <TouchableOpacity 
              style={scss.orderStatusRow}
              onPress={() => setActiveTab('orders')}
              activeOpacity={0.7}
            >
              <View style={scss.orderStatusLeft}>
                <View style={[scss.statusDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={[scss.orderStatusLabel, darkMode && scss.orderStatusLabelDark]}>In Proofreading</Text>
              </View>
              <View style={scss.orderStatusRight}>
                <Text style={[scss.orderStatusCount, darkMode && scss.orderStatusCountDark]}>1</Text>
              </View>
            </TouchableOpacity>

            {/* Delivered */}
            <TouchableOpacity 
              style={[scss.orderStatusRow, scss.orderStatusRowLast]}
              onPress={() => setActiveTab('orders')}
              activeOpacity={0.7}
            >
              <View style={scss.orderStatusLeft}>
                <View style={[scss.statusDot, { backgroundColor: '#10B981' }]} />
                <Text style={[scss.orderStatusLabel, darkMode && scss.orderStatusLabelDark]}>Completed</Text>
              </View>
              <View style={scss.orderStatusRight}>
                <Text style={[scss.orderStatusCount, darkMode && scss.orderStatusCountDark]}>1</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Category Breakdown Section */}
          <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Popular Categories</Text>
          <View style={[scss.categoryBreakdownCard, darkMode && scss.categoryBreakdownCardDark]}>
            <View style={scss.categoryRow}>
              {/* Sticker */}
              <TouchableOpacity 
                style={[scss.categoryTile, { backgroundColor: '#F3E8FF' }]}
                activeOpacity={0.7}
                onPress={() => setActiveTab('orders')}
              >
                <Text style={[scss.categoryName, { color: '#7C3AED' }]}>Sticker</Text>
                <Text style={[scss.categoryCount, { color: '#6B21A8' }]}>1</Text>
              </TouchableOpacity>
              
              {/* Letterhead */}
              <TouchableOpacity 
                style={[scss.categoryTile, { backgroundColor: '#DBEAFE' }]}
                activeOpacity={0.7}
                onPress={() => setActiveTab('orders')}
              >
                <Text style={[scss.categoryName, { color: '#1D4ED8' }]}>Letterhead</Text>
                <Text style={[scss.categoryCount, { color: '#1E3A8A' }]}>1</Text>
              </TouchableOpacity>
            </View>
            
            <View style={scss.categoryRow}>
              {/* Flex/Banner */}
              <TouchableOpacity 
                style={[scss.categoryTileFull, { backgroundColor: '#FCE7F3' }]}
                activeOpacity={0.7}
                onPress={() => setActiveTab('orders')}
              >
                <Text style={[scss.categoryName, { color: '#BE185D' }]}>Flex/Banner</Text>
                <Text style={[scss.categoryCount, { color: '#9F1239' }]}>1</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  heroCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  heroCardDark: {
    backgroundColor: '#5B21B6',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroLabelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  heroValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroValueDark: {
    color: '#FFFFFF',
  },
  heroBottom: {
    flexDirection: 'row',
    gap: 20,
  },
  heroMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroMetricText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  heroMetricTextDark: {
    color: 'rgba(255,255,255,0.9)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  dateFilterBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
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
  quickFilterContainerDark: {
    borderBottomColor: '#4B5563',
  },
  quickFilterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  quickFilterOptionDark: {
    backgroundColor: '#4B5563',
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
    color: '#E5E7EB',
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
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateFilterTextDark: {
    color: '#FFFFFF',
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reportCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 0,
  },
  reportCardDark: {
    backgroundColor: '#374151',
  },
  reportCardPurple: {
    borderLeftWidth: 4,
    borderLeftColor: '#7C3AED',
  },
  reportCardGreen: {
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  reportCardBlue: {
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  reportCardOrange: {
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  reportCardHeader: {
    marginBottom: 12,
  },
  reportIconBg: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportBigNum: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  reportBigNumDark: {
    color: '#F3F4F6',
  },
  reportCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  reportCardTitleDark: {
    color: '#9CA3AF',
  },
  reportProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  reportProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  reportFooter: {
    marginTop: 4,
  },
  reportFooterText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  reportFooterTextDark: {
    color: '#6B7280',
  },
  insightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  insightCardFull: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  insightCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  insightCardDark: {
    backgroundColor: '#374151',
  },
  insightCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  insightIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightInfo: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 4,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  insightLabelDark: {
    color: '#9CA3AF',
  },
  insightValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  insightValueDark: {
    color: '#F3F4F6',
  },
  insightSubtext: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  insightSubtextDark: {
    color: '#6B7280',
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
  orderOverviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 0,
  },
  orderOverviewCardDark: {
    backgroundColor: '#374151',
  },
  orderStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderStatusRowLast: {
    borderBottomWidth: 0,
  },
  orderStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  orderStatusLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  orderStatusLabelDark: {
    color: '#E5E7EB',
  },
  orderStatusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderStatusCount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  orderStatusCountDark: {
    color: '#F3F4F6',
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
  categoryBreakdownCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 0,
  },
  categoryBreakdownCardDark: {
    backgroundColor: '#374151',
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  categoryTile: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTileFull: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  categoryCount: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
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
