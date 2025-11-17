import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

interface MyProfileScreenProps {
  onBack: () => void;
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  pressName?: string;
  email?: string;
}

const MyProfileScreen: React.FC<MyProfileScreenProps> = ({
  onBack,
  ownerName = 'Account Owner',
  ownerPhone = '9876543210',
  ownerWhatsapp,
  pressName = 'Press Name',
  email = '',
}) => {
  const { darkMode } = useTheme();
  const [editOwnerName, setEditOwnerName] = useState(ownerName);
  const [editBusinessName, setEditBusinessName] = useState(pressName);
  const [editContact, setEditContact] = useState(ownerPhone);
  const [editWhatsapp, setEditWhatsapp] = useState(ownerWhatsapp || ownerPhone);
  const [sameAsContact, setSameAsContact] = useState(false);
  const [showNameEdit, setShowNameEdit] = useState(false);
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [editEmail, setEditEmail] = useState(email);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAddressChange = (text: string) => {
    if (text.length <= 100) {
      setAddress(text);
      setHasChanges(true);
    }
  };

  const handleGstinChange = (text: string) => {
    const cleaned = text.toUpperCase().slice(0, 15);
    setGstin(cleaned);
    setHasChanges(true);
  };

  const handleEmailChange = (text: string) => {
    setEditEmail(text);
    setHasChanges(true);
  };

  const handleOwnerNameChange = (text: string) => {
    setEditOwnerName(text);
    setHasChanges(true);
  };

  const handleBusinessNameChange = (text: string) => {
    setEditBusinessName(text);
    setHasChanges(true);
  };

  const handleContactChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setEditContact(cleaned);
    setHasChanges(true);
    if (sameAsContact) {
      setEditWhatsapp(cleaned);
    }
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setEditWhatsapp(cleaned);
    setHasChanges(true);
  };

  const handleToggleSameAsContact = () => {
    setSameAsContact((prev) => {
      const next = !prev;
      if (next) {
        setEditWhatsapp(editContact);
      }
      return next;
    });
  };

  const handleCancel = () => {
    setEditOwnerName(ownerName);
    setEditBusinessName(pressName);
    setEditContact(ownerPhone);
    setEditWhatsapp(ownerWhatsapp || ownerPhone);
    setEditEmail(email);
    setAddress('');
    setGstin('');
    setSameAsContact(false);
    setShowNameEdit(false);
    setHasChanges(false);
  };

  const handleSave = () => {
    // Save logic here
    setHasChanges(false);
    setShowNameEdit(false);
  };

  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      {/* Header */}
      <View style={[scss.header, darkMode && scss.headerDark]}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={scss.headerTitle}>My Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Info Card */}
        <View style={[scss.card, darkMode && scss.cardDark]}>
          <View style={scss.profileHeader}>
            <View style={[scss.avatar, darkMode && scss.avatarDark]}>
              <Ionicons name="person" size={40} color="#7C3AED" />
            </View>
            <View style={scss.headerInfo}>
              <View style={scss.nameEditContainer}>
                <Text style={[scss.ownerNameText, darkMode && scss.ownerNameTextDark]}>{ownerName}</Text>
                <TouchableOpacity style={scss.editIconButton} onPress={() => setShowNameEdit(true)}>
                  <Ionicons name="pencil" size={16} color="#7C3AED" />
                </TouchableOpacity>
              </View>
              <Text style={[scss.pressNameText, darkMode && scss.pressNameTextDark]}>{pressName}</Text>
            </View>
          </View>
        </View>

        {/* Business Information Section */}
        <View style={[scss.card, darkMode && scss.cardDark]}>
          <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Business Information</Text>

          {/* Contact Number */}
          <View style={scss.fieldGroup}>
            <Text style={[scss.fieldLabel, darkMode && scss.fieldLabelDark]}>Contact Number</Text>
            <View style={[scss.phoneDisplayWrapper, darkMode && scss.phoneDisplayWrapperDark]}>
              <Text style={[scss.countryCodeDisplay, darkMode && scss.countryCodeDisplayDark]}>🇮🇳 +91</Text>
              <TextInput
                style={[scss.phoneInputDisplay, darkMode && scss.phoneInputDisplayDark]}
                value={ownerPhone}
                editable={false}
              />
            </View>
          </View>

          {/* WhatsApp Number */}
          <View style={scss.fieldGroup}>
            <Text style={[scss.fieldLabel, darkMode && scss.fieldLabelDark]}>WhatsApp Number</Text>
            <View style={[scss.phoneDisplayWrapper, darkMode && scss.phoneDisplayWrapperDark]}>
              <Text style={[scss.countryCodeDisplay, darkMode && scss.countryCodeDisplayDark]}>🇮🇳 +91</Text>
              <TextInput
                style={[scss.phoneInputDisplay, darkMode && scss.phoneInputDisplayDark]}
                value={ownerWhatsapp || ownerPhone}
                editable={false}
              />
            </View>
          </View>
        </View>

        {/* Editable Information Section */}
        <View style={[scss.card, darkMode && scss.cardDark]}>
          <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>Additional Information</Text>

          {/* Email Address */}
          <View style={scss.fieldGroup}>
            <Text style={[scss.fieldLabel, darkMode && scss.fieldLabelDark]}>Email Address (Optional)</Text>
            <TextInput
              style={[scss.textInput, darkMode && scss.textInputDark]}
              placeholder="Enter your email address"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
              value={editEmail}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              editable={true}
            />
          </View>

          {/* Address */}
          <View style={scss.fieldGroup}>
            <Text style={[scss.fieldLabel, darkMode && scss.fieldLabelDark]}>Address (Map Location)</Text>
            <View style={[scss.textAreaWrapper, darkMode && scss.textAreaWrapperDark]}>
              <TextInput
                style={[scss.textArea, darkMode && scss.textAreaDark]}
                placeholder="Search for your business address"
                placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                value={address}
                onChangeText={handleAddressChange}
                multiline={true}
                maxLength={100}
                numberOfLines={2}
                editable={true}
              />
              <Ionicons name="location-outline" size={18} color="#A855F7" style={scss.fieldIcon} />
            </View>
            <Text style={[scss.helperText, darkMode && scss.helperTextDark]}>Max 100 characters. ({100 - address.length} remaining)</Text>
          </View>

          {/* GSTIN */}
          <View style={scss.fieldGroup}>
            <Text style={[scss.fieldLabel, darkMode && scss.fieldLabelDark]}>GSTIN Number (Optional)</Text>
            <TextInput
              style={[scss.textInput, darkMode && scss.textInputDark]}
              placeholder="e.g., 22AAAAAA0000A1Z5"
              placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
              value={gstin}
              onChangeText={handleGstinChange}
              maxLength={15}
              autoCapitalize="characters"
              editable={true}
            />
          </View>
        </View>

        {/* Save Button */}
        {hasChanges && (
          <View style={scss.actionButtonsContainer}>
            <TouchableOpacity style={[scss.cancelBtn, darkMode && scss.cancelBtnDark]} onPress={handleCancel}>
              <Text style={[scss.cancelBtnText, darkMode && scss.cancelBtnTextDark]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={scss.saveBtn} onPress={handleSave}>
              <Text style={scss.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Edit Owner Name and Business Name Modal */}
      <Modal visible={showNameEdit} animationType="slide" transparent={true}>
        <View style={scss.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={scss.modalContainer}
          >
            <View style={[scss.modalContent, darkMode && scss.modalContentDark]}>
              <View style={scss.modalHeader}>
                <Text style={[scss.modalTitle, darkMode && scss.modalTitleDark]}>Edit Profile</Text>
                <TouchableOpacity onPress={() => {
                  setShowNameEdit(false);
                  handleCancel();
                }}>
                  <Ionicons name="close" size={28} color={darkMode ? '#F3F4F6' : '#111827'} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={scss.modalScrollContent}>
                {/* Owner Name */}
                <View style={scss.formGroup}>
                  <Text style={[scss.label, darkMode && scss.labelDark]}>
                    Owner's Name <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[scss.input, darkMode && scss.inputDark]}
                    placeholder="Enter owner's name"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                    value={editOwnerName}
                    onChangeText={handleOwnerNameChange}
                    maxLength={30}
                  />
                </View>

                {/* Business Name */}
                <View style={scss.formGroup}>
                  <Text style={[scss.label, darkMode && scss.labelDark]}>
                    Business Name <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <TextInput
                    style={[scss.input, darkMode && scss.inputDark]}
                    placeholder="Enter business name"
                    placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                    value={editBusinessName}
                    onChangeText={handleBusinessNameChange}
                    maxLength={30}
                  />
                </View>

                {/* Contact Number */}
                <View style={scss.formGroup}>
                  <Text style={[scss.label, darkMode && scss.labelDark]}>
                    Contact Number <Text style={{ color: '#EF4444' }}>*</Text>
                  </Text>
                  <View style={[scss.phoneInputWrapper, darkMode && scss.phoneInputWrapperDark]}>
                    <Text style={[scss.countryCode, darkMode && scss.countryCodeDark]}>🇮🇳 +91</Text>
                    <TextInput
                      style={[scss.phoneInput, darkMode && scss.phoneInputDark]}
                      placeholder="9876543210"
                      placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                      value={editContact}
                      onChangeText={handleContactChange}
                      keyboardType="phone-pad"
                      maxLength={10}
                    />
                  </View>
                </View>

                {/* WhatsApp Number */}
                <View style={scss.formGroup}>
                  <Text style={[scss.label, darkMode && scss.labelDark]}>WhatsApp Number</Text>
                  <View style={[scss.phoneInputWrapper, darkMode && scss.phoneInputWrapperDark]}>
                    <Text style={[scss.countryCode, darkMode && scss.countryCodeDark]}>🇮🇳 +91</Text>
                    <TextInput
                      style={[scss.phoneInput, darkMode && scss.phoneInputDark]}
                      placeholder="9876543210"
                      placeholderTextColor={darkMode ? '#9CA3AF' : '#9CA3AF'}
                      value={editWhatsapp}
                      onChangeText={handleWhatsappChange}
                      keyboardType="phone-pad"
                      editable={!sameAsContact}
                      maxLength={10}
                    />
                  </View>
                  
                  {/* Same as Contact Toggle */}
                  <View style={scss.toggleWrapper}>
                    <Switch
                      value={sameAsContact}
                      onValueChange={handleToggleSameAsContact}
                      trackColor={{ false: '#E5E7EB', true: '#A855F7' }}
                      thumbColor={sameAsContact ? '#fff' : '#fff'}
                    />
                    <Text style={[scss.toggleLabel, darkMode && scss.toggleLabelDark]}>Same as Contact</Text>
                  </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={scss.modalSaveBtn} onPress={handleSave}>
                  <Text style={scss.modalSaveBtnText}>Save Changes</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    height: 64,
  },
  headerDark: {
    backgroundColor: '#6D28D9',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#374151',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarDark: {
    backgroundColor: '#4B5563',
  },
  headerInfo: {
    flex: 1,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  editIconButton: {
    padding: 4,
  },
  ownerNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  ownerNameTextDark: {
    color: '#F3F4F6',
  },
  pressNameText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pressNameTextDark: {
    color: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  fieldLabelDark: {
    color: '#F3F4F6',
  },
  textInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    color: '#111827',
  },
  textInputDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F3F4F6',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  phoneDisplayWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
  },
  phoneDisplayWrapperDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  countryCodeDisplay: {
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    color: '#111827',
  },
  countryCodeDisplayDark: {
    backgroundColor: '#4B5563',
    borderRightColor: '#6B7280',
  },
  phoneInputDisplay: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    color: '#6B7280',
    height: 48,
    fontSize: 15,
  },
  phoneInputDisplayDark: {
    color: '#9CA3AF',
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    overflow: 'hidden',
  },
  phoneInputWrapperDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
  },
  countryCode: {
    fontSize: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F9F9FF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    color: '#111827',
  },
  countryCodeDark: {
    backgroundColor: '#4B5563',
    borderRightColor: '#6B7280',
    color: '#F3F4F6',
  },
  phoneInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    color: '#111827',
    height: 48,
    fontSize: 15,
  },
  phoneInputDark: {
    color: '#F3F4F6',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  halfWidth: {
    flex: 1,
    marginBottom: 0,
  },
  textAreaWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textAreaWrapperDark: {
    borderColor: '#6B7280',
  },
  textArea: {
    minHeight: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 36,
    color: '#111827',
    textAlignVertical: 'top',
  },
  textAreaDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F3F4F6',
  },
  fieldIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  helperTextDark: {
    color: '#D1D5DB',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  cancelBtnDark: {
    borderColor: '#4B5563',
  },
  cancelBtnText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtnTextDark: {
    color: '#D1D5DB',
  },
  saveBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  // Modal styles
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
    backgroundColor: '#fff',
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
  modalContentDark: {
    backgroundColor: '#374151',
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
  modalTitleDark: {
    color: '#F3F4F6',
  },
  modalScrollContent: {
    paddingBottom: 20,
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
  labelDark: {
    color: '#F3F4F6',
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
  inputDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F3F4F6',
  },
  toggleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  toggleLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  toggleLabelDark: {
    color: '#F3F4F6',
  },
  modalSaveBtn: {
    marginTop: 24,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalSaveBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default MyProfileScreen;
