import FooterNav from '@/components/FooterNav';
import HeaderBar from '@/components/HeaderBar';
import NotificationsScreen from '@/components/NotificationsScreen';
import SettingsScreen from '@/components/SettingsScreen';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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
  assignedTo?: string; // Name of assigned team member
  assignedRole?: string; // Role of assigned person (composer, operator, etc.)
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
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  pressName?: string;
  owners?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
  composers?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
  operators?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ activeTab, onTabPress, ownerName, ownerPhone, ownerWhatsapp, pressName, owners = [], composers: composersProp = [], operators: operatorsProp = [] }) => {
  const { darkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const params = useLocalSearchParams<{ filterStatus?: string }>();
  
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(() => {
    // Initialize with filter status from params if available
    return params.filterStatus || 'All';
  });
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusDropdownOrderId, setStatusDropdownOrderId] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Order>>({});
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentOrderId, setAssignmentOrderId] = useState<string | null>(null);
  const [assignmentRole, setAssignmentRole] = useState<string>('');
  const [showCreateTeamMember, setShowCreateTeamMember] = useState(false);
  const [newTeamMemberName, setNewTeamMemberName] = useState('');
  const [newTeamMemberPhone, setNewTeamMemberPhone] = useState('');
  const [newTeamMemberErrors, setNewTeamMemberErrors] = useState<{ name?: string; phone?: string }>({});
  const [composers, setComposers] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Raj Kumar' },
    { id: '2', name: 'Priya Singh' },
    { id: '3', name: 'Vikram Patel' },
  ]);

  // Update selected status if filter param changes
  useEffect(() => {
    if (params.filterStatus) {
      setSelectedStatus(params.filterStatus);
    }
  }, [params.filterStatus]);
  const [operators, setOperators] = useState<{ id: string; name: string }[]>([
    { id: '1', name: 'Amit Sharma' },
    { id: '2', name: 'Bhavna Gupta' },
    { id: '3', name: 'Suresh Kumar' },
  ]);
  const notificationCount = 4;

  const statusOptions = ['Order Placed', 'Composing', 'Proofreading', 'Printing', 'Ready to Deliver', 'Delivered'];

  // Initialize dummy orders
  React.useEffect(() => {
    setOrders([
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
        attachments: {
          sample: 'View',
          orderForm: 'View (1)',
          voiceNote: 'View',
        },
      },
    ]);
  }, []);

  const orderFilters = [t('orders.all'), t('orders.composing'), t('orders.proofreading'), t('orders.printing')];

  // Filter orders based on selected filter, status, and search query
  const filteredOrders = orders.filter((order) => {
    const matchesFilter = selectedFilter === 'All' || order.status.includes(selectedFilter);
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contact?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesStatus && matchesSearch;
  });

  // Update order status
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setStatusDropdownOrderId(null);
    
    // Show assignment modal for specific statuses
    if (newStatus === 'Composing') {
      setAssignmentOrderId(orderId);
      setAssignmentRole('composer');
      setShowAssignmentModal(true);
    } else if (newStatus === 'Printing') {
      setAssignmentOrderId(orderId);
      setAssignmentRole('operator');
      setShowAssignmentModal(true);
    }
  };

  // Open edit modal
  const openEditModal = (order: Order) => {
    setEditingOrderId(order.id);
    setEditFormData({ ...order });
  };

  // Close edit modal
  const closeEditModal = () => {
    setEditingOrderId(null);
    setEditFormData({});
  };

  // Save edited order
  const saveEditedOrder = () => {
    if (editingOrderId && editFormData) {
      setOrders(orders.map(order =>
        order.id === editingOrderId 
          ? { ...order, ...editFormData }
          : order
      ));
      closeEditModal();
      Alert.alert('Success', 'Order updated successfully');
    }
  };

  // Assign order to team member
  const assignTeamMember = (memberId: string, memberName: string) => {
    if (assignmentOrderId) {
      setOrders(orders.map(order =>
        order.id === assignmentOrderId
          ? { 
              ...order, 
              assignedTo: memberName,
              assignedRole: assignmentRole
            }
          : order
      ));
      setShowAssignmentModal(false);
      setAssignmentOrderId(null);
      setAssignmentRole('');
      Alert.alert('Success', `Order assigned to ${memberName}`);
    }
  };

  // Create new team member
  const createNewTeamMember = () => {
    const errors: { name?: string; phone?: string } = {};
    
    if (!newTeamMemberName.trim()) {
      errors.name = 'Name is required';
    }
    if (!newTeamMemberPhone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(newTeamMemberPhone.replace(/\s+/g, ''))) {
      errors.phone = 'Phone number must be 10 digits';
    }

    if (Object.keys(errors).length > 0) {
      setNewTeamMemberErrors(errors);
      return;
    }

    const newId = String(Date.now());
    const newMember = {
      id: newId,
      name: newTeamMemberName,
    };

    if (assignmentRole === 'composer') {
      setComposers([...composers, newMember]);
    } else if (assignmentRole === 'operator') {
      setOperators([...operators, newMember]);
    }

    // Auto-assign to the newly created member
    assignTeamMember(newId, newTeamMemberName);
    
    // Reset form
    setNewTeamMemberName('');
    setNewTeamMemberPhone('');
    setNewTeamMemberErrors({});
    setShowCreateTeamMember(false);
  };

  // Show settings screen
  if (showSettings) {
    return (
      <>
        <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
          <SettingsScreen 
            onBack={() => setShowSettings(false)} 
            ownerName={ownerName}
            ownerPhone={ownerPhone}
            ownerWhatsapp={ownerWhatsapp}
            pressName={pressName}
            owners={owners}
            composers={composersProp.length > 0 ? composersProp : composers.map(c => ({ ...c, mobile: '', whatsapp: '', role: 'Composer' }))}
            operators={operatorsProp.length > 0 ? operatorsProp : operators.map(o => ({ ...o, mobile: '', whatsapp: '', role: 'Operator' }))}
          />
        </SafeAreaView>
        <FooterNav activeTab={activeTab} onTabPress={(tab) => { setShowSettings(false); onTabPress(tab); }} />
      </>
    );
  }

  // Show notifications screen
  if (showNotifications) {
    const handleTabPress = (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => {
      if (tab === 'orders') {
        setShowNotifications(false);
        // Do not call onTabPress('orders') to avoid unnecessary rerender, just close notifications
      } else {
        setShowNotifications(false);
        onTabPress(tab);
      }
    };
    return (
      <>
        <NotificationsScreen 
          onBack={() => setShowNotifications(false)} 
          activeTab={activeTab} 
          onTabPress={handleTabPress}
        />
        <FooterNav 
          activeTab={activeTab} 
          onTabPress={handleTabPress}
        />
      </>
    );
  }

  return (
    <>
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      {/* Header Bar */}
      <HeaderBar
        title={t('nav.orders')}
        notificationCount={notificationCount}
        language={language}
        onLanguageToggle={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        onNotificationPress={() => setShowNotifications(true)}
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
              <TouchableOpacity 
                style={[scss.orderCard, darkMode && scss.orderCardDark]}
                onPress={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                activeOpacity={0.7}
              >
                {/* Time and Order ID */}
                <Text style={[scss.orderTime, darkMode && scss.orderTimeDark]}>
                  {order.orderPlaced}
                </Text>

                {/* Customer Name */}
                <Text style={[scss.orderCustomerName, darkMode && scss.orderCustomerNameDark]}>
                  {order.customerName}
                </Text>

                {/* Status Badges Row */}
                <View style={scss.statusBadgesRow}>
                  <View style={[scss.statusBadge, { backgroundColor: '#F59E0B20' }]}>
                    <Text style={[scss.statusBadgeText, { color: '#F59E0B' }]}>
                      {order.status === 'Order Placed' ? '🟠' : ''} {order.status}
                    </Text>
                  </View>
                  {order.pending > 0 && (
                    <View style={[scss.statusBadge, { backgroundColor: '#EF444420' }]}>
                      <Text style={[scss.statusBadgeText, { color: '#EF4444' }]}>
                        Unfulfilled
                      </Text>
                    </View>
                  )}
                  {order.pending === 0 && (
                    <View style={[scss.statusBadge, { backgroundColor: '#10B98120' }]}>
                      <Text style={[scss.statusBadgeText, { color: '#10B981' }]}>
                        ✓ Fulfilled
                      </Text>
                    </View>
                  )}
                </View>

                {/* Amount and Item Count Row */}
                <View style={scss.footerRow}>
                  <Text style={[scss.orderAmount, darkMode && scss.orderAmountDark]}>
                    ${order.amount}
                  </Text>
                  <Text style={[scss.itemCount, darkMode && scss.itemCountDark]}>
                    {order.quantity || 1} item
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Show Details Link */}
              <TouchableOpacity 
                style={scss.showDetailsLink}
                onPress={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
              >
                <Text style={scss.showDetailsLinkText}>
                  {expandedOrderId === order.id ? t('orders.hideOrderDetails') : t('orders.showOrderDetails')}
                </Text>
                <Ionicons 
                  name={expandedOrderId === order.id ? "chevron-up" : "chevron-down"} 
                  size={14} 
                  color="#7C3AED" 
                />
              </TouchableOpacity>

              {/* Expanded Order Details */}
              {expandedOrderId === order.id && (
                <View style={[scss.expandedContainer, darkMode && scss.expandedContainerDark]}>
                  {/* Compact Grid Layout */}
                  <View style={scss.compactGrid}>
                    {/* Row 1 */}
                    <View style={scss.compactRow}>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Order ID</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.id}</Text>
                      </View>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Order Placed</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.orderPlaced || 'N/A'}</Text>
                      </View>
                    </View>

                    {/* Row 2 */}
                    <View style={scss.compactRow}>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Contact</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.contact || 'N/A'}</Text>
                      </View>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Advance Paid</Text>
                        <Text style={[scss.compactValueSuccess]}>
                          Rs. {order.advancePaid?.toLocaleString() || '0'}
                        </Text>
                      </View>
                    </View>

                    {/* Row 3 */}
                    <View style={scss.compactRow}>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Material</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.material || 'N/A'}</Text>
                      </View>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Quantity</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.quantity || 'N/A'}</Text>
                      </View>
                    </View>

                    {/* Row 4 */}
                    <View style={scss.compactRow}>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Printing Type</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.printingType || 'N/A'}</Text>
                      </View>
                      <View style={scss.compactItem}>
                        <Text style={[scss.compactLabel, darkMode && scss.compactLabelDark]}>Ink Color</Text>
                        <Text style={[scss.compactValue, darkMode && scss.compactValueDark]}>{order.inkColor || 'N/A'}</Text>
                      </View>
                    </View>
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

      {/* Edit Order Modal */}
      {editingOrderId && (
        <View style={scss.modalOverlay}>
          <View style={[scss.modalContent, darkMode && scss.modalContentDark]}>
            <View style={scss.modalHeader}>
              <Text style={[scss.modalTitle, darkMode && scss.modalTitleDark]}>Edit Order</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <Ionicons name="close" size={24} color={darkMode ? '#E5E7EB' : '#111827'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={scss.modalBody}>
              {/* Customer Name */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Customer Name</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.customerName || ''}
                  onChangeText={(text) => setEditFormData({ ...editFormData, customerName: text })}
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>

              {/* Product Type */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Product Type</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.productType || ''}
                  onChangeText={(text) => setEditFormData({ ...editFormData, productType: text })}
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>

              {/* Delivery Date */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Delivery Date</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.delivery || ''}
                  onChangeText={(text) => setEditFormData({ ...editFormData, delivery: text })}
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>

              {/* Amount */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Amount</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.amount?.toString() || ''}
                  onChangeText={(text) => setEditFormData({ ...editFormData, amount: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>

              {/* Pending Amount */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Pending Amount</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.pending?.toString() || ''}
                  onChangeText={(text) => setEditFormData({ ...editFormData, pending: parseInt(text) || 0 })}
                  keyboardType="numeric"
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>

              {/* Contact Number */}
              <View style={scss.modalFieldContainer}>
                <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Contact Number</Text>
                <TextInput
                  style={[scss.modalInput, darkMode && scss.modalInputDark]}
                  value={editFormData.contact || ''}
                  onChangeText={(text) => {
                    const digitsOnly = text.replace(/\D/g, '');
                    setEditFormData({ ...editFormData, contact: digitsOnly });
                  }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholder="10 digit number"
                  placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={scss.modalActions}>
              <TouchableOpacity 
                style={[scss.modalButton, scss.modalButtonCancel]}
                onPress={closeEditModal}
              >
                <Text style={scss.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[scss.modalButton, scss.modalButtonSave]}
                onPress={saveEditedOrder}
              >
                <Text style={scss.modalButtonSaveText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <View style={scss.modalOverlay}>
          <View style={[scss.modalContent, darkMode && scss.modalContentDark]}>
            <View style={scss.modalHeader}>
              <Text style={[scss.modalTitle, darkMode && scss.modalTitleDark]}>
                {!showCreateTeamMember 
                  ? (assignmentRole === 'composer' ? 'Assign to Composer' : 'Assign to Operator')
                  : (assignmentRole === 'composer' ? 'Add New Composer' : 'Add New Operator')
                }
              </Text>
              <TouchableOpacity onPress={() => {
                if (showCreateTeamMember) {
                  setShowCreateTeamMember(false);
                  setNewTeamMemberName('');
                  setNewTeamMemberPhone('');
                  setNewTeamMemberErrors({});
                } else {
                  setShowAssignmentModal(false);
                }
              }}>
                <Ionicons name="close" size={24} color={darkMode ? '#E5E7EB' : '#111827'} />
              </TouchableOpacity>
            </View>

            <ScrollView style={scss.modalBody}>
              {!showCreateTeamMember ? (
                <>
                  {assignmentRole === 'composer' && (
                    <>
                      <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark, { marginBottom: 12 }]}>
                        Select a Composer
                      </Text>
                      {composers.map((composer) => (
                        <TouchableOpacity
                          key={composer.id}
                          style={[scss.assignmentOption, darkMode && scss.assignmentOptionDark]}
                          onPress={() => assignTeamMember(composer.id, composer.name)}
                        >
                          <Ionicons name="person-circle" size={32} color="#7C3AED" style={{ marginRight: 12 }} />
                          <View>
                            <Text style={[scss.assignmentName, darkMode && scss.assignmentNameDark]}>
                              {composer.name}
                            </Text>
                            <Text style={[scss.assignmentRole, darkMode && scss.assignmentRoleDark]}>
                              Composer
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}

                  {assignmentRole === 'operator' && (
                    <>
                      <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark, { marginBottom: 12 }]}>
                        Select an Operator
                      </Text>
                      {operators.map((operator) => (
                        <TouchableOpacity
                          key={operator.id}
                          style={[scss.assignmentOption, darkMode && scss.assignmentOptionDark]}
                          onPress={() => assignTeamMember(operator.id, operator.name)}
                        >
                          <Ionicons name="person-circle" size={32} color="#7C3AED" style={{ marginRight: 12 }} />
                          <View>
                            <Text style={[scss.assignmentName, darkMode && scss.assignmentNameDark]}>
                              {operator.name}
                            </Text>
                            <Text style={[scss.assignmentRole, darkMode && scss.assignmentRoleDark]}>
                              Operator
                            </Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  )}

                  <TouchableOpacity
                    style={[scss.createNewButton, darkMode && scss.createNewButtonDark]}
                    onPress={() => setShowCreateTeamMember(true)}
                  >
                    <Ionicons name="add-circle-outline" size={20} color="#7C3AED" style={{ marginRight: 8 }} />
                    <Text style={[scss.createNewButtonText, darkMode && scss.createNewButtonTextDark]}>
                      Create New {assignmentRole === 'composer' ? 'Composer' : 'Operator'}
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark]}>Name</Text>
                  <TextInput
                    style={[scss.modalInput, darkMode && scss.modalInputDark, newTeamMemberErrors.name && scss.inputError]}
                    placeholder="Enter name"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#D1D5DB'}
                    value={newTeamMemberName}
                    onChangeText={(text) => {
                      setNewTeamMemberName(text);
                      if (newTeamMemberErrors.name) {
                        setNewTeamMemberErrors({ ...newTeamMemberErrors, name: undefined });
                      }
                    }}
                  />
                  {newTeamMemberErrors.name && (
                    <Text style={scss.errorText}>{newTeamMemberErrors.name}</Text>
                  )}

                  <Text style={[scss.modalLabel, darkMode && scss.modalLabelDark, { marginTop: 16 }]}>Phone Number</Text>
                  <TextInput
                    style={[scss.modalInput, darkMode && scss.modalInputDark, newTeamMemberErrors.phone && scss.inputError]}
                    placeholder="10 digit number"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#D1D5DB'}
                    value={newTeamMemberPhone}
                    onChangeText={(text) => {
                      const digitsOnly = text.replace(/\D/g, '');
                      setNewTeamMemberPhone(digitsOnly);
                      if (newTeamMemberErrors.phone) {
                        setNewTeamMemberErrors({ ...newTeamMemberErrors, phone: undefined });
                      }
                    }}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                  {newTeamMemberErrors.phone && (
                    <Text style={scss.errorText}>{newTeamMemberErrors.phone}</Text>
                  )}
                </>
              )}
            </ScrollView>

            <View style={scss.modalActions}>
              {showCreateTeamMember && (
                <TouchableOpacity
                  style={[scss.modalButton, scss.modalButtonSave]}
                  onPress={createNewTeamMember}
                >
                  <Text style={scss.modalButtonSaveText}>Create & Assign</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[scss.modalButton, scss.modalButtonCancel]}
                onPress={() => {
                  if (showCreateTeamMember) {
                    setShowCreateTeamMember(false);
                    setNewTeamMemberName('');
                    setNewTeamMemberPhone('');
                    setNewTeamMemberErrors({});
                  } else {
                    setShowAssignmentModal(false);
                  }
                }}
              >
                <Text style={scss.modalButtonCancelText}>{showCreateTeamMember ? 'Back' : 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

    </SafeAreaView>
    {!showSettings && (
      <FooterNav activeTab={activeTab} onTabPress={onTabPress} />
    )}
    </>
  );
};

const scss = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  orderCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  nameSection: {
    flex: 1,
    gap: 4,
  },
  customerNameText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  customerNameTextDark: {
    color: '#F3F4F6',
  },
  productBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  productBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editIconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 2,
  },
  infoLabelDark: {
    color: '#9CA3AF',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  infoValueDark: {
    color: '#E5E7EB',
  },
  pendingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  pendingValueDark: {
    color: '#F87171',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  showDetailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  showDetailsLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7C3AED',
  },
  expandedContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  expandedContainerDark: {
    backgroundColor: '#2D3748',
  },
  statusDropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 4,
    marginBottom: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statusDropdownMenuDark: {
    backgroundColor: '#2D3748',
    borderColor: '#4B5563',
  },
  statusMenuOption: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  statusMenuOptionActive: {
    backgroundColor: '#F3F4F6',
  },
  statusOptionText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    flex: 1,
  },
  statusOptionTextActive: {
    fontWeight: '600',
    color: '#7C3AED',
  },
  compactGrid: {
    flexDirection: 'column',
    gap: 10,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compactItem: {
    flex: 1,
    flexDirection: 'column',
    gap: 3,
  },
  compactLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  compactLabelDark: {
    color: '#D1D5DB',
  },
  compactValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  compactValueDark: {
    color: '#F3F4F6',
  },
  compactValueSuccess: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  mainOrderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  orderIDBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  orderIDText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  customerInfo: {
    flex: 1,
  },
  customerNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  customerNameTextDark: {
    color: '#F3F4F6',
  },
  productTypeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  productTypeTextDark: {
    color: '#D1D5DB',
  },
  statusIconButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  amountTextDark: {
    color: '#6EE7B7',
  },
  actionIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  metricsRowDark: {
    borderTopColor: '#4B5563',
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  metricTextDark: {
    color: '#D1D5DB',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  metricDividerDark: {
    backgroundColor: '#4B5563',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
    gap: 4,
  },
  assignedBadgeDark: {
    backgroundColor: '#064E3B',
  },
  assignedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  assignedTextDark: {
    color: '#A7F3D0',
  },
  orderStatusContainer: {
    marginTop: 12,
    marginBottom: 4,
  },
  statusSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  statusSectionLabelDark: {
    color: '#D1D5DB',
  },
  statusPillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  statusPillButtonDark: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusPillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    justifyContent: 'center',
  },
  statusPillText: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  orderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  orderInfoSection: {
    flex: 1,
  },
  orderTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  orderTimeDark: {
    color: '#9CA3AF',
  },
  orderCustomerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  orderCustomerNameDark: {
    color: '#F3F4F6',
  },
  statusBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerRowDark: {
    borderTopColor: '#4B5563',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  orderAmountDark: {
    color: '#F3F4F6',
  },
  itemCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  itemCountDark: {
    color: '#9CA3AF',
  },
  orderProductType: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  orderProductTypeDark: {
    color: '#D1D5DB',
  },
  statusButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderMetricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  metricLabelDark: {
    color: '#D1D5DB',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  metricValueDark: {
    color: '#E5E7EB',
  },
  metricValueAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
  },
  metricValueAmountDark: {
    color: '#6EE7B7',
  },
  metricValuePending: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  metricValuePendingDark: {
    color: '#F87171',
  },
  metricSeparator: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  orderBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  orderIDTag: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  assignedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    flex: 1,
  },
  assignedTagDark: {
    backgroundColor: '#064E3B',
  },
  assignedTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  assignedTagTextDark: {
    color: '#A7F3D0',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
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
  customerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  customerNameDark: {
    color: '#F3F4F6',
  },
  orderActionsInline: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonInline: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonInlineDark: {
    backgroundColor: '#4B5563',
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
    gap: 8,
  },
  statusDropdownDark: {
    borderColor: '#4B5563',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  statusTextDark: {
    color: '#E5E7EB',
  },
  statusDropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statusDropdownMenuDark: {
    backgroundColor: '#2D3748',
    borderColor: '#4B5563',
  },
  statusDropdownHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  statusDropdownHeaderDark: {
    color: '#D1D5DB',
  },
  statusMenuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  statusMenuOptionDark: {
    borderBottomColor: '#4B5563',
  },
  statusMenuOptionActive: {
    backgroundColor: '#F9FAFB',
  },
  statusMenuOptionActiveDark: {
    backgroundColor: '#3D4A5C',
  },
  statusMenuCheckmark: {
    marginRight: 8,
  },
  statusMenuArrow: {
    marginLeft: 'auto',
  },
  statusIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusMenuOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  statusMenuOptionTextDark: {
    color: '#F3F4F6',
  },
  statusMenuOptionTextActive: {
    color: '#6366F1',
    fontWeight: '700',
  },
  statusDescription: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  statusDescriptionDark: {
    color: '#9CA3AF',
  },
  statusDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },
  statusDividerDark: {
    backgroundColor: '#4B5563',
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
  expandedContainer: {
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
  expandedContainerDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  compactGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 12,
  },
  compactItem: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  compactLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactLabelDark: {
    color: '#D1D5DB',
  },
  compactValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  compactValueDark: {
    color: '#F3F4F6',
  },
  compactValueSuccess: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  showLessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 6,
  },
  showLessButtonDark: {
    borderTopColor: '#4B5563',
  },
  showLessText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  showLessTextDark: {
    color: '#818CF8',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  gridItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    flex: 1,
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
    marginLeft: 0,
    textAlign: 'right',
  },
  gridValueDark: {
    color: '#F3F4F6',
  },
  gridValuePending: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginLeft: 0,
    textAlign: 'right',
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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '50%',
    marginBottom: 80,
  },
  modalContentDark: {
    backgroundColor: '#1F2937',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalTitleDark: {
    color: '#F3F4F6',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  modalFieldContainer: {
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalLabelDark: {
    color: '#E5E7EB',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  modalInputDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: '#E5E7EB',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalButtonCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalButtonSave: {
    backgroundColor: '#7C3AED',
  },
  modalButtonSaveText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  assignmentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  assignmentOptionDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  assignmentName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  assignmentNameDark: {
    color: '#E5E7EB',
  },
  assignmentRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  assignmentRoleDark: {
    color: '#9CA3AF',
  },
  createNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#7C3AED',
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
  },
  createNewButtonDark: {
    backgroundColor: '#5B21B6',
    borderColor: '#A78BFA',
  },
  createNewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
  createNewButtonTextDark: {
    color: '#E9D5FF',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
});

export default OrdersScreen;