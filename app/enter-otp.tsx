import React, { useRef, useState } from 'react';
import {
    Keyboard, KeyboardAvoidingView,
    Platform, SafeAreaView, StyleSheet, Text, TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const OTP_LENGTH = 6;

export default function EnterOtpScreen() {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(8);
  const inputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleResend = () => {
    setOtp('');
    setTimer(8);
    inputRef.current?.focus();
    // Add resend logic here if needed
  };

  const handleChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
    setOtp(cleaned);
    if (cleaned.length === OTP_LENGTH) {
      Keyboard.dismiss();
    }
  };

  const handleVerify = () => {
    // Add verification logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <Text style={styles.heading}>Enter OTP</Text>
          <Text style={styles.subtext}>
            A 6-digit code was sent to +91 7991828898
          </Text>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.otpInputWrapper}
            onPress={() => inputRef.current?.focus()}
          >
            <TextInput
              ref={inputRef}
              value={otp}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              style={styles.otpInput}
              textContentType="oneTimeCode"
              selectionColor="#C6A4F6"
              caretHidden
            />
            <View style={styles.otpPlaceholders} pointerEvents="none">
              {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                <Text key={i} style={styles.otpDigit}>
                  {otp[i] || ' '}
                </Text>
              ))}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleVerify}
            disabled={otp.length !== OTP_LENGTH}
            activeOpacity={otp.length === OTP_LENGTH ? 0.8 : 1}
          >
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>

          {timer > 0 ? (
            <Text style={styles.resendText}>
              Resend OTP in {timer}s
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendText, { color: '#7C3AED', textDecorationLine: 'underline' }]}>Resend OTP</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.footerNote}>
            Didn't receive code? You can go back and try again.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FB',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  heading: {
    fontWeight: '700',
    fontSize: 22,
    color: '#1F2937',
    marginTop: 50,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  otpInputWrapper: {
    width: '80%',
    height: 56,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otpInput: {
    ...StyleSheet.absoluteFillObject,
    color: 'transparent',
    letterSpacing: 14,
    fontSize: 20,
    textAlign: 'center',
  },
  otpPlaceholders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 18,
  },
  otpDigit: {
    width: 24,
    textAlign: 'center',
    fontSize: 20,
    color: '#4B5563',
    letterSpacing: 14,
    fontWeight: '500',
    borderBottomWidth: 0,
  },
  verifyButton: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    backgroundColor: '#C6A4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 24,
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 6,
    textAlign: 'center',
  },
});
