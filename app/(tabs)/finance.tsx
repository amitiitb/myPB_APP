
import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import NotificationsScreen from '@/components/NotificationsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FinanceScreenProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ activeTab, onTabPress }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [tab, setTab] = useState<'income' | 'expenses'>('income');
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [search, setSearch] = useState('');
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
          <Text style={[scss.calendarDayText, isSelected && scss.calendarDayTextSelected, darkMode && scss.calendarDayTextDark]}>
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
      <SafeAreaView style={{ flex: 1 }}>
        <SettingsScreen onBack={() => setShowSettings(false)} />
      </SafeAreaView>
    );
  }

  // Show notifications screen
  if (showNotifications) {
    return (
      <>
        <NotificationsScreen onBack={() => setShowNotifications(false)} activeTab={activeTab} onTabPress={(tab) => { setShowNotifications(false); onTabPress(tab); }} />
        <FooterNav activeTab={activeTab} onTabPress={(tab) => { setShowNotifications(false); onTabPress(tab); }} />
      </>
    );
  }


  // Use the same orders array as dashboard (replace with real data source in production)
  const orders = [
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

  return (
    <>
      <HeaderBar 
        title={t('nav.finance')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onNotificationPress={() => setShowNotifications(true)}
        onSettingsPress={() => setShowSettings(true)}
      />
      <View style={[scss.container, darkMode && scss.containerDark]}>
        <ScrollView contentContainerStyle={scss.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Income/Expenses Toggle */}
        <View style={[scss.toggleRow, darkMode && scss.toggleRowDark]}>
          <TouchableOpacity style={[scss.toggleBtn, tab === 'income' && scss.toggleBtnActive, darkMode && tab !== 'income' && scss.toggleBtnDark]} onPress={() => setTab('income')}>
            <Text style={[scss.toggleBtnText, tab !== 'income' && darkMode && scss.toggleBtnTextDark, tab === 'income' && scss.toggleBtnTextActive]}>{t('finance.income')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[scss.toggleBtn, tab === 'expenses' && scss.toggleBtnActive, darkMode && tab !== 'expenses' && scss.toggleBtnDark]} onPress={() => setTab('expenses')}>
            <Text style={[scss.toggleBtnText, tab !== 'expenses' && darkMode && scss.toggleBtnTextDark, tab === 'expenses' && scss.toggleBtnTextActive]}>{t('finance.expenses')}</Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Filter */}
        <View style={scss.sectionHeader}>
          <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Transactions</Text>
          <TouchableOpacity style={[scss.dateFilterBtn, darkMode && scss.dateFilterBtnDark]} onPress={() => setShowDatePicker(!showDatePicker)}>
            <Ionicons name="calendar-outline" size={16} color={darkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 6 }} />
            <Text style={[scss.dateFilterText, darkMode && scss.dateFilterTextDark]}>{dateFilter}</Text>
            <Ionicons name={showDatePicker ? 'chevron-up' : 'chevron-down'} size={14} color={darkMode ? '#9CA3AF' : '#6B7280'} style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <View style={[scss.datePickerDropdown, darkMode && scss.datePickerDropdownDark]}>
            {/* Quick Filter Options */}
            <View style={scss.quickFilterContainer}>
              {dateFilterOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    scss.quickFilterOption,
                    dateFilter === option && scss.quickFilterOptionActive,
                  ]}
                  onPress={() => {
                    setDateFilter(option);
                    setShowDatePicker(false);
                    setStartDate(null);
                    setEndDate(null);
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
                <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>
                  <Ionicons name="chevron-back" size={20} color="#7C3AED" />
                </TouchableOpacity>
                <Text style={[scss.calendarTitle, darkMode && scss.calendarTitleDark]}>
                  {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>
                  <Ionicons name="chevron-forward" size={20} color="#7C3AED" />
                </TouchableOpacity>
              </View>

              <View style={scss.calendarGrid}>{renderCalendar()}</View>
            </View>

            {startDate && endDate && (
              <TouchableOpacity
                style={scss.applyBtn}
                onPress={() => {
                  setDateFilter(`${startDate.getDate()} - ${endDate.getDate()}`);
                  setShowDatePicker(false);
                }}
              >
                <Text style={scss.applyBtnText}>Apply Range</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Total Sales Card - Full Width */}
        <LinearGradient
          colors={darkMode ? ['#5B21B6', '#BE185D', '#D97706'] : ['#7C3AED', '#EC4899', '#F59E0B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={scss.totalSalesCard}
        >
          <Text style={[scss.totalSalesLabel, darkMode && scss.totalSalesLabelDark]}>{t('dashboard.totalSales')}</Text>
          <Text style={[scss.totalSalesValue, darkMode && scss.totalSalesValueDark]}>₹{totalSales.toLocaleString()}</Text>
        </LinearGradient>

        {/* Summary Cards - Three Components */}
        <View style={scss.summaryRow}>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>Received</Text>
            <Text style={[scss.summaryValue, { color: '#16A34A' }, darkMode && scss.summaryValueDark]}>₹{received.toLocaleString()}</Text>
          </View>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>Advance</Text>
            <Text style={[scss.summaryValue, { color: '#F59E0B' }, darkMode && scss.summaryValueDark]}>₹{orders.reduce((sum, order) => sum + (order.advancePaid || 0), 0).toLocaleString()}</Text>
          </View>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>Pending</Text>
            <Text style={[scss.summaryValue, { color: '#EF4444' }, darkMode && scss.summaryValueDark]}>₹{balance.toLocaleString()}</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[scss.searchRow, darkMode && scss.searchRowDark]}>
          <Ionicons name="search" size={18} color={darkMode ? '#6B7280' : '#A3A3A3'} style={{ marginLeft: 8, marginRight: 4 }} />
          <TextInput
            style={[scss.searchInput, darkMode && scss.searchInputDark]}
            placeholder={t('finance.searchTransactions')}
            placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Pending Payments */}
        <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('finance.pendingPayments')}</Text>
        <View style={[scss.emptyBox, darkMode && scss.emptyBoxDark]}>
          <Text style={[scss.emptyText, darkMode && scss.emptyTextDark]}>{t('finance.noPendingPayments')}</Text>
        </View>

        {/* Cleared Payments */}
        <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('finance.clearedPayments')}</Text>
        <View style={[scss.emptyBox, darkMode && scss.emptyBoxDark]}>
          <Text style={[scss.emptyText, darkMode && scss.emptyTextDark]}>{t('finance.noClearedPayments')}</Text>
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
    sectionTitleDark: {
      color: '#F3F4F6',
    },
    emptyBox: {
      backgroundColor: '#fff',
      borderRadius: 10,
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    emptyBoxDark: {
      backgroundColor: '#374151',
      borderColor: '#4B5563',
    },
    emptyText: {
      color: '#6B7280',
      fontSize: 15,
      textAlign: 'center',
    },
    emptyTextDark: {
      color: '#D1D5DB',
    },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 16,
    paddingBottom: 120,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ECE6F9',
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 16,
    alignSelf: 'center',
    width: '95%',
    padding: 6,
  },
  toggleRowDark: {
    backgroundColor: '#374151',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnDark: {
    backgroundColor: '#4B5563',
  },
  toggleBtnActive: {
    backgroundColor: '#fff',
    shadowColor: '#A855F7',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  toggleBtnText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 17,
  },
  toggleBtnTextDark: {
    color: '#D1D5DB',
  },
  toggleBtnTextActive: {
    color: '#111827',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
    marginRight: 2,
  },
  dateFilterWrapper: {
    marginBottom: 16,
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
  dateFilterText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateFilterTextDark: {
    color: '#9CA3AF',
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateBtnDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  dateBtnText: {
    color: '#7C3AED',
    fontWeight: '500',
    fontSize: 14,
    marginHorizontal: 6,
  },
  dateBtnTextDark: {
    color: '#9CA3AF',
  },
  datePickerDropdown: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    padding: 12,
    marginTop: 8,
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
    borderBottomColor: '#374151',
  },
  quickFilterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  quickFilterOptionDark: {
    backgroundColor: '#374151',
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
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  // summaryRow defined above, remove duplicate
  totalSalesCard: {
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    marginTop: 12,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    alignItems: 'center',
  },
  totalSalesCardDark: {
    backgroundColor: '#5B21B6',
  },
  totalSalesLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  totalSalesLabelDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  totalSalesValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  totalSalesValueDark: {
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  summaryCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  summaryLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryLabelDark: {
    color: '#D1D5DB',
  },
  summaryValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
  },
  summaryValueDark: {
    color: '#F3F4F6',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 18,
    marginTop: 2,
    paddingHorizontal: 4,
    height: 40,
  },
  searchRowDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  searchInputDark: {
    color: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
});

export default FinanceScreen;

