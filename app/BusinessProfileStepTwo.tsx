import StepIndicator from '@/components/StepIndicator';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const BusinessProfileStepTwo: React.FC = () => {
  const { ownerName, phoneNumber, whatsappNumber, pressName, latitude, longitude, selectedServices: paramServices } = useLocalSearchParams<{
    ownerName: string;
    phoneNumber: string;
    whatsappNumber: string;
    pressName: string;
    latitude?: string;
    longitude?: string;
    selectedServices?: string;
  }>();
  const [selectedServices, setSelectedServices] = useState<string[]>(paramServices ? JSON.parse(paramServices) : []);
  const [error, setError] = useState('');

  // Step indicator data for Business Profile Setup
  const steps = [
    { id: 1, label: 'Business Details', completed: true, current: false },
    { id: 2, label: 'Services', completed: false, current: true },
    { id: 3, label: 'Team', completed: false, current: false },
  ];

  const serviceCategories = {
    'Printing Services': [
      'Offset Printing',
      'Digital Printing',
      'Screen Printing',
      'Large Format',
    ],
    'Event & Personal Printing': [
      'Marriage Cards',
      'Invitation Cards',
    ],
    'Business Essentials': [
      'Letter Pads',
      'Visiting Cards',
      'Calendars',
      'Brochures',
    ],
    'Marketing & Promotional': [
      'Flyers',
      'Handbills',
      'Posters (Vinyl Poster)',
      'Flex',
    ],
    'Merchandise & Packaging': [
      'T-Shirts',
      'Mugs',
    ],
  };

  const toggleService = (service: string) => {
    setError(''); // Clear error when user selects a service
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    if (selectedServices.length === 0) {
      setError('Please select at least one service to continue.');
      return;
    }
    // Navigate to step 3 with owner data
    router.push({
      pathname: '/BusinessProfileStepThree',
      params: {
        ownerName: ownerName || '',
        phoneNumber: phoneNumber || '',
        whatsappNumber: whatsappNumber || '',
        pressName: pressName || '',
        latitude: latitude || '',
        longitude: longitude || '',
        selectedServices: JSON.stringify(selectedServices),
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Step Indicator */}
      <StepIndicator 
        steps={steps} 
        currentStepPage={2}
        routeParams={{
          ownerName: ownerName || '',
          phoneNumber: phoneNumber || '',
          whatsappNumber: whatsappNumber || '',
          pressName: pressName || '',
          latitude: latitude || '',
          longitude: longitude || '',
          selectedServices: JSON.stringify(selectedServices),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Service Categories */}
          {Object.entries(serviceCategories).map(([category, services]) => (
            <View key={category} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <View style={styles.chipsContainer}>
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service);
                  return (
                    <TouchableOpacity
                      key={service}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleService(service)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {service}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}

          {/* Error Message */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}


        </ScrollView>
      </KeyboardAvoidingView>

      {/* Floating Next Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  scrollContent: {
    paddingHorizontal: '5%',
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
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
    width: '66%',
    backgroundColor: '#7C3AED',
    borderRadius: 2,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 6,
  },
  chipSelected: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  chipText: {
    fontSize: 14,
    color: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
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
    backgroundColor: '#ffffff',
    paddingHorizontal: '5%',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  nextBtn: {
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

export default BusinessProfileStepTwo;
