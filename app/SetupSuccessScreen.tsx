import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SetupSuccessScreen: React.FC = () => {
    const { ownerName, phoneNumber, whatsappNumber, pressName, owners, composers, operators } = useLocalSearchParams<{
        ownerName: string;
        phoneNumber: string;
        whatsappNumber: string;
        pressName: string;
        owners: string;
        composers: string;
        operators: string;
    }>();

    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const messageSlideAnim = useRef(new Animated.Value(20)).current;
    const confettiRef = useRef<any>(null);

    useEffect(() => {
        // Scale and fade in animation for checkmark
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                    bounciness: 6,
                    speed: 8,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]),
            // Floating animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(bounceAnim, {
                        toValue: -10,
                        duration: 1400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(bounceAnim, {
                        toValue: 0,
                        duration: 1400,
                        useNativeDriver: true,
                    }),
                ])
            ),
        ]).start();

        // Message slide and fade in
        Animated.timing(messageSlideAnim, {
            toValue: 0,
            duration: 700,
            delay: 300,
            useNativeDriver: true,
        }).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            delay: 300,
            useNativeDriver: true,
        }).start();

        // Trigger confetti animation with slight delay
        const confettiTimer = setTimeout(() => {
            if (confettiRef.current) {
                confettiRef.current.play();
            }
        }, 100);

        return () => clearTimeout(confettiTimer);
    }, [scaleAnim, fadeAnim, bounceAnim, messageSlideAnim]);

    const handleGoToDashboard = () => {
        // Navigate to Dashboard screen
        router.push({
            pathname: '/DashboardScreen',
            params: {
                owners: owners || '',
                composers: composers || '',
                operators: operators || '',
                ownerName: ownerName || '',
                phoneNumber: phoneNumber || '',
                whatsappNumber: whatsappNumber || '',
                pressName: pressName || '',
            }
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#FFFFFF', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
                {/* Confetti Animation Background - Positioned absolutely behind content */}
                <LottieView
                    ref={confettiRef}
                    source={require('../assets/confetti.json')}
                    autoPlay={false}
                    loop={false}
                    style={styles.confetti}
                />

                {/* Animated Success Checkmark */}
                <Animated.View
                    style={[
                        styles.checkmarkWrapper,
                        {
                            transform: [
                                { scale: scaleAnim },
                                { translateY: bounceAnim },
                            ],
                            opacity: fadeAnim,
                        },
                    ]}
                >
                    <View style={styles.checkmarkOuter}>
                        <LinearGradient
                            colors={['#10B981', '#34D399']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.checkmarkCircle}
                        >
                            <Ionicons name="checkmark" size={72} color="#fff" strokeWidth={3} />
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* Success Messages */}
                <Animated.View
                    style={[
                        styles.messageContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: messageSlideAnim }],
                        },
                    ]}
                >
                    <Text style={styles.emoji}>🎉</Text>

                    <Text style={styles.successTitle}>
                        Profile Setup
                        <Text style={{ color: '#10B981' }}> Complete!</Text>
                    </Text>

                    <Text style={styles.successMessage}>
                        <Text style={{ color: '#EF4444' }}>Hurray! </Text>
                        <Text style={{ color: '#6B7280' }}>Aapka profile setup </Text>
                        <Text style={{ color: '#10B981' }}>complete</Text>
                        <Text style={{ color: '#6B7280' }}> ho </Text>
                        <Text style={{ color: '#F59E0B' }}>gaya</Text>
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.successSubtext}>
                        <Text style={{ color: '#7C3AED' }}>Ab </Text>
                        <Text style={{ color: '#6B7280' }}>PrintBandhan par </Text>
                        <Text style={{ color: '#10B981' }}>apne orders </Text>
                        <Text style={{ color: '#6B7280' }}>place karna </Text>
                        <Text style={{ color: '#F59E0B' }}>shuru</Text>
                        <Text style={{ color: '#6B7280' }}> karein.</Text>
                    </Text>
                </Animated.View>

                {/* Spacer */}
                <View style={{ flex: 1 }} />

                {/* Decorative Elements */}
                <View style={styles.decorativeTop} />
                <View style={styles.decorativeBottom} />

                {/* Go to Dashboard Button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGoToDashboard}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={['#7C3AED', '#A855F7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.buttonGradient}
                    >
                        <Text style={styles.buttonText}>Go to Dashboard</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 0,
        paddingBottom: 32,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    confetti: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    checkmarkWrapper: {
        marginBottom: 60,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
    },
    checkmarkOuter: {
        shadowColor: '#10B981',
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 12,
    },
    checkmarkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageContainer: {
        alignItems: 'center',
        marginBottom: 50,
        maxWidth: '100%',
        zIndex: 20,
    },
    emoji: {
        fontSize: 48,
        marginBottom: 20,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    successMessage: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 24,
    },
    divider: {
        width: 48,
        height: 3,
        backgroundColor: '#10B981',
        borderRadius: 1.5,
        marginBottom: 16,
    },
    successSubtext: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 23,
        maxWidth: '95%',
    },
    decorativeTop: {
        position: 'absolute',
        top: 60,
        right: 20,
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F0FDF4',
        opacity: 0.6,
    },
    decorativeBottom: {
        position: 'absolute',
        bottom: 150,
        left: 10,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F3F4F6',
        opacity: 0.4,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#7C3AED',
        shadowOpacity: 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 20,
        zIndex: 30,
    },
    buttonGradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});

export default SetupSuccessScreen;

// Hide the header (and back button) for this screen in expo-router
export const config = {
    headerShown: false,
};
