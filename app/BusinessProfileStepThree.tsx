import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
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
  const { ownerName, phoneNumber, whatsappNumber } = useLocalSearchParams<{
    ownerName: string;
    phoneNumber: string;
    whatsappNumber: string;
  }>();
  
  const [activeTab, setActiveTab] = useState<Role>('composers');
  
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

  // Form states
  const [formName, setFormName] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formWhatsapp, setFormWhatsapp] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    mobile: '',
    whatsapp: '',
    email: '',
  });

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        return 'Owners have full access to manage business settings, orders, and team.';
      case 'composers':
        return 'Composers create and upload designs for customer orders and update their status.';
      case 'operators':
        return 'Operators handle print production and mark jobs as completed.';
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

  const handleToggleSameAsMobile = () => {
    setSameAsMobile((prev) => {
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
    if (sameAsMobile) {
      setFormWhatsapp(cleaned);
    }
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setFormWhatsapp(cleaned);
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
      setFormErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit mobile number.' }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, mobile: '' }));
    return true;
  };

  const validateWhatsapp = () => {
    if (formWhatsapp.length !== 10 || !/^[6-9]/.test(formWhatsapp)) {
      setFormErrors((prev) => ({ ...prev, whatsapp: 'Enter a valid 10-digit WhatsApp number.' }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, whatsapp: '' }));
    return true;
  };

  const validateEmail = () => {
    if (formEmail && !EMAIL_REGEX.test(formEmail)) {
      setFormErrors((prev) => ({ ...prev, email: 'Enter a valid email address.' }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const resetForm = () => {
    setFormName('');
    setFormMobile('');
    setFormWhatsapp('');
    setFormEmail('');
    setSameAsMobile(false);
    setFormErrors({
      name: '',
      mobile: '',
      whatsapp: '',
      email: '',
    });
  };

  const handleAddMember = () => {
    const isNameValid = validateName();
    const isMobileValid = validateMobile();
    const isWhatsappValid = validateWhatsapp();
    const isEmailValid = validateEmail();

    if (!isNameValid || !isMobileValid || !isWhatsappValid || !isEmailValid) {
      return;
    }

    const newMember: Member = {
      id: Date.now().toString(),
      name: formName.trim(),
      mobile: formMobile,
      whatsapp: formWhatsapp,
      email: formEmail.trim() || undefined,
      role: activeTab === 'owners' 
        ? `Owner (Secondary)` 
        : activeTab === 'composers' 
        ? 'Composer' 
        : 'Operator',
    };

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
    // Navigate to dashboard
    router.replace('/DashboardScreen');
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Section with Back Arrow */}
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backArrow} onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.title}>Business Profile Setup</Text>
            <View style={styles.placeholderSpace} />
          </View>
          <Text style={styles.subtitle}>Step 3 of 3: Team Management</Text>

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

          {/* Add Member Button */}
          <View style={styles.addButtonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <LinearGradient
                colors={['#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Ionicons name="person-add-outline" size={20} color="#FFFFFF" />
                <Text style={styles.addButtonText}>{getAddButtonText()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Members List */}
          <View style={styles.membersList}>
            {getTabData().length === 0 ? (
              <Text style={styles.emptyState}>{getEmptyStateText()}</Text>
            ) : (
              getTabData().map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberDetail}>Mobile: {member.mobile}</Text>
                    <Text style={styles.memberDetail}>WhatsApp: {member.whatsapp}</Text>
                    {member.email && <Text style={styles.memberDetail}>Email: {member.email}</Text>}
                    <View style={styles.roleBadge}>
                      <Text style={styles.roleBadgeText}>{member.role}</Text>
                    </View>
                  </View>
                  <View style={styles.memberActions}>
                    <TouchableOpacity style={styles.actionButton}>
                      <Ionicons name="pencil-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteMember(member.id)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
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
            colors={['#A855F7', '#7C3AED']}
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
                <Text style={styles.modalTitle}>{getAddButtonText()}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
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

                {/* Mobile Number */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    Mobile Number <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, formErrors.mobile && styles.inputError]}
                    placeholder="e.g., 9876543210"
                    value={formMobile}
                    onChangeText={handleMobileChange}
                    onBlur={validateMobile}
                    keyboardType="phone-pad"
                    placeholderTextColor="#9CA3AF"
                    maxLength={10}
                  />
                  {formErrors.mobile ? <Text style={styles.errorTextSmall}>{formErrors.mobile}</Text> : null}
                </View>

                {/* WhatsApp Number */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>
                    WhatsApp Number <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[styles.input, formErrors.whatsapp && styles.inputError]}
                    placeholder="e.g., 9876543210"
                    value={formWhatsapp}
                    onChangeText={handleWhatsappChange}
                    onBlur={validateWhatsapp}
                    keyboardType="phone-pad"
                    editable={!sameAsMobile}
                    placeholderTextColor="#9CA3AF"
                    maxLength={10}
                  />
                  {formErrors.whatsapp ? (
                    <Text style={styles.errorTextSmall}>{formErrors.whatsapp}</Text>
                  ) : null}

                  {/* Same as Mobile Toggle */}
                  <View style={styles.toggleRow}>
                    <Switch
                      value={sameAsMobile}
                      onValueChange={handleToggleSameAsMobile}
                      trackColor={{ false: '#E5E7EB', true: '#A855F7' }}
                      thumbColor={sameAsMobile ? '#fff' : '#fff'}
                    />
                    <Text style={styles.toggleLabel}>Same as mobile</Text>
                  </View>
                </View>

                {/* Email */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email ID (Optional)</Text>
                  <TextInput
                    style={[styles.input, formErrors.email && styles.inputError]}
                    placeholder="Enter email (optional)"
                    value={formEmail}
                    onChangeText={setFormEmail}
                    onBlur={validateEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#9CA3AF"
                  />
                  {formErrors.email ? <Text style={styles.errorTextSmall}>{formErrors.email}</Text> : null}
                </View>

                {/* Add Button */}
                <TouchableOpacity style={styles.modalAddBtn} onPress={handleAddMember}>
                  <LinearGradient
                    colors={['#A855F7', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.modalAddBtnGradient}
                  >
                    <Text style={styles.modalAddBtnText}>Add Member</Text>
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
    backgroundColor: '#F9F9FF',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  backArrow: {
    padding: 4,
  },
  placeholderSpace: {
    width: 32,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
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
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  tabTextActive: {
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
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
    padding: 16,
    marginVertical: 8,
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
    backgroundColor: '#F9F9FF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  finishBtn: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  finishBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    color: '#111827',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
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
  toggleLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 8,
  },
  modalAddBtn: {
    marginTop: 12,
    marginBottom: 20,
    width: '100%',
    height: 52,
    borderRadius: 10,
    overflow: 'hidden',
  },
  modalAddBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAddBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BusinessProfileStepThree;
