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
  const [formErrors, setFormErrors] = useState({
    ownerName: '',
    pressName: '',
  });

  const scrollViewRef = React.useRef<ScrollView>(null);

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
      setFormErrors((prev) => ({ ...prev, pressName: "Business name is required (max 30 characters)." }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, pressName: '' }));
    return true;
  };

  const handleNext = () => {
    const isOwnerNameValid = validateOwnerName();
    const isPressNameValid = validatePressName();

    if (!isOwnerNameValid || !isPressNameValid) {
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
        pressName: pressName.trim(),
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
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backArrow} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.title}>Business Profile Setup</Text>
            <View style={styles.placeholderSpace} />
          </View>
          <Text style={styles.subtitle}>Step 1 of 3: Account Creation</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Owner's Name */}
            <View style={styles.fieldContainer}>
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

            {/* Business Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Business Name <Text style={{ color: '#EF4444' }}>*</Text></Text>
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

            {/* Divider */}
            <View style={styles.divider} />

            {/* WhatsApp Number with Same as Contact Toggle */}
            <View style={styles.rowGroup}>
              {/* WhatsApp Number */}
              <View style={styles.halfWidth}>
                <Text style={styles.label}>WhatsApp Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91-9876543210"
                  value={whatsappNumber}
                  onChangeText={handleWhatsappChange}
                  keyboardType="phone-pad"
                  editable={!sameAsContact}
                  placeholderTextColor="#9CA3AF"
                  maxLength={10}
                />
              </View>

              {/* Same as Contact Toggle */}
              <View style={styles.toggleSideWrapper}>
                <View style={styles.switchOutlineWrapper}>
                  <Switch
                    value={sameAsContact}
                    onValueChange={handleToggleSameAsContact}
                    trackColor={{ false: '#E5E7EB', true: '#A855F7' }}
                    thumbColor={sameAsContact ? '#fff' : '#fff'}
                  />
                </View>
                <Text style={styles.toggleLabelSmall}>Same as Contact</Text>
              </View>
            </View>
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
    paddingTop: 24,
    paddingBottom: 40,
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
  headerSection: {
    marginBottom: 32,
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
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressFill: {
    height: '100%',
    width: '33%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldContainer: {
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
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 20,
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
    paddingHorizontal: 2,
    paddingVertical: 2,
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
    flex: 1.5,
    marginBottom: 0,
  },
  nextBtn: {
    marginTop: 16,
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
  nextBtnGradient: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  // Unused styles (kept for reference)
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
    textAlign: 'center',
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  fullRow: {
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'center',
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
});

export default BusinessProfileStepOne;
