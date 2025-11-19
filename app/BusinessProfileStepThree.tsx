import StepIndicator from '@/components/StepIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type Role = 'owners' | 'composers' | 'operators';

interface Member {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  role: string;
}

const BusinessProfileStepThree: React.FC = () => {
  const { ownerName, phoneNumber, whatsappNumber, pressName, latitude, longitude, selectedServices: paramServices } = useLocalSearchParams<{
    ownerName: string;
    phoneNumber: string;
    whatsappNumber: string;
    pressName: string;
    latitude?: string;
    longitude?: string;
    selectedServices?: string;
  }>();
  
  const [activeTab, setActiveTab] = useState<Role>('composers');
  
  // Step indicator data for Business Profile Setup
  const steps = [
    { id: 1, label: 'Business Details', completed: true, current: false },
    { id: 2, label: 'Services', completed: true, current: false },
    { id: 3, label: 'Team', completed: false, current: true },
  ];
  
  // Initialize owners with primary owner data
  const [owners, setOwners] = useState<Member[]>(() => {
    if (ownerName && phoneNumber) {
      return [{
        id: 'primary-owner',
        name: ownerName,
        mobile: phoneNumber,
        whatsapp: whatsappNumber || phoneNumber,
        role: 'Owner (Primary)',
      }];
    }
    return [];
  });
  
  const [composers, setComposers] = useState<Member[]>([]);
  const [operators, setOperators] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [sameAsContact, setSameAsContact] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
  });

  const getTabData = () => {
    switch (activeTab) {
      case 'owners':
        return owners;
      case 'composers':
        return composers;
      case 'operators':
        return operators;
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'owners':
        return 'Owners have full access to manage business settings, orders, and team';
      case 'composers':
        return 'Composers create and upload designs for customer orders and update their status';
      case 'operators':
        return 'Operators handle print production and mark jobs as completed';
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'owners':
        return 'Add Owner';
      case 'composers':
        return 'Add Composer';
      case 'operators':
        return 'Add Operator';
    }
  };

  const getEmptyStateText = () => {
    switch (activeTab) {
      case 'owners':
        return 'No owners added yet.';
      case 'composers':
        return 'No composers added yet.';
      case 'operators':
        return 'No operators added yet.';
    }
  };

  const isPhoneNumberExists = (phoneNumber: string, excludeId?: string | null) => {
    const allMembers = [
      ...owners.filter(m => !excludeId || m.id !== excludeId),
      ...composers.filter(m => !excludeId || m.id !== excludeId),
      ...operators.filter(m => !excludeId || m.id !== excludeId),
    ];
    
    return allMembers.some(m => m.mobile === phoneNumber || m.whatsapp === phoneNumber);
  };

  const handleToggleSameAsContact = () => {
    setSameAsContact((prev) => {
      const next = !prev;
      if (next) {
        setFormWhatsapp(formMobile);
      } else {
        setFormWhatsapp('');
      }
      return next;
    });
  };

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setFormMobile(cleaned);
    if (sameAsContact) {
      setFormWhatsapp(cleaned);
    }
    // Dismiss keyboard when 10 digits are entered
    if (cleaned.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setFormWhatsapp(cleaned);
    // Dismiss keyboard when 10 digits are entered
    if (cleaned.length === 10) {
      Keyboard.dismiss();
    }
  };

  const validateName = () => {
    if (!formName.trim()) {
      setFormErrors((prev) => ({ ...prev, name: 'Name is required.' }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, name: '' }));
    return true;
  };

  const validateMobile = () => {
    if (formMobile.length !== 10 || !/^[6-9]/.test(formMobile)) {
      setFormErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit contact number.' }));
      return false;
    }
    
    // Only check for duplicates if not editing or if the number has changed
    if (!editingMemberId) {
      // Adding new member - check if number exists
      if (isPhoneNumberExists(formMobile, null)) {
        setFormErrors((prev) => ({ ...prev, mobile: 'Phone number already linked to another user.' }));
        return false;
      }
    } else {
      // Editing - check if number exists for other members (excluding current)
      if (isPhoneNumberExists(formMobile, editingMemberId)) {
        setFormErrors((prev) => ({ ...prev, mobile: 'Phone number already linked to another user.' }));
        return false;
      }
    }
    
    setFormErrors((prev) => ({ ...prev, mobile: '' }));
    return true;
  };

  const validateWhatsapp = () => {
    // WhatsApp is optional, only validate if provided
    if (formWhatsapp.length > 0) {
      if (formWhatsapp.length !== 10 || !/^[6-9]/.test(formWhatsapp)) {
        setFormErrors((prev) => ({ ...prev, whatsapp: 'Enter a valid 10-digit WhatsApp number.' }));
        return false;
      }
      
      // Only check for duplicates if not editing or if the number has changed
      if (!editingMemberId) {
        // Adding new member - check if number exists
        if (isPhoneNumberExists(formWhatsapp, null)) {
          setFormErrors((prev) => ({ ...prev, whatsapp: 'Phone number already linked to another user.' }));
          return false;
        }
      } else {
        // Editing - check if number exists for other members (excluding current)
        if (isPhoneNumberExists(formWhatsapp, editingMemberId)) {
          setFormErrors((prev) => ({ ...prev, whatsapp: 'Phone number already linked to another user.' }));
          return false;
        }
      }
    }
    
    setFormErrors((prev) => ({ ...prev, whatsapp: '' }));
    return true;
  };

  const resetForm = () => {
    setFormName('');
    setFormMobile('');
    setFormWhatsapp('');
    setSameAsContact(false);
    setEditingMemberId(null);
    setFormErrors({
      name: '',
      mobile: '',
      whatsapp: '',
    });
  };

  const handleAddMember = () => {
    console.log('handleAddMember called', { showModal, editingMemberId, activeTab });
    
    const isNameValid = validateName();
    const isMobileValid = validateMobile();
    const isWhatsappValid = validateWhatsapp();

    if (!isNameValid || !isMobileValid || !isWhatsappValid) {
      console.log('Validation failed');
      return;
    }

    // If WhatsApp is empty, use contact number as fallback
    const finalWhatsapp = formWhatsapp || formMobile;

    if (editingMemberId) {
      // Update existing member
      const updatedMember: Member = {
        id: editingMemberId,
        name: formName.trim(),
        mobile: formMobile,
        whatsapp: finalWhatsapp,
        role: activeTab === 'owners' 
          ? `Owner (Primary)` 
          : activeTab === 'composers' 
          ? 'Composer' 
          : 'Operator',
      };

      switch (activeTab) {
        case 'owners':
          setOwners(owners.map((m) => m.id === editingMemberId ? updatedMember : m));
          break;
        case 'composers':
          setComposers(composers.map((m) => m.id === editingMemberId ? updatedMember : m));
          break;
        case 'operators':
          setOperators(operators.map((m) => m.id === editingMemberId ? updatedMember : m));
          break;
      }
      setEditingMemberId(null);
    } else {
      // Add new member
      const newMember: Member = {
        id: Date.now().toString(),
        name: formName.trim(),
        mobile: formMobile,
        whatsapp: finalWhatsapp,
        role: activeTab === 'owners' 
          ? `Owner (Secondary)` 
          : activeTab === 'composers' 
          ? 'Composer' 
          : 'Operator',
      };

      console.log('Adding new member:', newMember);
      
      switch (activeTab) {
        case 'owners':
          setOwners([...owners, newMember]);
          break;
        case 'composers':
          setComposers([...composers, newMember]);
          break;
        case 'operators':
          setOperators([...operators, newMember]);
          break;
      }
    }

    console.log('Closing modal and resetting form');
    resetForm();
    setShowModal(false);
  };

  const handleDeleteMember = (id: string) => {
    Alert.alert(
      'Delete Member',
      'Are you sure you want to remove this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            switch (activeTab) {
              case 'owners':
                setOwners(owners.filter((m) => m.id !== id));
                break;
              case 'composers':
                setComposers(composers.filter((m) => m.id !== id));
                break;
              case 'operators':
                setOperators(operators.filter((m) => m.id !== id));
                break;
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleFinishSetup = () => {
    if (owners.length === 0) {
      setError('Please add at least one Owner to continue.');
      return;
    }
    setError('');
    // Navigate to success screen with team data
    router.push({
      pathname: '/SetupSuccessScreen',
      params: {
        owners: JSON.stringify(owners),
        composers: JSON.stringify(composers),
        operators: JSON.stringify(operators),
        ownerName: ownerName || '',
        phoneNumber: phoneNumber || '',
        whatsappNumber: whatsappNumber || '',
        pressName: pressName || '',
      }
    });
  };

  const openAddModal = () => {
    console.log('openAddModal called');
    resetForm();
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Step Indicator */}
      <StepIndicator 
        steps={steps} 
        currentStepPage={3}
        routeParams={{
          ownerName: ownerName || '',
          phoneNumber: phoneNumber || '',
          whatsappNumber: whatsappNumber || '',
          pressName: pressName || '',
          latitude: latitude || '',
          longitude: longitude || '',
          selectedServices: paramServices || '',
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'owners' && styles.tabActive]}
              onPress={() => setActiveTab('owners')}
            >
              <Text style={[styles.tabText, activeTab === 'owners' && styles.tabTextActive]}>
                Owner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'composers' && styles.tabActive]}
              onPress={() => setActiveTab('composers')}
            >
              <Text style={[styles.tabText, activeTab === 'composers' && styles.tabTextActive]}>
                Composer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'operators' && styles.tabActive]}
              onPress={() => setActiveTab('operators')}
            >
              <Text style={[styles.tabText, activeTab === 'operators' && styles.tabTextActive]}>
                Operator
              </Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text style={styles.description}>{getTabDescription()}</Text>

          {/* Members List */}
          <View style={styles.membersList}>
            {getTabData().length === 0 ? (
              <Text style={styles.emptyState}>{getEmptyStateText()}</Text>
            ) : (
              getTabData().map((member) => (
                <View
                  key={member.id}
                  style={[styles.memberCard, { borderColor: '#7C3AED', borderWidth: 1.5, backgroundColor: '#F8F7FF' }]}
                >
                  <View style={styles.memberInfo}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#7C3AED', marginBottom: 2 }}>{member.name}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Contact: {member.mobile}</Text>
                    {member.whatsapp && member.whatsapp !== member.mobile && (
                      <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>WhatsApp: {member.whatsapp}</Text>
                    )}
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>{member.role}</Text>
                    </View>
                  </View>
                  <View style={styles.memberActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => {
                        setEditingMemberId(member.id);
                        setFormName(member.name);
                        setFormMobile(member.mobile);
                        setFormWhatsapp(member.whatsapp);
                        setShowModal(true);
                      }}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    {member.id !== 'primary-owner' && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          handleDeleteMember(member.id);
                        }}
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))
            )}
            
            {/* Add Member Button - Always show after members list */}
            <View style={styles.addButtonContainer}>
              <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                <TouchableOpacity
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#7C3AED',
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#7C3AED',
                    shadowOpacity: 0.18,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 4,
                  }}
                  onPress={openAddModal}
                  activeOpacity={0.85}
                >
                  <Ionicons name="add" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#7C3AED', marginTop: 8 }}>{getAddButtonText()}</Text>
              </View>
            </View>
          </View>

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Spacer for floating button */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Finish Setup Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.finishBtn} onPress={handleFinishSetup}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.finishBtnGradient}
          >
            <Text style={styles.finishBtnText}>Finish Setup →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Add Member Modal */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{editingMemberId ? 'Edit ' + getAddButtonText().replace('Add ', '') : getAddButtonText()}</Text>
                <TouchableOpacity onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}>
                  <Ionicons name="close" size={28} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Name */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Name <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, formErrors.name && styles.inputError]}
                    placeholder="Enter full name"
                    value={formName}
                    onChangeText={setFormName}
                    onBlur={validateName}
                    placeholderTextColor="#9CA3AF"
                    maxLength={30}
                  />
                  {formErrors.name ? <Text style={styles.errorTextSmall}>{formErrors.name}</Text> : null}
                </View>

                {/* Contact Number and WhatsApp Number with Toggle */}
                <View style={styles.rowGroup}>
                  {/* Contact Number */}
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>
                      Contact Number <Text style={{ color: '#EF4444' }}>*</Text>
                    </Text>
                    <TextInput
                      style={[styles.input, formErrors.mobile && styles.inputError, (editingMemberId && activeTab === 'owners' && editingMemberId === 'primary-owner') && styles.disabledInput]}
                      placeholder="+91-9876543210"
                      value={formMobile}
                      onChangeText={handleMobileChange}
                      onBlur={validateMobile}
                      keyboardType="phone-pad"
                      editable={!(editingMemberId && activeTab === 'owners' && editingMemberId === 'primary-owner')}
                      placeholderTextColor="#9CA3AF"
                      maxLength={10}
                    />
                    {formErrors.mobile ? <Text style={styles.errorTextSmall}>{formErrors.mobile}</Text> : null}
                  </View>

                  {/* WhatsApp Number with Toggle Below */}
                  <View style={styles.halfWidth}>
                    <Text style={styles.label}>
                      WhatsApp Number
                    </Text>
                    <TextInput
                      style={[styles.input, formErrors.whatsapp && styles.inputError, (editingMemberId && activeTab === 'owners' && editingMemberId === 'primary-owner') && styles.disabledInput]}
                      placeholder="+91-9876543210"
                      value={formWhatsapp}
                      onChangeText={handleWhatsappChange}
                      onBlur={validateWhatsapp}
                      keyboardType="phone-pad"
                      editable={!(editingMemberId && activeTab === 'owners' && editingMemberId === 'primary-owner') && !sameAsContact}
                      placeholderTextColor="#9CA3AF"
                      maxLength={10}
                    />
                    {formErrors.whatsapp ? (
                      <Text style={styles.errorTextSmall}>{formErrors.whatsapp}</Text>
                    ) : null}
                    
                    {/* Same as Contact Toggle Below WhatsApp */}
                    {!(editingMemberId && activeTab === 'owners' && editingMemberId === 'primary-owner') && (
                      <View style={styles.toggleBelowWrapper}>
                        <View style={styles.switchOutlineWrapper}>
                          <Switch
                            value={sameAsContact}
                            onValueChange={handleToggleSameAsContact}
                            trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                            thumbColor={sameAsContact ? '#fff' : '#fff'}
                          />
                        </View>
                        <Text style={styles.toggleLabelSmall}>Same as Contact</Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Add Button */}
                <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddMember}>
                  <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalAddBtnGradient}
                  >
                    <Text style={styles.modalAddBtnText}>{editingMemberId ? 'Update Member' : 'Add Member'}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  backArrow: {
    padding: 4,
  },
  placeholderSpace: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    width: '100%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  mainHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDECF3',
    borderRadius: 14,
    padding: 6,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  addButtonContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  membersList: {
    marginBottom: 24,
  },
  emptyState: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginVertical: 32,
  },
  memberCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    marginVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  memberDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 3,
  },
  roleBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  memberActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '600',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    gap: 12,
  },
  skipBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipBtnText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  finishBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  finishBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 48,
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  errorTextSmall: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
  },
  toggleCenteredWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    gap: 4,
  },
  toggleBelowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 12,
  },
  toggleSideWrapper: {
    flex: 0.8,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 32,
    gap: 6,
  },
  switchOutlineWrapper: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 1,
    paddingVertical: 1,
    transform: [{ scale: 0.85 }],
  },
  toggleLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    marginLeft: 12,
  },
  toggleLabelSmall: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  halfWidth: {
    flex: 1,
    marginBottom: 0,
  },
  modalAddBtn: {
    marginTop: 16,
    marginBottom: 20,
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  modalAddBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default BusinessProfileStepThree;
