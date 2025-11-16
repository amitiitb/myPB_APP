
import HeaderBar from '@/components/HeaderBar';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface FinanceScreenProps {
  activeTab?: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress?: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const FinanceScreen: React.FC<FinanceScreenProps> = ({ activeTab, onTabPress }) => {
  const [tab, setTab] = useState<'income' | 'expenses'>('income');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const notificationCount = 4;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <>
      <HeaderBar 
        title="Finance" 
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={toggleLanguage}
        onNotificationPress={() => console.log('Notifications pressed')}
        onSettingsPress={() => setShowSettings(true)}
      />
      <View style={scss.container}>
        <ScrollView contentContainerStyle={scss.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Income/Expenses Toggle */}
        <View style={scss.toggleRow}>
          <TouchableOpacity style={[scss.toggleBtn, tab === 'income' && scss.toggleBtnActive]} onPress={() => setTab('income')}>
            <Text style={[scss.toggleBtnText, tab === 'income' && scss.toggleBtnTextActive]}>Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[scss.toggleBtn, tab === 'expenses' && scss.toggleBtnActive]} onPress={() => setTab('expenses')}>
            <Text style={[scss.toggleBtnText, tab === 'expenses' && scss.toggleBtnTextActive]}>Expenses</Text>
          </TouchableOpacity>
        </View>

        {/* Date Range Dropdown */}
        <View style={scss.dateRow}>
          <TouchableOpacity style={scss.dateBtn}>
            <Ionicons name="calendar-outline" size={18} color="#7C3AED" />
            <Text style={scss.dateBtnText}>{dateRange}</Text>
            <Ionicons name="chevron-down" size={16} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Summary Cards */}
        <View style={scss.summaryRow}>
          <View style={scss.summaryCard}>
            <Text style={scss.summaryLabel}>Total Sales</Text>
            <Text style={scss.summaryValue}>Rs. 0</Text>
          </View>
          <View style={scss.summaryCard}>
            <Text style={scss.summaryLabel}>Received</Text>
            <Text style={[scss.summaryValue, { color: '#16A34A' }]}>Rs. 0</Text>
          </View>
          <View style={scss.summaryCard}>
            <Text style={scss.summaryLabel}>Balance</Text>
            <Text style={[scss.summaryValue, { color: '#EF4444' }]}>Rs. 0</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={scss.searchRow}>
          <Ionicons name="search" size={18} color="#A3A3A3" style={{ marginLeft: 8, marginRight: 4 }} />
          <TextInput
            style={scss.searchInput}
            placeholder="Search customers by name or phone..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Pending Payments */}
        <Text style={scss.sectionTitle}>Pending Payments</Text>
        <View style={scss.emptyBox}>
          <Text style={scss.emptyText}>No pending payments. Great job!</Text>
        </View>

        {/* Cleared Payments */}
        <Text style={scss.sectionTitle}>Cleared Payments</Text>
        <View style={scss.emptyBox}>
          <Text style={scss.emptyText}>No cleared payments yet.</Text>
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
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  dateBtnText: {
    color: '#7C3AED',
    fontWeight: '500',
    fontSize: 14,
    marginHorizontal: 6,
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
  summaryLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  summaryValue: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
    paddingHorizontal: 6,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 10,
    marginBottom: 8,
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
  emptyText: {
    color: '#6B7280',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default FinanceScreen;
