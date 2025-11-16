import React, { useState } from 'react';
import { Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AddOrderStep1Props {
  onNext: () => void;
  topNavBar?: React.ReactNode;
}

const AddOrderStep1: React.FC<AddOrderStep1Props> = ({ onNext, topNavBar }) => {
  const [customerName, setCustomerName] = useState('');
  const [type, setType] = useState('Individual');
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsContact, setSameAsContact] = useState(false);
  const [contactError, setContactError] = useState('');
  const [whatsappError, setWhatsappError] = useState('');
  const [address, setAddress] = useState('');

  const handleSameAsContact = (value: boolean) => {
    setSameAsContact(value);
    if (value) setWhatsappNumber(contactNumber);
    else setWhatsappNumber('');
  };

  const handleContactChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setContactNumber(cleaned);
    if (sameAsContact) setWhatsappNumber(cleaned);
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setWhatsappNumber(cleaned);
  };

  return (
    <View style={scss.container}>
      {/* Top Nav Bar (injected for consistency) */}
      {topNavBar ? (
        topNavBar
      ) : (
        <View style={scss.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={scss.headerTitle}>Customer Information</Text>
          <Text style={scss.headerStep}>1/3</Text>
        </View>
      )}
      {/* Form Card */}
      <View style={scss.card}>
        <Text style={scss.label}>Customer Name</Text>
        <View style={scss.inputRow}>
          <TextInput
            style={scss.input}
            placeholder="Name"
            value={customerName}
            onChangeText={setCustomerName}
          />
          <TouchableOpacity style={scss.inputIconBtn}>
            <Ionicons name="calendar-outline" size={20} color="#A1A1AA" />
          </TouchableOpacity>
        </View>
        <Text style={scss.label}>Type</Text>
        <TouchableOpacity style={scss.dropdown}>
          <Text style={scss.dropdownText}>{type}</Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </TouchableOpacity>
        <View style={scss.row}>
          <View style={{ flex: 1 }}>
            <Text style={[scss.label, { marginBottom: 2 }]}>Contact Number *</Text>
            <TextInput
              style={[scss.outlinedBox, scss.outlinedText]}
              placeholder="e.g., 9876543210"
              keyboardType="phone-pad"
              value={contactNumber}
              onChangeText={handleContactChange}
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <View style={{ width: 16 }} />
          <View style={{ flex: 1 }}>
            <Text style={[scss.label, { marginBottom: 2 }]}>WhatsApp Number</Text>
            <TextInput
              style={[scss.outlinedBox, scss.outlinedText]}
              placeholder="e.g., 9876543210"
              keyboardType="phone-pad"
              value={whatsappNumber}
              onChangeText={handleWhatsappChange}
              editable={!sameAsContact}
              maxLength={10}
              placeholderTextColor="#9CA3AF"
            />
            <View style={scss.sameRow}>
              <Switch
                value={sameAsContact}
                onValueChange={handleSameAsContact}
                thumbColor={sameAsContact ? '#7C3AED' : '#ccc'}
                trackColor={{ true: '#E9D5FF', false: '#E5E7EB' }}
              />
              <Text style={scss.sameLabel}>Same as contact</Text>
            </View>
          </View>
        </View>
        <Text style={scss.label}>Address (Optional)</Text>
        <TextInput
          style={scss.textarea}
          placeholder="Enter customer's address"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />
      </View>
      {/* Next Step Button */}
      <View style={scss.nextBtnContainer}>
        <TouchableOpacity style={scss.nextBtn} onPress={onNext}>
          <Text style={scss.nextBtnText}>Next Step</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const scss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
  headerStep: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  label: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#374151',
  },
  outlinedBox: {
    minHeight: 44,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  outlinedText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },
  underline: {
    height: 2,
    backgroundColor: '#E5E7EB',
    marginTop: 2,
    borderRadius: 2,
  },
  inputIconBtn: {
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    height: 44,
    marginBottom: 8,
    marginTop: 2,
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  sameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  sameLabel: {
    marginLeft: 8,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  textarea: {
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#374151',
    minHeight: 60,
    textAlignVertical: 'top',
    marginTop: 2,
  },
  nextBtnContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899',
    borderRadius: 32,
    paddingHorizontal: 32,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  nextBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 17,
  },
});

export default AddOrderStep1;
