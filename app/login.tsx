import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useLanguage } from '@/context/LanguageContext';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert, Dimensions, Keyboard, KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleContinue = async () => {
    if (!phoneNumber) {
  Alert.alert('Error', 'Please enter your contact number');
      return;
    }

    if (phoneNumber.length !== 10) {
  Alert.alert('Error', 'Please enter a valid 10-digit contact number');
      return;
    }

    if (!/^[6-9]/.test(phoneNumber)) {
  Alert.alert('Error', 'Please enter a valid Indian contact number starting with 6, 7, 8, or 9');
      return;
    }

    setIsLoading(true);

    // Simulate processing
    setTimeout(() => {
      setIsLoading(false);
      router.push({
        pathname: '/otp-verification',
        params: { phoneNumber: phoneNumber }
      });
    }, 1000);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      language === 'en' ? 'Forgot Password' : 'पासवर्ड भूल गए',
      language === 'en'
        ? 'Password reset functionality would be implemented here'
        : 'पासवर्ड रीसेट कार्यक्षमता यहां लागू की जाएगी'
    );
  };

  const handleCreateAccount = () => {
    Alert.alert(
      language === 'en' ? 'Create Account' : 'खाता बनाएं',
      language === 'en'
        ? 'Account creation functionality would be implemented here'
        : 'खाता निर्माण कार्यक्षमता यहां लागू की जाएगी'
    );
  };

  const handlePhoneNumberChange = (text: string) => {
    // Only allow digits and limit to 10 characters
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhoneNumber(cleaned);
      if (cleaned.length === 10) {
        Keyboard.dismiss();
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F8F4FF' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Language Toggle */}
          <TouchableOpacity style={styles.languageToggle} onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}>
            <ThemedText style={styles.languageText}>
              {language === 'en' ? 'हिंदी' : 'English'}
            </ThemedText>
          </TouchableOpacity>

          {/* Top Section */}
          <View style={styles.topSection}>
            <ThemedText style={styles.tagline}>{t('login.tagline')}</ThemedText>
            <ThemedText style={styles.heading}>{t('login.heading')}</ThemedText>
            <ThemedText style={styles.subheading}>{t('login.subheading')}</ThemedText>

            {/* Hero Image */}
            <View style={styles.heroImageContainer}>
              <Image
                source={require('@/assets/images/login uncle image.png')}
                style={styles.heroImage}
                contentFit="contain"
                placeholder="Hero Illustration"
              />
            </View>
          </View>

          {/* Card Section */}
          <View style={styles.card}>
            {/* Title */}
            <View style={styles.titleContainer}>
              <ThemedText style={styles.welcomeText}>
                {t('login.welcome')}
              </ThemedText>
            </View>

            {/* Subtitle */}
            <ThemedText style={styles.subtitle}>
              {t('login.subtitle')}
            </ThemedText>

            {/* Section Title */}
            <ThemedText style={styles.sectionTitle}>
              {t('login.sectionTitle')}
            </ThemedText>

            {/* Contact Number Input */}
            <View style={styles.inputContainer}>
              <View style={styles.phoneInputContainer}>
                <View style={styles.countryCodeContainer}>
                  <ThemedText style={styles.flag}>🇮🇳</ThemedText>
                  <ThemedText style={styles.countryCode}>+91</ThemedText>
                </View>
                <View style={styles.separator} />
                <TextInput
                  style={styles.phoneInput}
                  placeholder={t('login.enterPhone')}
                  placeholderTextColor="#9CA3AF"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoComplete="tel"
                />
              </View>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[styles.continueButtonWrapper, isLoading && styles.continueButtonDisabled]}
              onPress={handleContinue}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueGradient}
              >
                <ThemedText style={styles.continueButtonText}>
                  {isLoading
                    ? t('login.processing')
                    : t('login.continueButton')}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>
                {t('login.termsText')}{' '}
              </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.linkText}>{t('login.termsLink')}</ThemedText>
              </TouchableOpacity>
              <ThemedText style={styles.footerText}> & </ThemedText>
              <TouchableOpacity>
                <ThemedText style={styles.linkText}>{t('login.privacyLink')}</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  languageToggle: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(255,255,255,0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  languageText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    opacity: 0.95,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: '#374151',
    marginBottom: 8,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.12)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.2,
    lineHeight: 36,
  },
  subheading: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  heroImageContainer: {
    width: '100%',
    height: 200,
    marginTop: 24,
    alignItems: 'center',
  },
  heroImage: {
    width: '90%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  titleContainer: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  brandText: {
    color: '#6C2BD9',
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#374151',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    height: 52,
    paddingHorizontal: 12,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  flag: {
    fontSize: 20,
    marginRight: 8,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#D1D5DB',
    marginRight: 12,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 0,
    height: 52,
  },
  continueButtonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  continueGradient: {
    height: 50,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  linkText: {
    fontSize: 11,
    color: '#6C2BD9',
    fontWeight: '600',
  },
});