import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert, Dimensions, Keyboard, KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet,
    TextInput,
    TouchableOpacity, useColorScheme, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function OTPVerificationScreen() {
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Timer for resend OTP
  React.useEffect(() => {
    let interval: number;
    if (resendTimer > 0 && !canResend) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer, canResend]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Dismiss keyboard and auto-verify if all 6 digits are filled
    if (index === 5 && value && newOtp.every((d) => d.length === 1)) {
      Keyboard.dismiss();
      setTimeout(() => {
        // Use the latest OTP value
        const otpString = newOtp.join('');
        if (otpString.length === 6) {
          // Inline the verification logic to avoid stale closure
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
              language === 'en' ? 'Success' : 'सफलता',
              language === 'en' ? 'OTP verified successfully!' : 'OTP सफलतापूर्वक सत्यापित!',
              [
                {
                  text: language === 'en' ? 'Continue' : 'जारी रखें',
                  onPress: () => router.replace({
                    pathname: '/BusinessProfileStepOne',
                    params: { phoneNumber: phoneNumber || '' }
                  }),
                },
              ]
            );
          }, 1500);
        }
      }, 150); // slight delay to allow keyboard to close
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      Alert.alert(
        language === 'en' ? 'Error' : 'त्रुटि',
        language === 'en' ? 'Please enter complete 6-digit OTP' : 'कृपया पूरा 6-अंकीय OTP दर्ज करें'
      );
      return;
    }

    setIsLoading(true);

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false);

      // For demo purposes, accept any OTP
      Alert.alert(
        language === 'en' ? 'Success' : 'सफलता',
        language === 'en' ? 'OTP verified successfully!' : 'OTP सफलतापूर्वक सत्यापित!',
        [
          {
            text: language === 'en' ? 'Continue' : 'जारी रखें',
            onPress: () => router.replace({
              pathname: '/BusinessProfileStepOne',
              params: { phoneNumber: phoneNumber || '' }
            }),
          },
        ]
      );
    }, 1500);
  };

  const handleResendOTP = () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();

    // Simulate resend
    setTimeout(() => {
      Alert.alert(
        language === 'en' ? 'OTP Resent' : 'OTP पुनः भेजा गया',
        language === 'en'
          ? 'A new OTP has been sent to your phone number'
          : 'आपके फोन नंबर पर एक नया OTP भेजा गया है'
      );
    }, 1000);
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Language Toggle */}
          <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
            <ThemedText style={styles.languageText}>
              {language === 'en' ? 'हिंदी' : 'English'}
            </ThemedText>
          </TouchableOpacity>

          <View style={styles.content}>
            {/* Header restored as per request */}
            <View style={{ alignItems: 'center', marginBottom: 24 }}>
              <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 6 }}>
                Enter OTP
              </ThemedText>
              <ThemedText style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 21 }}>
                A 6-digit code was sent to your phone number
              </ThemedText>
            </View>

            {/* OTP Card */}
            <View style={styles.card}>
              {/* OTP Input Fields */}
              <View style={styles.otpContainer}>
                <View style={styles.otpInputs}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                        if (ref) inputRefs.current[index] = ref;
                      }}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={(value) => handleOtpChange(value, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                      autoFocus={index === 0}
                    />
                  ))}
                </View>
              </View>

              {/* Verify Button */}
              <TouchableOpacity
                style={[styles.verifyButton, isLoading && styles.verifyButtonDisabled, { padding: 0, backgroundColor: 'transparent', shadowColor: 'transparent' }]}
                onPress={handleVerifyOTP}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={['#A855F7', '#7C3AED']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.verifyButtonGradient}
                >
                  <ThemedText style={styles.verifyButtonText}>
                    {isLoading
                      ? (language === 'en' ? 'Verifying...' : 'सत्यापित हो रहा है...')
                      : (language === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें')}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>

              {/* Resend OTP */}
              <View style={styles.resendContainer}>
                <ThemedText style={styles.resendText}>
                  {language === 'en' ? "Didn't receive OTP?" : 'OTP नहीं मिला?'}
                </ThemedText>
                <TouchableOpacity
                  style={[styles.resendButton, !canResend && styles.resendButtonDisabled]}
                  onPress={handleResendOTP}
                  disabled={!canResend}
                >
                  <ThemedText style={[styles.resendButtonText, !canResend && styles.resendButtonTextDisabled]}>
                    {canResend
                      ? (language === 'en' ? 'Resend OTP' : 'OTP पुनः भेजें')
                      : `${language === 'en' ? 'Resend in' : 'पुनः भेजें'} ${resendTimer}s`}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Back to Login */}
            <TouchableOpacity style={styles.backButton} onPress={handleBackToLogin}>
              <ThemedText style={styles.backButtonText}>
                {language === 'en' ? '← Back to Login' : '← लॉगिन पर वापस जाएं'}
              </ThemedText>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  languageToggle: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    marginBottom: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  otpTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  otpSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.3,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 32,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  verifyButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  verifyButtonGradient: {
    height: 48,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.10)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  resendButtonTextDisabled: {
    color: '#9CA3AF',
  },
  backButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});