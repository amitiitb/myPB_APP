import AddOrderStep1 from '@/components/AddOrderStep1';
import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
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
import CustomersScreen from './(tabs)/customers';
import FinanceScreen from './(tabs)/finance';
import InventoryScreen from './(tabs)/inventory';
import OrdersScreen from './(tabs)/orders';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'finance' | 'inventory' | 'customers'>('home');
  const [showAddOrder, setShowAddOrder] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const notificationCount = 4;

  // Show settings screen
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
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
  } else if (activeTab === 'customers') {
    mainContent = (
      <>
        <CustomersScreen />
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
            <TouchableOpacity style={[scss.dateFilterBtn, darkMode && scss.dateFilterBtnDark]}>
              <Ionicons name="calendar-outline" size={16} color={darkMode ? '#9CA3AF' : '#6B7280'} style={{ marginRight: 6 }} />
              <Text style={[scss.dateFilterText, darkMode && scss.dateFilterTextDark]}>{dateFilter}</Text>
            </TouchableOpacity>
          </View>
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
            {/* Card 4: Total Customers */}
            <TouchableOpacity
              style={[scss.reportCard, darkMode && scss.reportCardDark]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('customers')}
            >
              <Text style={[scss.reportBigNum, { color: '#EF4444' }]}>5</Text>
              <Text style={[scss.reportCardTitle, darkMode && scss.reportCardTitleDark]}>{t('dashboard.totalCustomers')}</Text>
              <View style={scss.reportSubRow}><Ionicons name="person-add-outline" size={16} color="#10B981" style={{ marginRight: 4 }} /><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.new')}:</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
              <View style={scss.reportSubRow}><Ionicons name="repeat-outline" size={16} color="#7C3AED" style={{ marginRight: 4 }} /><Text style={[scss.reportSubLabelSmall, darkMode && scss.reportSubLabelDark]}>{t('dashboard.repeated')}:</Text><Text style={[scss.reportSubValueSmall, darkMode && scss.reportSubValueDark]}>0</Text></View>
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
      {activeTab === 'orders' || activeTab === 'finance' || activeTab === 'inventory' || activeTab === 'customers' ? (
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
              onNotificationPress={() => console.log('Notifications pressed')}
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
