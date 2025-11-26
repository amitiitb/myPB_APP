import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert, Dimensions, Keyboard, KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet,
    Text,
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
  const [showSuccessToast, setShowSuccessToast] = useState(false);
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
            // Show success toast
            setShowSuccessToast(true);
            // Auto-close toast and navigate after 1 second
            setTimeout(() => {
              router.replace({
                pathname: '/BusinessProfileStepOne',
                params: { phoneNumber: phoneNumber || '' }
              });
            }, 1000);
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

  // Show OTP input and allow any 6-digit OTP, with language toggle and back links
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          {/* Language Toggle */}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1.5, marginBottom: 4, borderColor: language === 'hi' ? '#111' : '#9CA3AF', backgroundColor: language === 'hi' ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.03)' }}
            onPress={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            <ThemedText style={{ fontSize: 13, textAlign: 'center', color: language === 'hi' ? '#111' : '#6B7280', fontWeight: language === 'hi' ? '700' : '600' }}>
              {language === 'en' ? 'हिंदी' : 'English'}
            </ThemedText>
          </TouchableOpacity>

          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <ThemedText style={{ fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', textAlign: 'center', marginBottom: 6 }}>
              {language === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}
            </ThemedText>
            <ThemedText style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 21 }}>
              {language === 'en' ? 'A 6-digit code was sent to your contact number' : 'आपके फ़ोन नंबर पर 6-अंकीय कोड भेजा गया है'}
            </ThemedText>
          </View>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '100%', maxWidth: 400, alignItems: 'center', marginBottom: 32 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={{ width: 45, height: 50, borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 12, textAlign: 'center', fontSize: 20, fontWeight: '600', color: '#1F2937', backgroundColor: '#F9FAFB', marginHorizontal: 4 }}
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
            <TouchableOpacity
              style={{ height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', width: '100%', backgroundColor: otp.every((d) => d.length === 1) ? '#7C3AED' : '#D1D5DB', marginBottom: 8 }}
              onPress={() => {
                if (otp.join('').length === 6) {
                  setShowSuccessToast(true);
                  setTimeout(() => {
                    router.replace({
                      pathname: '/BusinessProfileStepOne',
                      params: { phoneNumber: phoneNumber || '' }
                    });
                  }, 1000);
                } else {
                  Alert.alert(language === 'en' ? 'Error' : 'त्रुटि', language === 'en' ? 'Please enter complete 6-digit OTP' : 'कृपया पूरा 6-अंकीय OTP दर्ज करें');
                }
              }}
              disabled={!otp.every((d) => d.length === 1)}
              activeOpacity={0.85}
            >
              <ThemedText style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                {language === 'en' ? 'Verify OTP' : 'OTP सत्यापित करें'}
              </ThemedText>
            </TouchableOpacity>
            {/* Back to mobile number link */}
            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() => router.back()}
            >
              <ThemedText style={{ color: '#6B7280', fontSize: 15, fontWeight: '500', textAlign: 'center' }}>
                {language === 'en' ? '← Back to mobile number' : '← मोबाइल नंबर पर वापस जाएं'}
              </ThemedText>
            </TouchableOpacity>
          </View>
          {/* Success Toast at top */}
          {showSuccessToast && (
            <View style={{ position: 'absolute', top: 40, left: 0, right: 0, alignItems: 'center', zIndex: 10 }}>
              <View style={{ backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' }}>
                  {language === 'en' ? 'OTP verified successfully!' : 'OTP सफलतापूर्वक सत्यापित!'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}