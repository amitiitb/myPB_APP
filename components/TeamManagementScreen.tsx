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
import { useTheme } from '../context/ThemeContext';

type Role = 'owners' | 'composers' | 'operators';

interface TeamMember {
  id: string;
  name: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  role: string;
}

interface TeamManagementScreenProps {
  onBack: () => void;
}

const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ onBack }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<Role>('owners');
  
  // Initialize owners with primary owner
  const [owners, setOwners] = useState<TeamMember[]>([
    {
      id: 'primary-owner',
      name: 'Account Owner',
      mobile: '9876543210',
      whatsapp: '9876543210',
      email: 'owner@printbandhan.com',
      role: 'Owner (Primary)',
    },
  ]);
  
  const [composers, setComposers] = useState<TeamMember[]>([]);
  const [operators, setOperators] = useState<TeamMember[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
        return 'Composers create and upload designs for customer orders.';
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
      setFormErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit contact number.' }));
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
    setFormErrors({ name: '', mobile: '', whatsapp: '', email: '' });
    setEditingId(null);
  };

  const handleAddOrUpdateMember = () => {
    if (!validateName() || !validateMobile() || !validateWhatsapp() || !validateEmail()) {
      return;
    }

    const newMember: TeamMember = {
      id: editingId || Date.now().toString(),
      name: formName,
      mobile: formMobile,
      whatsapp: formWhatsapp,
      email: formEmail,
      role: activeTab.slice(0, -1),
    };

    if (editingId) {
      // Update existing member
      updateMemberInTab(newMember);
      Alert.alert('Success', `${getAddButtonText().replace('Add ', '')} updated successfully`);
    } else {
      // Add new member
      addMemberToTab(newMember);
      Alert.alert('Success', `${getAddButtonText().replace('Add ', '')} added successfully`);
    }

    resetForm();
    setShowModal(false);
  };

  const addMemberToTab = (member: TeamMember) => {
    switch (activeTab) {
      case 'owners':
        setOwners([...owners, member]);
        break;
      case 'composers':
        setComposers([...composers, member]);
        break;
      case 'operators':
        setOperators([...operators, member]);
        break;
    }
  };

  const updateMemberInTab = (member: TeamMember) => {
    switch (activeTab) {
      case 'owners':
        setOwners(owners.map((m) => (m.id === member.id ? member : m)));
        break;
      case 'composers':
        setComposers(composers.map((m) => (m.id === member.id ? member : m)));
        break;
      case 'operators':
        setOperators(operators.map((m) => (m.id === member.id ? member : m)));
        break;
    }
  };

  const handleDeleteMember = (id: string) => {
    // Prevent deletion of primary owner
    if (id === 'primary-owner') {
      Alert.alert('Cannot Delete', 'Primary account owner cannot be deleted.');
      return;
    }

    Alert.alert('Delete Member', 'Are you sure you want to delete this member?', [
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
    ]);
  };

  const handleEditMember = (member: TeamMember) => {
    setFormName(member.name);
    setFormMobile(member.mobile);
    setFormWhatsapp(member.whatsapp);
    setFormEmail(member.email || '');
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      <View style={[scss.container, darkMode && scss.containerDark]}>
        {/* Header */}
        <View style={scss.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={scss.headerTitle}>Team Management</Text>
        </View>

        {/* Tab Navigation */}
        <View style={[scss.tabContainer, darkMode && scss.tabContainerDark]}>
          {(['owners', 'composers', 'operators'] as Role[]).map((tab) => {
            const tabLabels = {
              owners: 'Owner',
              composers: 'Composer',
              operators: 'Operator',
            };
            return (
              <TouchableOpacity
                key={tab}
                style={[scss.tab, darkMode && activeTab !== tab && scss.tab, activeTab === tab && scss.tabActive, activeTab === tab && darkMode && scss.tabActiveDark]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[scss.tabText, darkMode && activeTab !== tab && scss.tabTextDark, activeTab === tab && scss.tabTextActive, activeTab === tab && darkMode && scss.tabTextActiveDark]}>
                  {tabLabels[tab]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <View style={scss.descriptionBox}>
          <Text style={[scss.descriptionText, darkMode && scss.descriptionTextDark]}>{getTabDescription()}</Text>
        </View>

        {/* Members List */}
        <ScrollView style={scss.membersList} showsVerticalScrollIndicator={false}>
          {getTabData().length === 0 ? (
            <View style={scss.emptyState}>
              <Ionicons name="person-add-outline" size={48} color={darkMode ? '#6B7280' : '#D1D5DB'} />
              <Text style={[scss.emptyStateText, darkMode && scss.emptyStateTextDark]}>{getEmptyStateText()}</Text>
            </View>
          ) : (
            getTabData().map((member) => (
              <View key={member.id} style={[scss.memberCard, darkMode && scss.memberCardDark, member.id === 'primary-owner' && scss.primaryOwnerCard, member.id === 'primary-owner' && darkMode && scss.primaryOwnerCardDark]}>
                <View style={scss.memberInfo}>
                  <View style={scss.memberNameRow}>
                    <Text style={[scss.memberName, darkMode && scss.memberNameDark]}>{member.name}</Text>
                    {member.id === 'primary-owner' && (
                      <View style={scss.primaryBadge}>
                        <Text style={scss.primaryBadgeText}>Primary</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[scss.memberDetail, darkMode && scss.memberDetailDark]}>📱 {member.mobile}</Text>
                  <Text style={[scss.memberDetail, darkMode && scss.memberDetailDark]}>💬 {member.whatsapp}</Text>
                  {member.email && <Text style={[scss.memberDetail, darkMode && scss.memberDetailDark]}>✉️ {member.email}</Text>}
                </View>
                <View style={scss.memberActions}>
                  {member.id !== 'primary-owner' && (
                    <>
                      <TouchableOpacity
                        style={scss.editBtn}
                        onPress={() => handleEditMember(member)}
                      >
                        <Ionicons name="pencil" size={18} color="#7C3AED" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={scss.deleteBtn}
                        onPress={() => handleDeleteMember(member.id)}
                      >
                        <Ionicons name="trash" size={18} color={darkMode ? '#FCA5A5' : '#EF4444'} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Add Button */}
        <TouchableOpacity style={scss.addButton} onPress={handleOpenModal}>
          <Ionicons name="add-circle" size={24} color="#fff" />
          <Text style={scss.addButtonText}>{getAddButtonText()}</Text>
        </TouchableOpacity>

        {/* Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={scss.modalContainer}
          >
            <View style={scss.modalOverlay}>
              <View style={[scss.modalContent, darkMode && scss.modalContentDark]}>
                <View style={[scss.modalHeader, darkMode && scss.modalHeaderDark]}>
                  <Text style={[scss.modalTitle, darkMode && scss.modalTitleDark]}>
                    {editingId ? 'Edit' : 'Add'} {getAddButtonText().replace('Add ', '')}
                  </Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={28} color={darkMode ? '#E5E7EB' : '#111827'} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={scss.formContainer} showsVerticalScrollIndicator={false}>
                  {/* Name Input */}
                  <Text style={[scss.label, darkMode && scss.labelDark]}>Name *</Text>
                  <TextInput
                    style={[scss.input, darkMode && scss.inputDark, formErrors.name && scss.inputError]}
                    placeholder="Enter full name"
                    value={formName}
                    onChangeText={setFormName}
                    onBlur={validateName}
                  />
                  {formErrors.name && <Text style={scss.errorText}>{formErrors.name}</Text>}

                  {/* Mobile Input */}
                  <Text style={[scss.label, darkMode && scss.labelDark]}>Contact Number *</Text>
                  <TextInput
                    style={[scss.input, darkMode && scss.inputDark, formErrors.mobile && scss.inputError]}
                    placeholder="10-digit mobile number"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#999'}
                    keyboardType="numeric"
                    value={formMobile}
                    onChangeText={handleMobileChange}
                    onBlur={validateMobile}
                  />
                  {formErrors.mobile && <Text style={scss.errorText}>{formErrors.mobile}</Text>}

                  {/* WhatsApp Toggle */}
                  <View style={scss.toggleRow}>
                    <Text style={[scss.label, darkMode && scss.labelDark]}>WhatsApp same as contact number?</Text>
                    <Switch
                      value={sameAsMobile}
                      onValueChange={handleToggleSameAsMobile}
                      thumbColor={sameAsMobile ? '#7C3AED' : '#ccc'}
                      trackColor={{ true: '#E9D5FF', false: darkMode ? '#4B5563' : '#E5E7EB' }}
                    />
                  </View>

                  {/* WhatsApp Input */}
                  {!sameAsMobile && (
                    <>
                      <Text style={[scss.label, darkMode && scss.labelDark]}>WhatsApp Number *</Text>
                      <TextInput
                        style={[scss.input, darkMode && scss.inputDark, formErrors.whatsapp && scss.inputError]}
                        placeholder="10-digit WhatsApp number"
                        placeholderTextColor={darkMode ? '#9CA3AF' : '#999'}
                        keyboardType="numeric"
                        value={formWhatsapp}
                        onChangeText={handleWhatsappChange}
                        onBlur={validateWhatsapp}
                      />
                      {formErrors.whatsapp && <Text style={scss.errorText}>{formErrors.whatsapp}</Text>}
                    </>
                  )}

                  {/* Email Input */}
                  <Text style={[scss.label, darkMode && scss.labelDark]}>Email (Optional)</Text>
                  <TextInput
                    style={[scss.input, darkMode && scss.inputDark, formErrors.email && scss.inputError]}
                    placeholder="Enter email address"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#999'}
                    keyboardType="email-address"
                    value={formEmail}
                    onChangeText={setFormEmail}
                    onBlur={validateEmail}
                  />
                  {formErrors.email && <Text style={scss.errorText}>{formErrors.email}</Text>}
                </ScrollView>

                {/* Modal Actions */}
                <View style={[scss.modalActions, darkMode && scss.modalActionsDark]}>
                  <TouchableOpacity style={[scss.cancelBtn, darkMode && scss.cancelBtnDark]} onPress={() => setShowModal(false)}>
                    <Text style={[scss.cancelBtnText, darkMode && scss.cancelBtnTextDark]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={scss.submitBtn} onPress={handleAddOrUpdateMember}>
                    <Text style={scss.submitBtnText}>{editingId ? 'Update' : 'Add'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  containerDark: {
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#EDECF3',
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 14,
  },
  tabContainerDark: {
    backgroundColor: '#374151',
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabActiveDark: {
    backgroundColor: '#4B5563',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  tabTextDark: {
    color: '#D1D5DB',
  },
  tabTextActive: {
    color: '#111827',
    fontWeight: '600',
  },
  tabTextActiveDark: {
    color: '#F3F4F6',
  },
  descriptionBox: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  descriptionTextDark: {
    color: '#D1D5DB',
  },
  membersList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  emptyStateTextDark: {
    color: '#D1D5DB',
  },
  memberCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  memberCardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  primaryOwnerCard: {
    borderColor: '#7C3AED',
    borderWidth: 2,
    backgroundColor: '#F8F7FF',
  },
  primaryOwnerCardDark: {
    backgroundColor: '#4B5563',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  memberNameDark: {
    color: '#F3F4F6',
  },
  primaryBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#7C3AED',
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  memberDetail: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  memberDetailDark: {
    color: '#D1D5DB',
  },
  memberActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editBtn: {
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  editBtnDark: {
    backgroundColor: '#4B5563',
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  deleteBtnDark: {
    backgroundColor: '#7F1D1D',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EC4899',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 13,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalContentDark: {
    backgroundColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalHeaderDark: {
    borderBottomColor: '#4B5563',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  modalTitleDark: {
    color: '#F3F4F6',
  },
  formContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  labelDark: {
    color: '#F3F4F6',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 14,
    backgroundColor: '#F9F9FF',
  },
  inputDark: {
    borderColor: '#4B5563',
    backgroundColor: '#4B5563',
    color: '#F3F4F6',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalActionsDark: {
    borderTopColor: '#4B5563',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelBtnDark: {
    borderColor: '#4B5563',
  },
  cancelBtnText: {
    color: '#6B7280',
  },
  cancelBtnTextDark: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 14,
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default TeamManagementScreen;
