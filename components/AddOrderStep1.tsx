import * as Contacts from 'expo-contacts';
import React, { useRef, useState } from 'react';
import { Modal, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [contactSearch, setContactSearch] = useState('');
  // Order items state
  const [orderItems, setOrderItems] = useState([
    {
      orderType: '',
      quantity: '',
      dimension: '',
      ink: '',
      printingType: '',
      totalAmount: '',
      advancePayment: '',
      pendingAmount: '',
      attachment: '',
      orderForm: '',
      voiceNote: '',
    },
  ]);
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
    console.log('Phonebook icon tapped');
    setContactsError(null);
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      console.log('Contacts permission status:', status);
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] });
        console.log('Contacts data:', data);
        if (data && data.length > 0) {
          setContacts(data);
          setShowContacts(true);
        } else {
          setContactsError('No contacts found on this device.');
          setShowContacts(true);
        }
      } else {
        setContactsError('Permission to access contacts was denied.');
        setShowContacts(true);
      }
    } catch (err) {
      console.log('Contacts error:', err);
      setContactsError('Failed to load contacts. Please try again.');
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
      {/* Green status bar for order status update */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 18, marginTop: 18, marginBottom: 24 }}>
        <View style={{ flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ width: showOrderFields ? '100%' : '40%', height: 6, backgroundColor: '#22C55E', borderRadius: 3 }} />
        </View>
      </View>
      <View style={{ flex: 1 }}>
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
              <Ionicons name="person-circle-outline" size={22} color="#22C55E" />
            </TouchableOpacity>
          </View>
          <Modal
            visible={showContacts}
            animationType="fade"
            transparent
            onRequestClose={() => setShowContacts(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' }}
              onPress={() => setShowContacts(false)}
            />
            <View style={{ position: 'absolute', top: 60, left: 16, right: 16, maxHeight: 220, backgroundColor: '#fff', borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
              {contactsError ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                  <Text style={{ color: '#EF4444', fontWeight: '600', fontSize: 16 }}>{contactsError}</Text>
                </View>
              ) : (
                <View>
                          <View style={{ backgroundColor: '#fff', borderRadius: 16, margin: 8, paddingBottom: 4, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 }}>
                            <TextInput
                              style={{ margin: 12, marginBottom: 0, padding: 12, borderRadius: 12, backgroundColor: '#F3F4F6', fontSize: 16, fontWeight: '500', borderWidth: 0 }}
                              placeholder="Search contacts..."
                              value={contactSearch}
                              onChangeText={setContactSearch}
                              placeholderTextColor="#A1A1AA"
                            />
                            <ScrollView style={{ maxHeight: 180 }}>
                              {contacts
                                .filter(contact =>
                                  contact.name.toLowerCase().includes(contactSearch?.toLowerCase() || '') ||
                                  (contact.phoneNumbers && contact.phoneNumbers.some(pn => pn.number.includes(contactSearch)))
                                )
                                .map((contact, idx) => (
                                  <TouchableOpacity
                                    key={idx}
                                    style={{ paddingVertical: 16, paddingHorizontal: 18, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}
                                    onPress={() => handleSelectContact(contact)}
                                  >
                                    <Text style={{ fontWeight: '700', fontSize: 17, color: '#222' }}>
                                      {contact.name}
                                      {contact.phoneNumbers && contact.phoneNumbers.length > 0 ? ' ' : ''}
                                    </Text>
                                    {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
                                      <Text style={{ fontWeight: '400', fontSize: 15, color: '#222', marginTop: 2 }}>
                                        {contact.phoneNumbers.map(pn => pn.number).join(', ')}
                                      </Text>
                                    )}
                                  </TouchableOpacity>
                                ))}
                            </ScrollView>
                          </View>
                </View>
              )}
            </View>
          </Modal>
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
          <>
            {orderItems.map((item, idx) => (
              <View style={scss.card} key={idx}>
                <View style={{ marginBottom: 12, marginTop: 8, alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#111827' }}>
                    Order #{idx + 1}
                  </Text>
                  <View style={{ height: 2, backgroundColor: '#22C55E', width: '40%', marginTop: 8, borderRadius: 2 }} />
                </View>
                <Text style={scss.label}>Order Type</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Order type"
                  value={item.orderType}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].orderType = text;
                    setOrderItems(newItems);
                  }}
                />
                <Text style={scss.label}>Quantity</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Quantity"
                  value={item.quantity}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].quantity = text;
                    setOrderItems(newItems);
                  }}
                  keyboardType="numeric"
                />
                <Text style={scss.label}>Dimension</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Dimension (e.g., 10x12)"
                  value={item.dimension}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].dimension = text;
                    setOrderItems(newItems);
                  }}
                />
                <Text style={scss.label}>Ink</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Ink colors"
                  value={item.ink}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].ink = text;
                    setOrderItems(newItems);
                  }}
                />
                <Text style={scss.label}>Printing Type</Text>
                <TouchableOpacity style={scss.dropdown}>
                  <Text style={scss.dropdownText}>{item.printingType || 'Select printing type'}</Text>
                  <Ionicons name="chevron-down" size={18} color="#6B7280" />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={scss.label}>Total Amount *</Text>
                    <TextInput
                      style={scss.input}
                      placeholder="e.g., 5000"
                      value={item.totalAmount}
                      onChangeText={text => {
                        const newItems = [...orderItems];
                        newItems[idx].totalAmount = text.replace(/[^0-9]/g, '');
                        // Update pending amount
                        const total = parseInt(newItems[idx].totalAmount || '0', 10);
                        const advance = parseInt(newItems[idx].advancePayment || '0', 10);
                        newItems[idx].pendingAmount = (total - advance).toString();
                        setOrderItems(newItems);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={scss.label}>Advance Payment</Text>
                    <TextInput
                      style={scss.input}
                      placeholder="e.g., 1000"
                      value={item.advancePayment}
                      onChangeText={text => {
                        const newItems = [...orderItems];
                        newItems[idx].advancePayment = text.replace(/[^0-9]/g, '');
                        // Update pending amount
                        const total = parseInt(newItems[idx].totalAmount || '0', 10);
                        const advance = parseInt(newItems[idx].advancePayment || '0', 10);
                        newItems[idx].pendingAmount = (total - advance).toString();
                        setOrderItems(newItems);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                  <Text style={{ color: '#6B7280', fontWeight: '500', fontSize: 15 }}>Balance Left</Text>
                  <Text style={{ color: '#DC2626', fontWeight: '700', fontSize: 18, marginTop: 2 }}>Rs. {item.pendingAmount || '0'}</Text>
                </View>
                <Text style={scss.label}>Attachment</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Attachment (optional)"
                  value={item.attachment}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].attachment = text;
                    setOrderItems(newItems);
                  }}
                />
                <Text style={scss.label}>Order Form</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Order form (optional)"
                  value={item.orderForm}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].orderForm = text;
                    setOrderItems(newItems);
                  }}
                />
                <Text style={scss.label}>Voice Note</Text>
                <TextInput
                  style={scss.input}
                  placeholder="Voice note (optional)"
                  value={item.voiceNote}
                  onChangeText={text => {
                    const newItems = [...orderItems];
                    newItems[idx].voiceNote = text;
                    setOrderItems(newItems);
                  }}
                />
              </View>
            ))}
          </>
        )}

      </ScrollView>
      {/* Floating action buttons for Place Order and Add Another Item */}
      {showOrderFields && (
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', zIndex: 100, paddingBottom: 0, backgroundColor: 'transparent' }} pointerEvents="box-none">
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: '#F3F4F6',
            borderRadius: 32,
            paddingHorizontal: 0,
            paddingVertical: 16,
            marginRight: 12,
            shadowColor: '#000',
            shadowOpacity: 0.10,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: '#DB2777',
            minWidth: 150,
            maxWidth: 180,
          }} onPress={() => setOrderItems([...orderItems, {
            orderType: '',
            quantity: '',
            dimension: '',
            ink: '',
            printingType: '',
            totalAmount: '',
            advancePayment: '',
            pendingAmount: '',
            attachment: '',
            orderForm: '',
            voiceNote: '',
          }])}>
            <Text style={{ color: '#DB2777', fontWeight: '700', fontSize: 17 }}>+ Add More</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{
            flex: 1,
            backgroundColor: '#22C55E',
            borderRadius: 32,
            paddingHorizontal: 0,
            paddingVertical: 16,
            shadowColor: '#000',
            shadowOpacity: 0.12,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 2 },
            elevation: 4,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            borderWidth: 2,
            borderColor: '#22C55E',
            minWidth: 150,
            maxWidth: 180,
          }} onPress={onNext}>
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>Place Order</Text>
            <Ionicons name="checkmark" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      )}
      </View>
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
