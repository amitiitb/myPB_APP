import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
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

const { width } = Dimensions.get('window');

const BusinessProfileStepOne: React.FC = () => {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [ownerName, setOwnerName] = useState('');
  const [pressName, setPressName] = useState('');
  const [contactNumber, setContactNumber] = useState(phoneNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [sameAsContact, setSameAsContact] = useState(false);
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const [formErrors, setFormErrors] = useState({
    ownerName: '',
    pressName: '',
    address: '',
    gstin: '',
  });

  const scrollViewRef = React.useRef<ScrollView>(null);

  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  const handleToggleSameAsContact = () => {
    setSameAsContact((prev) => {
      const next = !prev;
      if (next) {
        setWhatsappNumber(contactNumber);
      } else {
        setWhatsappNumber('');
      }
      return next;
    });
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

  const handleAddressChange = (text: string) => {
    if (text.length <= 60) {
      setAddress(text);
    }
  };

  const handleGstinChange = (text: string) => {
    const cleaned = text.toUpperCase().slice(0, 15);
    setGstin(cleaned);
  };

  const validateOwnerName = () => {
    if (!ownerName.trim()) {
      setFormErrors((prev) => ({ ...prev, ownerName: "Owner's name is required (max 30 characters)." }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, ownerName: '' }));
    return true;
  };

  const validatePressName = () => {
    if (!pressName.trim()) {
      setFormErrors((prev) => ({ ...prev, pressName: "Press name is required (max 30 characters)." }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, pressName: '' }));
    return true;
  };

  const validateGstin = () => {
    if (gstin && !GSTIN_REGEX.test(gstin)) {
      setFormErrors((prev) => ({ ...prev, gstin: 'Enter a valid 15-character GSTIN.' }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, gstin: '' }));
    return true;
  };

  const handleNext = () => {
    const isOwnerNameValid = validateOwnerName();
    const isPressNameValid = validatePressName();
    const isGstinValid = validateGstin();

    if (!isOwnerNameValid || !isPressNameValid || !isGstinValid) {
      // Scroll to top to show errors
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    // Navigate to next step with owner data
    router.push({
      pathname: '/BusinessProfileStepTwo',
      params: {
        ownerName: ownerName.trim(),
        phoneNumber: contactNumber,
        whatsappNumber: whatsappNumber,
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Header Section */}
          <Text style={styles.title}>Business Profile Setup</Text>
          <Text style={styles.subtitle}>Step 1 of 3: Account Creation</Text>

          {/* Form Fields */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Owner's Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
              <TextInput
                style={[styles.input, formErrors.ownerName && styles.inputError]}
                placeholder="e.g., Sunil Kumar"
                value={ownerName}
                onChangeText={setOwnerName}
                onBlur={validateOwnerName}
                placeholderTextColor="#9CA3AF"
                maxLength={30}
              />
              {formErrors.ownerName ? <Text style={styles.errorText}>{formErrors.ownerName}</Text> : null}
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Press Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
              <TextInput
                style={[styles.input, formErrors.pressName && styles.inputError]}
                placeholder="e.g., Kumar Printers"
                value={pressName}
                onChangeText={setPressName}
                onBlur={validatePressName}
                placeholderTextColor="#9CA3AF"
                maxLength={30}
              />
              {formErrors.pressName ? <Text style={styles.errorText}>{formErrors.pressName}</Text> : null}
            </View>
          </View>

          {/* Contact Number + WhatsApp Number Row */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>Contact Number</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                placeholder="9879879870"
                value={contactNumber}
                onChangeText={handleContactChange}
                keyboardType="phone-pad"
                placeholderTextColor="#9CA3AF"
                editable={false}
                maxLength={10}
              />
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.label}>WhatsApp Number</Text>
              <TextInput
                style={styles.input}
                placeholder="9879879870"
                value={whatsappNumber}
                onChangeText={handleWhatsappChange}
                keyboardType="phone-pad"
                editable={!sameAsContact}
                placeholderTextColor="#9CA3AF"
                maxLength={10}
              />
            </View>
          </View>

          {/* Same as Contact Toggle Below WhatsApp */}
          <View style={styles.toggleRow}>
            <Switch
              value={sameAsContact}
              onValueChange={handleToggleSameAsContact}
              trackColor={{ false: '#E5E7EB', true: '#A855F7' }}
              thumbColor={sameAsContact ? '#fff' : '#fff'}
            />
            <Text style={styles.toggleLabel}>Same as Contact</Text>
          </View>

          {/* Address (Map Location) */}
          <View style={styles.fullRow}>
            <Text style={styles.label}>Address (Map Location)</Text>
            <View style={styles.inputIconWrapper}>
              <TextInput
                style={[styles.textArea, { paddingRight: 36 }]}
                placeholder="Search for your business address"
                value={address}
                onChangeText={handleAddressChange}
                placeholderTextColor="#9CA3AF"
                multiline={true}
                maxLength={60}
                numberOfLines={3}
              />
              <Ionicons name="location-outline" size={20} color="#A855F7" style={styles.inputIconTextArea} />
            </View>
            <Text style={styles.helperText}>Max 60 characters. ({60 - address.length} remaining)</Text>
          </View>

          {/* GSTIN (Optional) */}
          <View style={styles.fullRow}>
            <Text style={styles.label}>GSTIN (Optional)</Text>
            <TextInput
              style={[styles.input, formErrors.gstin && styles.inputError]}
              placeholder="Enter your GST number"
              value={gstin}
              onChangeText={handleGstinChange}
              onBlur={validateGstin}
              placeholderTextColor="#9CA3AF"
              maxLength={15}
              autoCapitalize="characters"
            />
            {formErrors.gstin ? <Text style={styles.errorText}>{formErrors.gstin}</Text> : null}
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <LinearGradient
              colors={['#A855F7', '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>Next →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  gridCol: {
    flex: 1,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    marginBottom: 4,
    color: '#111827',
  },
  textArea: {
    minHeight: 72,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
    color: '#111827',
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginBottom: 0,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  fullRow: {
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginLeft: '52%',
  },
  toggleLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 6,
  },
  inputIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
    top: 14,
  },
  inputIconTextArea: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  nextBtn: {
    marginTop: 24,
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
  nextBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BusinessProfileStepOne;
