import * as Contacts from 'expo-contacts';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  owners?: TeamMember[];
  composers?: TeamMember[];
  operators?: TeamMember[];
}

const TeamManagementScreen: React.FC<TeamManagementScreenProps> = ({ 
  onBack, 
  ownerName = 'Account Owner', 
  ownerPhone = '9876543210',
  ownerWhatsapp,
  owners = [],
  composers = [],
  operators = [],
}) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<Role>('owners');
  
  // Initialize with data from props if available, otherwise use defaults
  const [ownersData, setOwnersData] = useState<TeamMember[]>(() => {
    // If owners data from Step 3 is available, use it
    if (owners && owners.length > 0) {
      return owners;
    }
    // Otherwise, create a primary owner entry
    return [
      {
        id: 'primary-owner',
        name: ownerName,
        mobile: ownerPhone,
        whatsapp: ownerWhatsapp || ownerPhone,
        email: 'owner@printbandhan.com',
        role: 'Owner (Primary)',
      },
    ];
  });
  
  const [composersData, setComposersData] = useState<TeamMember[]>(() => {
    return (composers && composers.length > 0) ? composers : [];
  });
  
  const [operatorsData, setOperatorsData] = useState<TeamMember[]>(() => {
    return (operators && operators.length > 0) ? operators : [];
  });
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  // Helper function to check if phone number already exists across all roles
  const isPhoneNumberExists = (phoneNumber: string, excludeId?: string): boolean => {
    const allMembers = [...ownersData, ...composersData, ...operatorsData];
    return allMembers.some(
      (member) => 
        (member.mobile === phoneNumber || member.whatsapp === phoneNumber) && 
        member.id !== excludeId
    );
  };

  const getTabData = () => {
    switch (activeTab) {
      case 'owners':
        return ownersData;
      case 'composers':
        return composersData;
      case 'operators':
        return operatorsData;
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'owners':
        return 'Owner ka kaam orders, customers, payments aur team ko manage karna hota hai';
      case 'composers':
        return 'Composer ka kaam designs aur artwork prepare karna hota hai';
      case 'operators':
        return 'Operator ka kaam printing machine chalana aur printing process complete karna hota hai';
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
        return 'No owners added yet';
      case 'composers':
        return 'No composers added yet';
      case 'operators':
        return 'No operators added yet';
    }
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

  const handleNameChange = (text: string) => {
    setFormName(text);
    if (text.trim()) {
      setFormErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleMobileChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setFormMobile(cleaned);
    if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
      setFormErrors((prev) => ({ ...prev, mobile: '' }));
    }
    if (sameAsContact) {
      setFormWhatsapp(cleaned);
    }
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setFormWhatsapp(cleaned);
    if (cleaned.length === 0 || (cleaned.length === 10 && /^[6-9]/.test(cleaned))) {
      setFormErrors((prev) => ({ ...prev, whatsapp: '' }));
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
    if (!formMobile || formMobile.length !== 10 || !/^[6-9]/.test(formMobile)) {
      setFormErrors((prev) => ({ ...prev, mobile: 'Enter a valid 10-digit contact number.' }));
      return false;
    }
    
    // Check for duplicates, excluding current member if editing
    if (isPhoneNumberExists(formMobile, editingId || undefined)) {
      setFormErrors((prev) => ({ ...prev, mobile: 'Phone number already linked to another user.' }));
      return false;
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
      
      // Check for duplicates, excluding current member if editing
      if (isPhoneNumberExists(formWhatsapp, editingId || undefined)) {
        setFormErrors((prev) => ({ ...prev, whatsapp: 'Phone number already linked to another user.' }));
        return false;
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
    setFormErrors({ name: '', mobile: '', whatsapp: '' });
    setEditingId(null);
  };

  const handleAddOrUpdateMember = () => {
    if (!validateName() || !validateMobile() || !validateWhatsapp()) {
      return;
    }

    // Only use contact number as WhatsApp if user explicitly has "Same as Contact" checked
    const finalWhatsapp = sameAsContact ? formMobile : (formWhatsapp.trim() !== '' ? formWhatsapp : '');

    const newMember: TeamMember = {
      id: editingId || Date.now().toString(),
      name: formName,
      mobile: formMobile,
      whatsapp: finalWhatsapp,
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
        setOwnersData([...ownersData, member]);
        break;
      case 'composers':
        setComposersData([...composersData, member]);
        break;
      case 'operators':
        setOperatorsData([...operatorsData, member]);
        break;
    }
  };

  const updateMemberInTab = (member: TeamMember) => {
    switch (activeTab) {
      case 'owners':
        setOwnersData(ownersData.map((m) => (m.id === member.id ? member : m)));
        break;
      case 'composers':
        setComposersData(composersData.map((m) => (m.id === member.id ? member : m)));
        break;
      case 'operators':
        setOperatorsData(operatorsData.map((m) => (m.id === member.id ? member : m)));
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
              setOwnersData(ownersData.filter((m) => m.id !== id));
              break;
            case 'composers':
              setComposersData(composersData.filter((m) => m.id !== id));
              break;
            case 'operators':
              setOperatorsData(operatorsData.filter((m) => m.id !== id));
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
    setSameAsContact(member.mobile === member.whatsapp);
    setEditingId(member.id);
    setShowModal(true);
  };

  const handleOpenModal = () => {
    resetForm();
    setShowContacts(false);
    setShowModal(true);
  };

  // Add this function to TeamManagementScreen
  const [contacts, setContacts] = useState<any[]>([]);
  const [showContacts, setShowContacts] = useState(false);

  const handleOpenContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      setContacts(data);
      setShowContacts(true);
    }
  };

  const handleSelectContact = (contact: any) => {
    if (contact.name) {
      setFormName(contact.name);
    }
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setFormMobile(contact.phoneNumbers[0].number.replace(/\D/g, '').slice(-10));
    }
    setShowContacts(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={[scss.header, darkMode && scss.headerDark]}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={scss.headerTitle}>Team Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]} edges={['bottom']}>
      <View style={[scss.container, darkMode && scss.containerDark]}>
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
              <Text style={[scss.emptyStateText, darkMode && scss.emptyStateTextDark]}>{getEmptyStateText()}</Text>
            </View>
          ) : (
            <View>
              {getTabData().map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[
                    scss.memberCard,
                    { borderColor: '#7C3AED', borderWidth: 1.5, backgroundColor: '#F8F7FF' },
                    darkMode && { backgroundColor: '#312E81', borderColor: '#A78BFA' },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => handleEditMember(member)}
                >
                  <View style={scss.memberInfo}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#7C3AED', marginBottom: 2 }}>{member.name}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>Contact: {member.mobile}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 2 }}>WhatsApp: {member.whatsapp || 'NA'}</Text>
                    <View style={{ backgroundColor: '#EDE9FE', borderRadius: 12, paddingVertical: 4, paddingHorizontal: 12, alignSelf: 'flex-start', marginTop: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: '#7C3AED' }}>{member.role}</Text>
                    </View>
                  </View>
                  <View style={scss.memberActions}>
                    <TouchableOpacity
                      style={scss.editBtn}
                      onPress={() => handleEditMember(member)}
                    >
                      <Ionicons name="pencil-outline" size={18} color="#6B7280" />
                    </TouchableOpacity>
                    {member.id !== 'primary-owner' && (
                      <TouchableOpacity
                        style={scss.deleteBtn}
                        onPress={() => handleDeleteMember(member.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={darkMode ? '#FCA5A5' : '#EF4444'} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Add Member Button - Always show after members list */}
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30, marginBottom: 20 }}>
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
              onPress={handleOpenModal}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={[{ fontSize: 15, fontWeight: '700', color: '#7C3AED', marginTop: 8 }, darkMode && { color: '#A78BFA' }]}>{getAddButtonText()}</Text>
          </View>
        </ScrollView>

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
                  <View style={scss.formGroup}>
                    <Text style={[scss.label, darkMode && scss.labelDark]}>Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
                    <View style={{ position: 'relative', marginBottom: 20 }}>
                      <TextInput
                        style={[scss.input, { height: 54, fontSize: 18, paddingHorizontal: 18, paddingRight: 44 }, darkMode && scss.inputDark, formErrors.name && scss.inputError]}
                        placeholder="Enter full name"
                        value={formName}
                        onChangeText={handleNameChange}
                        placeholderTextColor="#9CA3AF"
                        maxLength={30}
                      />
                      <TouchableOpacity
                        style={{ position: 'absolute', right: 10, top: 0, height: '100%', justifyContent: 'center' }}
                        onPress={handleOpenContacts}
                      >
                        <Ionicons name="person-circle-outline" size={24} color="#A1A1AA" />
                      </TouchableOpacity>
                      {showContacts && (
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}>
                          <TouchableOpacity
                            activeOpacity={1}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                            onPress={() => setShowContacts(false)}
                          />
                          <View style={{ position: 'absolute', top: 60, left: 0, right: 0, maxHeight: 220, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
                            <ScrollView>
                              {contacts.map((contact, idx) => (
                                <TouchableOpacity key={idx} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }} onPress={() => handleSelectContact(contact)}>
                                  <Text>{contact.name} {contact.phoneNumbers && contact.phoneNumbers.length > 0 ? `(${contact.phoneNumbers[0].number})` : ''}</Text>
                                </TouchableOpacity>
                              ))}
                            </ScrollView>
                          </View>
                        </View>
                      )}
                    </View>
                    {formErrors.name && <Text style={scss.errorText}>{formErrors.name}</Text>}
                  </View>

                  {/* Contact Number and WhatsApp Number with Toggle */}
                  <View style={scss.rowGroup}>
                    {/* Contact Number */}
                    <View style={scss.halfWidth}>
                      <Text style={[scss.label, darkMode && scss.labelDark]}>
                        Contact Number <Text style={{ color: '#EF4444' }}>*</Text>
                      </Text>
                      <TextInput
                        style={[scss.input, darkMode && scss.inputDark, formErrors.mobile && scss.inputError]}
                        placeholder="9876543210"
                        value={formMobile}
                        onChangeText={handleMobileChange}
                        keyboardType="phone-pad"
                        placeholderTextColor="#9CA3AF"
                        maxLength={10}
                      />
                      {formErrors.mobile && <Text style={scss.errorText}>{formErrors.mobile}</Text>}
                    </View>

                    {/* WhatsApp Number with Toggle Below */}
                    <View style={scss.halfWidth}>
                      <Text style={[scss.label, darkMode && scss.labelDark]}>
                        WhatsApp Number
                      </Text>
                      <TextInput
                        style={[scss.input, darkMode && scss.inputDark, formErrors.whatsapp && scss.inputError]}
                        placeholder="9876543210"
                        value={formWhatsapp}
                        onChangeText={handleWhatsappChange}
                        keyboardType="phone-pad"
                        editable={!sameAsContact}
                        placeholderTextColor="#9CA3AF"
                        maxLength={10}
                      />
                      {formErrors.whatsapp ? (
                        <Text style={scss.errorText}>{formErrors.whatsapp}</Text>
                      ) : null}
                      
                      {/* Same as Contact Toggle Below WhatsApp */}
                      <View style={scss.toggleBelowWrapper}>
                        <View style={scss.switchOutlineWrapper}>
                          <Switch
                            value={sameAsContact}
                            onValueChange={handleToggleSameAsContact}
                            trackColor={{ false: '#E5E7EB', true: (formMobile === formWhatsapp && formMobile.length === 10) ? '#A855F7' : '#E5E7EB' }}
                            thumbColor={sameAsContact ? '#fff' : '#fff'}
                          />
                        </View>
                        <Text style={[scss.toggleLabelSmall, darkMode && scss.toggleLabelSmallDark]}>Same as Contact</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Actions */}
                <View style={[scss.modalActions, darkMode && scss.modalActionsDark]}>
                  <TouchableOpacity style={scss.submitBtn} onPress={handleAddOrUpdateMember}>
                    <Text style={scss.submitBtnText}>{editingId ? 'Update' : 'Add Member'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
      </SafeAreaView>
    </View>
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
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    height: 64,
  },
  headerDark: {
    backgroundColor: '#5B21B6',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
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
  addIconButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addIcon: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '300',
  },
  addButtonLabel: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#7C3AED',
  },
  addButtonLabelDark: {
    color: '#A78BFA',
  },
  addMemberBelowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    marginTop: 20,
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
    backgroundColor: '#7C3AED',
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
    fontSize: 24,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  labelDark: {
    color: '#F3F4F6',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 16,
    color: '#111827',
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
    marginTop: 6,
    marginBottom: 10,
    fontWeight: '500',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  formGroup: {
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  switchOutlineWrapper: {
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 24,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  toggleLabelDark: {
    color: '#F3F4F6',
  },
  toggleBelowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 12,
  },
  toggleLabelSmall: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  toggleLabelSmallDark: {
    color: '#D1D5DB',
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
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalActionsDark: {
    borderTopColor: '#4B5563',
  },
  submitBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputIconBtn: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
});

export default TeamManagementScreen;
