import HeaderBar from '@/components/HeaderBar';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
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

interface OrdersScreenProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'customers') => void;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ activeTab, onTabPress }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showSettings, setShowSettings] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const notificationCount = 4;

  const statusOptions = ['All', 'Active', 'Order Placed', 'Composing', 'Proofreading', 'Printing', 'Ready to Deliver', 'Delivered', 'Cancelled'];

  // Dummy orders data
  const dummyOrders: Order[] = [
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
      attachments: {
        sample: 'View',
        orderForm: 'View (1)',
        voiceNote: 'None',
      },
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
      attachments: {
        sample: 'None',
        orderForm: 'View (2)',
        voiceNote: 'None',
      },
    },
  ];

  const orderFilters = ['All', 'Composing', 'Proofreading', 'Printing'];

  // Filter orders based on selected filter, status, and search query
  const filteredOrders = dummyOrders.filter((order) => {
    const matchesFilter = selectedFilter === 'All' || order.status.includes(selectedFilter);
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesStatus && matchesSearch;
  });

  // Show settings screen
  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      {/* Header Bar */}
      <HeaderBar
        title={t('nav.orders')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
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
                darkMode && scss.filterTabDark,
                selectedFilter === filter && scss.filterTabActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                scss.filterTabText,
                darkMode && selectedFilter !== filter && scss.filterTabTextDark,
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
            <Ionicons name="funnel" size={20} color="#7C3AED" />
          </TouchableOpacity>
        </View>

        {/* Status Filter Dropdown */}
        {showStatusFilter && (
          <View style={[scss.filterDropdown, darkMode && scss.filterDropdownDark]}>
            <Text style={[scss.filterDropdownTitle, darkMode && scss.filterDropdownTitleDark]}>{t('orders.filterByStatus')}</Text>
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
                  <Text style={scss.filterOptionText}>{status}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search Bar */}
        <View style={[scss.searchContainer, darkMode && scss.searchContainerDark]}>
          <Ionicons name="search" size={18} color={darkMode ? '#9CA3AF' : '#6B7280'} style={scss.searchIcon} />
          <TextInput
            style={[scss.searchInput, darkMode && scss.searchInputDark]}
            placeholder="Search by name, phone, order ID..."
            placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={darkMode ? '#9CA3AF' : '#9CA3AF'} />
            </TouchableOpacity>
          )}
        </View>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <View style={scss.emptyContainer}>
            <Ionicons name="document-outline" size={64} color={darkMode ? '#6B7280' : '#D1D5DB'} />
            <Text style={[scss.emptyTitle, darkMode && scss.emptyTitleDark]}>{t('orders.noOrdersFound')}</Text>
            <Text style={[scss.emptySubtitle, darkMode && scss.emptySubtitleDark]}>
              {selectedFilter === 'All' 
                ? t('orders.createFirstOrder')
                : t('orders.noOrdersInStage')
              }
            </Text>
          </View>
        ) : (
          filteredOrders.map((order) => (
            <View key={order.id}>
              <View style={[scss.orderCard, darkMode && scss.orderCardDark]}>
                {/* Order Header */}
                <View style={scss.orderHeader}>
                  <View style={scss.orderHeaderLeft}>
                    <Text style={[scss.customerName, darkMode && scss.customerNameDark]}>{order.customerName}</Text>
                    <View style={scss.productBadge}>
                      <Text style={scss.productBadgeText}>{order.productType}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={scss.statusDropdown}>
                    <Text style={scss.statusText}>{order.status}</Text>
                    <Ionicons name="chevron-down" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Order Details */}
                <View style={scss.orderDetails}>
                  <View style={scss.detailRow}>
                    <Text style={[scss.detailLabel, darkMode && scss.detailLabelDark]}>Delivery: </Text>
                    <Text style={[scss.detailValue, darkMode && scss.detailValueDark]}>{order.delivery}</Text>
                  </View>

                  {order.designVersions !== undefined && (
                    <View style={scss.detailRow}>
                      <Text style={[scss.detailLabel, darkMode && scss.detailLabelDark]}>Design versions </Text>
                      <Text style={[scss.detailValue, darkMode && scss.detailValueDark]}>({order.designVersions})</Text>
                    </View>
                  )}

                  <View style={scss.detailRow}>
                    <Text style={[scss.detailLabel, darkMode && scss.detailLabelDark]}>Amount- </Text>
                    <Text style={[scss.detailValueAmount, darkMode && scss.detailValueDark]}>Rs. {order.amount.toLocaleString()}</Text>
                  </View>

                  <View style={scss.detailRow}>
                    <Text style={[scss.detailLabel, darkMode && scss.detailLabelDark]}>Pending- </Text>
                    <Text style={[scss.detailValuePending, darkMode && scss.detailValueDark]}>Rs. {order.pending.toLocaleString()}</Text>
                  </View>
                </View>

                {/* Order Actions */}
                <View style={scss.orderActions}>
                  <TouchableOpacity style={scss.actionButton}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                  <TouchableOpacity style={scss.actionButton}>
                    <Ionicons name="pencil-outline" size={18} color="#7C3AED" />
                  </TouchableOpacity>
                </View>

                {/* Show Order Details Link */}
                <TouchableOpacity 
                  style={scss.showDetailsButton}
                  onPress={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <Text style={scss.showDetailsText}>Show Order Details</Text>
                  <Ionicons 
                    name={expandedOrderId === order.id ? "chevron-up" : "chevron-down"} 
                    size={16} 
                    color="#7C3AED" 
                  />
                </TouchableOpacity>
              </View>

              {/* Expanded Order Details */}
              {expandedOrderId === order.id && (
                <View style={[scss.expandedDetailsContainer, darkMode && scss.expandedDetailsContainerDark]}>
                  {/* Customer Details */}
                  <View style={scss.detailsSection}>
                    <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Customer Details</Text>
                    <View style={scss.detailsGrid}>
                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="list" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Order ID</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.id}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="calendar" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Order Placed</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.orderPlaced || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="person" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Name</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.customerName}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="person" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Type</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.customerType || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="call" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Contact Number</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.contact || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="logo-whatsapp" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>WhatsApp</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.whatsapp || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Attachments */}
                  <View style={[scss.detailsSection, scss.detailsSectionBorder]}>
                    <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Attachments</Text>
                    <View style={scss.attachmentsGrid}>
                      <View style={scss.attachmentItem}>
                        <Ionicons name="attach" size={18} color="#7C3AED" style={scss.attachmentIcon} />
                        <View style={scss.attachmentContent}>
                          <Text style={[scss.attachmentLabel, darkMode && scss.attachmentLabelDark]}>Sample</Text>
                          <TouchableOpacity>
                            <Text style={scss.attachmentLink}>{order.attachments?.sample || 'None'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={scss.attachmentItem}>
                        <Ionicons name="document" size={18} color="#7C3AED" style={scss.attachmentIcon} />
                        <View style={scss.attachmentContent}>
                          <Text style={[scss.attachmentLabel, darkMode && scss.attachmentLabelDark]}>Order Form</Text>
                          <TouchableOpacity>
                            <Text style={scss.attachmentLink}>{order.attachments?.orderForm || 'None'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={scss.attachmentItem}>
                        <Ionicons name="mic" size={18} color="#7C3AED" style={scss.attachmentIcon} />
                        <View style={scss.attachmentContent}>
                          <Text style={[scss.attachmentLabel, darkMode && scss.attachmentLabelDark]}>Voice Note</Text>
                          <TouchableOpacity>
                            <Text style={scss.attachmentLink}>{order.attachments?.voiceNote || 'None'}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Material & Printing */}
                  <View style={[scss.detailsSection, scss.detailsSectionBorder]}>
                    <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Material & Printing</Text>
                    <View style={scss.detailsGrid}>
                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="cube" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Material</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.material || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="layers" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Quantity</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.quantity || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="print" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Printing Type</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.printingType || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="color-palette" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Ink Color</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.inkColor || 'N/A'}</Text>
                      </View>

                      <View style={scss.gridItem}>
                        <View style={scss.gridItemHeader}>
                          <Ionicons name="calendar" size={16} color="#7C3AED" />
                          <Text style={[scss.gridLabel, darkMode && scss.gridLabelDark]}>Delivery Date</Text>
                        </View>
                        <Text style={[scss.gridValue, darkMode && scss.gridValueDark]}>{order.deliveryDate || 'N/A'}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Financial Details */}
                  <View style={scss.detailsSection}>
                    <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Financial Details</Text>
                    <View style={scss.financialGrid}>
                      <View style={scss.financialItem}>
                        <View style={scss.financialItemLeft}>
                          <Ionicons name="cash" size={16} color="#7C3AED" />
                          <Text style={[scss.financialLabel, darkMode && scss.financialLabelDark]}>Total Amount</Text>
                        </View>
                        <Text style={[scss.financialValue, darkMode && scss.financialValueDark]}>{order.amount.toLocaleString()}</Text>
                      </View>

                      <View style={scss.financialItem}>
                        <View style={scss.financialItemLeft}>
                          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                          <Text style={[scss.financialLabel, darkMode && scss.financialLabelDark]}>Advance Paid</Text>
                        </View>
                        <Text style={[scss.financialValueSuccess, darkMode && scss.financialValueDark]}>{(order.advancePaid || 0).toLocaleString()}</Text>
                      </View>

                      <View style={scss.financialItem}>
                        <View style={scss.financialItemLeft}>
                          <Ionicons name="alert-circle" size={16} color="#DC2626" />
                          <Text style={[scss.financialLabel, darkMode && scss.financialLabelDark]}>Balance Due</Text>
                        </View>
                        <Text style={[scss.financialValueDanger, darkMode && scss.financialValueDark]}>{order.pending.toLocaleString()}</Text>
                      </View>
                    </View>

                    {/* Show Less Button */}
                    <TouchableOpacity 
                      style={scss.showLessButton}
                      onPress={() => setExpandedOrderId(null)}
                    >
                      <Text style={scss.showLessText}>Show Less</Text>
                      <Ionicons name="chevron-up" size={16} color="#7C3AED" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Add New Order Button */}
      <View style={scss.fabContainer}>
        <TouchableOpacity style={scss.fabButton}>
          <Ionicons name="add-circle" size={22} color="#fff" style={scss.fabIcon} />
          <Text style={scss.fabButtonText}>{t('dashboard.addNewOrder')}</Text>
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
  safeAreaDark: {
    backgroundColor: '#1F2937',
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
  filterTabDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
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
  filterTabTextDark: {
    color: '#E5E7EB',
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
  searchContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
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
  searchInputDark: {
    color: '#E5E7EB',
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
  emptyTitleDark: {
    color: '#E5E7EB',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptySubtitleDark: {
    color: '#D1D5DB',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  customerNameDark: {
    color: '#F3F4F6',
  },
  productBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  productBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  statusDropdown: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  orderDetails: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailLabelDark: {
    color: '#D1D5DB',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  detailValueDark: {
    color: '#D1D5DB',
  },
  detailValueAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  detailValuePending: {
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
  orderActions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showDetailsButton: {
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  showDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
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
  filterDropdownDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  filterDropdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterDropdownTitleDark: {
    color: '#F3F4F6',
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionDark: {
    borderBottomColor: '#4B5563',
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
  radioUnselectedDark: {
    borderColor: '#6B7280',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterOptionTextDark: {
    color: '#D1D5DB',
  },
  filterOptionTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  expandedDetailsContainer: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    marginTop: -16,
  },
  expandedDetailsContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailsSectionBorder: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionTitleDark: {
    color: '#F3F4F6',
  },
  detailsGrid: {
    flexDirection: 'column',
  },
  gridItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  gridItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  gridLabelDark: {
    color: '#D1D5DB',
  },
  gridValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 24,
  },
  gridValueDark: {
    color: '#F3F4F6',
  },
  gridValuePending: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 24,
  },
  attachmentsGrid: {
    flexDirection: 'column',
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  attachmentIcon: {
    marginRight: 12,
  },
  attachmentContent: {
    flex: 1,
  },
  attachmentLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  attachmentLabelDark: {
    color: '#D1D5DB',
  },
  attachmentLink: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
  financialGrid: {
    flexDirection: 'column',
  },
  financialItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  financialItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  financialLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  financialLabelDark: {
    color: '#D1D5DB',
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  financialValueSuccess: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  financialValueDanger: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  financialValueDark: {
    color: '#F3F4F6',
  },
  showLessButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  showLessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7C3AED',
  },
});

export default OrdersScreen;