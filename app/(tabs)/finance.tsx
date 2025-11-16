
import HeaderBar from '@/components/HeaderBar';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FinanceScreenProps {
  activeTab?: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress?: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ activeTab, onTabPress }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [tab, setTab] = useState<'income' | 'expenses'>('income');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const notificationCount = 4;

  // Show settings screen
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <>
      <HeaderBar 
        title={t('nav.finance')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onNotificationPress={() => console.log('Notifications pressed')}
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

        {/* Date Range Dropdown */}
        <View style={scss.dateRow}>
          <TouchableOpacity style={[scss.dateBtn, darkMode && scss.dateBtnDark]}>
            <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
            <Text style={[scss.dateBtnText, darkMode && scss.dateBtnTextDark]}>{dateRange}</Text>
            <Ionicons name="chevron-down" size={16} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={scss.summaryRow}>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>{t('dashboard.totalSales')}</Text>
            <Text style={[scss.summaryValue, darkMode && scss.summaryValueDark]}>Rs. 0</Text>
          </View>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>{t('dashboard.received')}</Text>
            <Text style={[scss.summaryValue, { color: '#16A34A' }, darkMode && scss.summaryValueDark]}>Rs. 0</Text>
          </View>
          <View style={[scss.summaryCard, darkMode && scss.summaryCardDark]}>
            <Text style={[scss.summaryLabel, darkMode && scss.summaryLabelDark]}>{t('finance.balance')}</Text>
            <Text style={[scss.summaryValue, { color: '#EF4444' }, darkMode && scss.summaryValueDark]}>Rs. 0</Text>
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
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#ECE6F9',
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 12,
    alignSelf: 'center',
    width: '95%',
    padding: 4,
  },
  toggleRowDark: {
    backgroundColor: '#374151',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
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
    color: '#7C3AED',
    fontWeight: '600',
    fontSize: 15,
  },
  toggleBtnTextDark: {
    color: '#D1D5DB',
  },
  toggleBtnTextActive: {
    color: '#7C3AED',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginRight: 2,
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
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 6,
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
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    marginBottom: 8,
  },
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
});

export default FinanceScreen;
