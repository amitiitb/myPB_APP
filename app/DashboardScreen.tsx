import AddOrderStep1 from '@/components/AddOrderStep1';
import CategoryCard from '@/components/CategoryCard';
import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import InFocusPagerCard from '@/components/InFocusPagerCard';
import NotificationsScreen from '@/components/NotificationsScreen';
import OrderStatusTile from '@/components/OrderStatusTile';
import PageIndicator from '@/components/PageIndicator';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams, useNavigation } from 'expo-router';
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
  const [currentPagerPage, setCurrentPagerPage] = useState(0);
  const notificationCount = 4;
  const navigation = useNavigation<any>();

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
        <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
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
    return (
      <>
        <NotificationsScreen onBack={() => setShowNotifications(false)} activeTab={activeTab} onTabPress={handleTabPress} />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
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
        <OrdersScreen 
          activeTab={activeTab} 
          onTabPress={handleTabPress} 
          ownerName={ownerName}
          ownerPhone={phoneNumber}
          ownerWhatsapp={whatsappNumber}
          pressName={pressName}
          owners={owners}
          composers={composers}
          operators={operators}
        />
        <FooterNav activeTab={activeTab} onTabPress={handleTabPress} />
      </>
    );
  } else if (activeTab === 'finance') {
    mainContent = (
      <FinanceScreen 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
        ownerName={ownerName}
        ownerPhone={phoneNumber}
        ownerWhatsapp={whatsappNumber}
        pressName={pressName}
        owners={owners}
        composers={composers}
        operators={operators}
      />
    );
  } else if (activeTab === 'inventory') {
    mainContent = (
      <InventoryScreen 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
        ownerName={ownerName}
        ownerPhone={phoneNumber}
        ownerWhatsapp={whatsappNumber}
        pressName={pressName}
        owners={owners}
        composers={composers}
        operators={operators}
      />
    );
  } else if (activeTab === 'reports') {
    mainContent = (
      <ReportsScreen 
        activeTab={activeTab} 
        onTabPress={handleTabPress} 
        ownerName={ownerName}
        ownerPhone={phoneNumber}
        ownerWhatsapp={whatsappNumber}
        pressName={pressName}
        owners={owners}
        composers={composers}
        operators={operators}
      />
    );
  } else {
    // Dummy data for dashboard sections
    const categories = [
      { name: 'Marriage Cards', icon: 'heart' },
      { name: 'Visiting Cards', icon: 'card' },
      { name: 'Flex', icon: 'flag' },
      { name: 'Stickers', icon: 'pricetag' },
      { name: 'Envelopes', icon: 'mail' },
      { name: 'Labels', icon: 'bookmark' },
    ];

    // At a Glance - Only these 3 statuses now
    const atAGlanceStatuses = [
      { label: 'Composing', icon: 'pencil', color: '#8B5CF6', status: 'Composing' },
      { label: 'Printing', icon: 'print', color: '#EC4899', status: 'Printing' },
      { label: 'Proofing', icon: 'eye', color: '#06B6D4', status: 'Proofing' },
    ];

    // Page 1: Orders Card
    const ordersCardStats = [
      { label: 'Total Orders', value: orders.length, icon: 'list', color: '#7C3AED' },
      { label: 'Active Orders', value: orders.filter(o => !['Delivered', 'Completed'].includes(o.status)).length, icon: 'timer', color: '#3B82F6' },
      { label: 'Pending Today', value: orders.filter(o => o.status === 'Order Placed').length, icon: 'time', color: '#F59E0B' },
    ];

    // Page 2: Amounts Card
    const amountsCardStats = [
      { label: 'Total Amount', value: `₹${totalRevenue.toLocaleString()}`, icon: 'wallet', color: '#7C3AED' },
      { label: 'Amount Received', value: `₹${received.toLocaleString()}`, icon: 'arrow-down-circle', color: '#10B981' },
      { label: 'Pending Amount', value: `₹${totalPending.toLocaleString()}`, icon: 'alert-circle', color: '#F59E0B' },
    ];

    // Handle status tile tap - navigate to orders with filter
    const handleStatusTileTap = (status: string) => {
      setActiveTab('orders');
      // Pass filter status via route params
      navigation.navigate('(tabs)', {
        screen: 'orders',
        params: { filterStatus: status }
      });
    };

    mainContent = (
      <>
        <ScrollView contentContainerStyle={[scss.scrollContent, darkMode && scss.scrollContentDark]} showsVerticalScrollIndicator={false}>
          
          {/* SECTION 1: IN FOCUS - Horizontal Pager with Two Big Cards */}
          <View style={scss.sectionContainer}>
            <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>In Focus</Text>
            
            {/* Pager ScrollView */}
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(event) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const currentPageIndex = Math.round(contentOffsetX / (width * 0.9));
                setCurrentPagerPage(currentPageIndex);
              }}
              style={scss.pagerContainer}
              contentContainerStyle={scss.pagerContent}
            >
              {/* Card 1: Orders Stats */}
              <View style={scss.pagerCardWrapper}>
                <InFocusPagerCard
                  title="Orders"
                  stats={ordersCardStats}
                  backgroundColor="#F0F4FF"
                />
              </View>

              {/* Card 2: Amounts Stats */}
              <View style={scss.pagerCardWrapper}>
                <InFocusPagerCard
                  title="Amounts"
                  stats={amountsCardStats}
                  backgroundColor="#FFF8F0"
                />
              </View>
            </ScrollView>

            {/* Page Indicator */}
            <PageIndicator totalPages={2} currentPage={currentPagerPage} />
          </View>

          {/* SECTION 2: AT A GLANCE - Order Status Summary (Only 3 statuses) */}
          <View style={scss.sectionContainer}>
            <View style={scss.sectionHeader}>
              <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>At a Glance</Text>
            </View>

            {/* Show 3 status tiles in a row - Composing, Printing, Proofing */}
            <View style={scss.statusTilesRow}>
              {atAGlanceStatuses.map((status, idx) => {
                let count = 0;
                if (status.status === 'Composing') {
                  count = orders.filter(o => o.status === 'Composing').length;
                } else if (status.status === 'Printing') {
                  count = orders.filter(o => o.status === 'Printing').length;
                } else if (status.status === 'Proofing') {
                  count = orders.filter(o => o.status === 'Proofing').length;
                }

                return (
                  <TouchableOpacity
                    key={`status-${idx}`}
                    onPress={() => handleStatusTileTap(status.status)}
                    activeOpacity={0.7}
                  >
                    <OrderStatusTile
                      label={status.label}
                      count={count}
                      icon={status.icon}
                      color={status.color}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* SECTION 3: POPULAR CATEGORIES */}
          <View style={scss.sectionContainer}>
            <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Popular Categories</Text>
            <View style={scss.categoriesGridLayout}>
              {categories.map((category, idx) => (
                <View key={`category-${idx}`} style={scss.categoryItemWrapper}>
                  <CategoryCard
                    name={category.name}
                    icon={category.icon}
                    onPress={() => setActiveTab('orders')}
                  />
                </View>
              ))}
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
    backgroundColor: '#7C3AED',
  },
  safeAreaDark: {
    backgroundColor: '#5B21B6',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 120,
    backgroundColor: '#FFFFFF',
  },
  scrollContentDark: {
    backgroundColor: '#1F2937',
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  statsScroll: {
    marginHorizontal: -20, // Compensate for section padding
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statusTilesRowCompact: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statusTilesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pagerContainer: {
    marginHorizontal: -20, // Extend beyond section padding
  },
  pagerContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  pagerCardWrapper: {
    width: width - 40, // Responsive width minus padding
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allStatusesContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  allStatusesContainerDark: {
    backgroundColor: '#374151',
  },
  allStatusesGridExpanded: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  allStatusesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  closeSeeAllBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  closeSeeAllText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  categoriesGridLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  categoryItemWrapper: {
    width: '48%',
    marginBottom: 8,
  },
  dateFilterBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateFilterBtnContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  dateFilterBtnText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dateFilterBtnDark: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  heroCard: {
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
    // Dark mode handled by LinearGradient colors prop
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
  datePickerRight: {
    position: 'absolute',
    right: '5%',
    top: 185,
    width: '60%',
    zIndex: 10,
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
  revenueCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  revenueCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  revenueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  revenueIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  revenueAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
    letterSpacing: -1,
  },
  revenueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  revenueMetric: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  revenueMetricText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  pipelineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  pipelineContainer: {
    marginBottom: 24,
  },
  pipelineProgressContainer: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  pipelineProgressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  pipelineProgressFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  pipelineStages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pipelineStage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  pipelineCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    alignItems: 'center',
  },
  pipelineCardDark: {
    backgroundColor: '#374151',
  },
  pipelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  pipelineIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipelineBadge: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pipelineBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  pipelineCount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  pipelineCountDark: {
    color: '#FFFFFF',
  },
  pipelineLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  pipelineLabelDark: {
    color: '#D1D5DB',
  },
  pipelineCardFooter: {
    marginTop: 4,
  },
  pipelineSubText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
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
    color: '#FFFFFF',
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
    color: '#FFFFFF',
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
