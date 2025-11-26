import * as Contacts from 'expo-contacts';
import React, { useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [showOrderFields, setShowOrderFields] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const [orderType, setOrderType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dimension, setDimension] = useState('');
  const [ink, setInk] = useState('');
  const [printingType, setPrintingType] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [advancePayment, setAdvancePayment] = useState('');
  const [pendingAmount, setPendingAmount] = useState('');
  const [attachment, setAttachment] = useState('');
  const [orderForm, setOrderForm] = useState('');
  const [voiceNote, setVoiceNote] = useState('');
  const scrollRef = useRef<ScrollView>(null);

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

  // Phone book picker logic
  const handleOpenContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
      setContacts(data);
      setShowContacts(true);
    }
  };

  const handleSelectContact = (contact: any) => {
    setCustomerName(contact.name);
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      setContactNumber(contact.phoneNumbers[0].number.replace(/\D/g, '').slice(-10));
    }
    setShowContacts(false);
  };

  const handleNextStep = () => {
    setShowOrderFields(true);
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 300);
  };

  return (
    <>
      {/* Removed extra purple safe area to avoid double purple header */}
      <ScrollView style={scss.container} ref={scrollRef}>
        {/* No header or purple space */}
        {/* Form Card: Customer Info */}
        <View style={scss.card}>
          <Text style={scss.label}>Customer Name</Text>
          <View style={{ position: 'relative', marginBottom: 20 }}>
            <TextInput
              style={[scss.input, { paddingRight: 40 }]}
              placeholder="Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
            <TouchableOpacity
              style={{ position: 'absolute', right: 10, top: 0, height: '100%', justifyContent: 'center' }}
              onPress={handleOpenContacts}
            >
              <Ionicons name="person-circle-outline" size={22} color="#A1A1AA" />
            </TouchableOpacity>
          </View>
          {showContacts && (
            <View style={{ maxHeight: 200, backgroundColor: '#fff', borderRadius: 10, marginBottom: 10 }}>
              <ScrollView>
                {contacts.map((contact, idx) => (
                  <TouchableOpacity key={idx} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }} onPress={() => handleSelectContact(contact)}>
                    <Text>{contact.name} {contact.phoneNumbers && contact.phoneNumbers.length > 0 ? `(${contact.phoneNumbers[0].number})` : ''}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          <Text style={[scss.label, { marginBottom: 2, marginTop: 10 }]}>Contact Number *</Text>
          <TextInput
            style={[scss.outlinedBox, scss.outlinedText, { marginBottom: 20 }]}
            placeholder="e.g., 9876543210"
            keyboardType="phone-pad"
            value={contactNumber}
            onChangeText={handleContactChange}
            maxLength={10}
            placeholderTextColor="#9CA3AF"
          />
          <Text style={[scss.label, { marginTop: 16, marginBottom: 2 }]}>WhatsApp Number</Text>
          <TextInput
            style={[scss.outlinedBox, scss.outlinedText, { marginBottom: 20 }]}
            placeholder="e.g., 9876543210"
            keyboardType="phone-pad"
            value={whatsappNumber}
            onChangeText={handleWhatsappChange}
            editable={!sameAsContact}
            maxLength={10}
            placeholderTextColor="#9CA3AF"
          />
          <View style={[scss.sameRow, { marginBottom: 20 }]}> 
            <Switch
              value={sameAsContact}
              onValueChange={handleSameAsContact}
              thumbColor={sameAsContact ? '#7C3AED' : '#ccc'}
              trackColor={{ true: '#E9D5FF', false: '#E5E7EB' }}
            />
            <Text style={scss.sameLabel}>Same as contact</Text>
          </View>
          <Text style={scss.label}>Address (Optional)</Text>
          <TextInput
            style={[scss.textarea, { marginBottom: 20 }]}
            placeholder="Enter customer's address"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={3}
          />
        </View>
        {/* Next Step Button */}
        {!showOrderFields && (
          <View style={scss.nextBtnContainer}>
            <TouchableOpacity style={scss.nextBtn} onPress={handleNextStep}>
              <Text style={scss.nextBtnText}>Next Step</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        )}
        {/* Step 2: Order Info */}
        {showOrderFields && (
          <View style={scss.card}>
            {/* ...existing code... */}
            <Text style={scss.label}>Order Type</Text>
            <TextInput
              style={scss.input}
              placeholder="Order type"
              value={orderType}
              onChangeText={setOrderType}
            />
            <Text style={scss.label}>Quantity</Text>
            <TextInput
              style={scss.input}
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <Text style={scss.label}>Dimension</Text>
            <TextInput
              style={scss.input}
              placeholder="Dimension (e.g., 10x12)"
              value={dimension}
              onChangeText={setDimension}
            />
            <Text style={scss.label}>Ink</Text>
            <TextInput
              style={scss.input}
              placeholder="Ink colors"
              value={ink}
              onChangeText={setInk}
            />
            <Text style={scss.label}>Printing Type</Text>
            <TouchableOpacity style={scss.dropdown}>
              <Text style={scss.dropdownText}>{printingType || 'Select printing type'}</Text>
              <Ionicons name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>
            <Text style={scss.label}>Total Amount</Text>
            <TextInput
              style={scss.input}
              placeholder="Total amount"
              value={totalAmount}
              onChangeText={setTotalAmount}
              keyboardType="numeric"
            />
            <Text style={scss.label}>Advance Payment</Text>
            <TextInput
              style={scss.input}
              placeholder="Advance payment"
              value={advancePayment}
              onChangeText={setAdvancePayment}
              keyboardType="numeric"
            />
            <Text style={scss.label}>Pending Amount</Text>
            <TextInput
              style={scss.input}
              placeholder="Pending amount"
              value={pendingAmount}
              onChangeText={setPendingAmount}
              keyboardType="numeric"
            />
            <Text style={scss.label}>Attachment</Text>
            <TextInput
              style={scss.input}
              placeholder="Attachment (optional)"
              value={attachment}
              onChangeText={setAttachment}
            />
            <Text style={scss.label}>Order Form</Text>
            <TextInput
              style={scss.input}
              placeholder="Order form (optional)"
              value={orderForm}
              onChangeText={setOrderForm}
            />
            <Text style={scss.label}>Voice Note</Text>
            <TextInput
              style={scss.input}
              placeholder="Voice note (optional)"
              value={voiceNote}
              onChangeText={setVoiceNote}
            />
            <View style={scss.nextBtnContainer}>
              <TouchableOpacity style={scss.nextBtn} onPress={onNext}>
                <Text style={scss.nextBtnText}>Place Order</Text>
                <Ionicons name="checkmark" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const scss = StyleSheet.create({
  safeAreaPurple: {
    backgroundColor: '#7C3AED',
    height: Platform.OS === 'ios' ? 48 : 24,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    paddingTop: 0,
  },
  headerOrders: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    paddingTop: 32,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    justifyContent: 'flex-start',
    minHeight: 80,
  },
  headerTitleOrders: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  headerBackBtn: {
    marginRight: 10,
    padding: 4,
    borderRadius: 8,
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
    height: 54,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 18,
    fontSize: 18,
    color: '#374151',
  },
  outlinedBox: {
    minHeight: 54,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  outlinedText: {
    fontSize: 18,
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
