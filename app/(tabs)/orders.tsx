import HeaderBar from '@/components/HeaderBar';
import SettingsScreen from '@/components/SettingsScreen';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface OrdersScreenProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ activeTab, onTabPress }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const notificationCount = 4;

  const statusOptions = ['All', 'Active', 'Order Placed', 'Composing', 'Proofreading', 'Printing', 'Ready to Deliver', 'Delivered', 'Cancelled'];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  // Show settings screen
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  const orderFilters = ['All', 'Composing', 'Proofreading', 'Printing'];

  return (
    <SafeAreaView style={scss.safeArea}>
      {/* Header Bar */}
      <HeaderBar
        title="Orders"
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={toggleLanguage}
        onNotificationPress={() => console.log('Notifications pressed')}
        onSettingsPress={() => setShowSettings(true)}
      />

      <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <View style={scss.filterContainer}>
          {orderFilters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                scss.filterTab,
                selectedFilter === filter && scss.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                scss.filterTabText,
                selectedFilter === filter && scss.filterTabTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity 
            style={scss.filterIcon}
            onPress={() => setShowStatusFilter(!showStatusFilter)}
          >
            <Ionicons name="filter" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Status Filter Dropdown */}
        {showStatusFilter && (
          <View style={scss.filterDropdown}>
            <Text style={scss.filterDropdownTitle}>Filter by Status</Text>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={scss.filterOption}
                onPress={() => {
                  setSelectedStatus(status);
                  setShowStatusFilter(false);
                }}
              >
                <View style={scss.filterOptionContent}>
                  {selectedStatus === status && (
                    <View style={scss.radioSelected} />
                  )}
                  {selectedStatus !== status && (
                    <View style={scss.radioUnselected} />
                  )}
                  <Text style={[
                    scss.filterOptionText,
                    selectedStatus === status && scss.filterOptionTextActive
                  ]}>
                    {status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View style={scss.searchContainer}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" style={scss.searchIcon} />
          <TextInput
            style={scss.searchInput}
            placeholder="Search by name, phone, order ID..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* No Orders Found */}
        <View style={scss.emptyContainer}>
          <Ionicons name="document-outline" size={64} color="#D1D5DB" />
          <Text style={scss.emptyTitle}>No orders found.</Text>
          <Text style={scss.emptySubtitle}>
            {selectedFilter === 'All' 
              ? 'Create your first order to get started!'
              : `No orders in ${selectedFilter.toLowerCase()} stage.`
            }
          </Text>
        </View>
      </ScrollView>

      {/* Floating Add New Order Button */}
      <View style={scss.fabContainer}>
        <TouchableOpacity style={scss.fabButton}>
          <Ionicons name="add" size={22} color="#fff" style={scss.fabIcon} />
          <Text style={scss.fabButtonText}>Add New Order</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const scss = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 120,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterTabActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterIcon: {
    padding: 8,
    marginLeft: 'auto',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    paddingVertical: 0,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
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
  filterDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  filterDropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#7C3AED',
    marginRight: 12,
  },
  radioUnselected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 12,
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
});

export default OrdersScreen;