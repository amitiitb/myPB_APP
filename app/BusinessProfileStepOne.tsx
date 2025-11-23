import StepIndicator from '@/components/StepIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const BusinessProfileStepOne: React.FC = () => {
  const { phoneNumber, ownerName: paramOwnerName, pressName: paramPressName, contactNumber: paramContactNumber, whatsappNumber: paramWhatsappNumber, latitude: paramLatitude, longitude: paramLongitude } = useLocalSearchParams<{ 
    phoneNumber?: string;
    ownerName?: string;
    pressName?: string;
    contactNumber?: string;
    whatsappNumber?: string;
    latitude?: string;
    longitude?: string;
  }>();
  const [ownerName, setOwnerName] = useState(paramOwnerName || '');
  const [pressName, setPressName] = useState(paramPressName || '');
  const [contactNumber, setContactNumber] = useState(paramContactNumber || phoneNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(paramWhatsappNumber || '');
  const [sameAsContact, setSameAsContact] = useState(paramWhatsappNumber === paramContactNumber && !!paramContactNumber);
  const [formErrors, setFormErrors] = useState({
    ownerName: '',
    pressName: '',
  });
  const [latitude, setLatitude] = useState(paramLatitude || '');
  const [longitude, setLongitude] = useState(paramLongitude || '');

  const scrollViewRef = React.useRef<ScrollView>(null);

  // Handler for Locate My Press
  const handleLocateMyPress = async () => {
    Alert.alert(
      'Location Permission',
      'This app would like to use your location to help you locate your press on the map. Do you want to enable location services?',
      [
        {
          text: 'No',
          onPress: () => {
            // User declined location permission
            Alert.alert('Location Disabled', 'You can enable location services later in your settings.');
          },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status === 'granted') {
                const location = await Location.getCurrentPositionAsync();
                const lat = location.coords.latitude.toFixed(4);
                const lon = location.coords.longitude.toFixed(4);
                setLatitude(lat);
                setLongitude(lon);
                console.log('Location obtained:', location);
              } else {
                Alert.alert('Permission Denied', 'Location permission was not granted.');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to get location. Please try again.');
              console.error('Location error:', error);
            }
          },
        },
      ]
    );
  };

  // Step indicator data for Business Profile Setup
  const steps = [
    { id: 1, label: 'Business Details', completed: false, current: true },
    { id: 2, label: 'Services', completed: false, current: false },
    { id: 3, label: 'Team', completed: false, current: false },
  ];

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
    // Dismiss keyboard when 10 digits are entered
    if (cleaned.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleWhatsappChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 10);
    setWhatsappNumber(cleaned);
    // Dismiss keyboard when 10 digits are entered
    if (cleaned.length === 10) {
      Keyboard.dismiss();
    }
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
        latitude: latitude,
        longitude: longitude,
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Step Indicator */}
      <StepIndicator 
        steps={steps} 
        currentStepPage={1}
        routeParams={{
          ownerName: ownerName.trim(),
          phoneNumber: contactNumber,
          whatsappNumber: whatsappNumber,
          pressName: pressName.trim(),
          latitude: latitude,
          longitude: longitude,
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={{ width: '100%', alignSelf: 'stretch' }}
        >
          {/* Form Card */}
          <View style={[styles.formCard, { width: '100%', alignSelf: 'stretch' }] }>
            {/* Owner's Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="person" size={16} color="#7C3AED" /> Owner's Name <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, formErrors.ownerName && styles.inputError]}
                  placeholder="e.g., Sunil Kumar"
                  value={ownerName}
                  onChangeText={setOwnerName}
                  onBlur={validateOwnerName}
                  placeholderTextColor="#9CA3AF"
                  maxLength={30}
                />
                {ownerName.length > 0 && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.inputIcon} />
                )}
              </View>
              {formErrors.ownerName ? <Text style={styles.errorText}><Ionicons name="alert-circle" size={12} color="#EF4444" /> {formErrors.ownerName}</Text> : null}
            </View>

            {/* Business Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="briefcase" size={16} color="#7C3AED" /> Business Name <Text style={{ color: '#EF4444' }}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, formErrors.pressName && styles.inputError]}
                  placeholder="e.g., Kumar Printers"
                  value={pressName}
                  onChangeText={setPressName}
                  onBlur={validatePressName}
                  placeholderTextColor="#9CA3AF"
                  maxLength={30}
                />
                {pressName.length > 0 && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.inputIcon} />
                )}
              </View>
              {formErrors.pressName ? <Text style={styles.errorText}><Ionicons name="alert-circle" size={12} color="#EF4444" /> {formErrors.pressName}</Text> : null}
            </View>

            {/* WhatsApp Number with Same as Contact Toggle */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="logo-whatsapp" size={16} color="#25D366" /> WhatsApp Number
              </Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, sameAsContact && styles.disabledInput]}
                  placeholder="9876543210"
                  value={whatsappNumber}
                  onChangeText={handleWhatsappChange}
                  keyboardType="phone-pad"
                  editable={!sameAsContact}
                  placeholderTextColor="#9CA3AF"
                  maxLength={10}
                />
                {whatsappNumber.length === 10 && (
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" style={styles.inputIcon} />
                )}
              </View>

              {/* Use Login Phone Number Toggle Below WhatsApp */}
              <View style={styles.toggleRowBelowInput}>
                <View style={styles.switchOutlineWrapper}>
                  <Switch
                    value={sameAsContact}
                    onValueChange={handleToggleSameAsContact}
                    trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                    thumbColor={sameAsContact ? '#fff' : '#fff'}
                  />
                </View>
                <Text style={styles.toggleLabelSmall}>Use Login Phone Number</Text>
              </View>
            </View>

            {/* Your Location Heading */}
            <Text style={styles.label}>
              📍 Your Location
            </Text>

            {/* Locate My Press Option */}
            {latitude && longitude ? (
              <View style={styles.locateMeContainer}>
                <View style={styles.locateMeBoxSuccess}>
                  <View style={styles.locationContent}>
                    <TextInput
                      style={styles.locationInput}
                      value={`Lat: ${latitude}, Long: ${longitude}`}
                      editable={false}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
              </View>
            ) : (
              <View style={styles.locateMeContainer}>
                <TouchableOpacity style={styles.locateMeBox} onPress={handleLocateMyPress}>
                  <Ionicons name="location" size={20} color="#7C3AED" />
                  <Text style={styles.locateMeBoxText}>Locate my Business</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Next Button - Floating */}
        <View style={[styles.floatingButtonContainer, { width: '100%', alignSelf: 'stretch' }] }>
          <TouchableOpacity style={[styles.nextBtn, { width: '100%', alignSelf: 'stretch' }]} onPress={handleNext}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>Next →</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 100,
    flexGrow: 1,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
  headerSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.5,
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
    borderRadius: 2,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 0,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
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
  toggleCenterWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 8,
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
  toggleLabelCenter: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
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
    width: '100%',
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    alignSelf: 'center',
    marginTop: 12,
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
  locateMeContainer: {
    marginBottom: 20,
    gap: 10,
  },
  locateMeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#F9F9FF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    paddingHorizontal: 16,
    gap: 12,
  },
  locateMeBoxSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    borderColor: '#10B981',
    borderWidth: 1.5,
    paddingHorizontal: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  coordinatesText: {
    flex: 1,
  },
  coordinateLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  coordinateValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  locateMeBoxText: {
    fontSize: 16,
    color: '#7C3AED',
    fontWeight: '600',
  },
  locationInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginLeft: 8,
  },
  manualAddressLink: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
    marginTop: 12,
    textDecorationLine: 'underline',
    textAlign: 'center',
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
  toggleRowBelowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  inputIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIconTextArea: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});

export default BusinessProfileStepOne;
