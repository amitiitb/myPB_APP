import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import MyProfileScreen from './MyProfileScreen';
import TeamManagementScreen from './TeamManagementScreen';

interface SettingsScreenProps {
  onBack: () => void;
  ownerName?: string;
  ownerPhone?: string;
  ownerWhatsapp?: string;
  pressName?: string;
  email?: string;
  owners?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
  composers?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
  operators?: Array<{ id: string; name: string; mobile: string; whatsapp: string; role: string }>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBack, 
  ownerName = 'Account Owner', 
  ownerPhone = '9876543210', 
  ownerWhatsapp,
  pressName = 'Press Name',
  email = '',
  owners = [],
  composers = [],
  operators = [],
}) => {
  const { darkMode, setDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [showMyProfile, setShowMyProfile] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [address, setAddress] = useState('');
  const [gstin, setGstin] = useState('');
  const router = useRouter();
  const blinkAnim = React.useRef(new Animated.Value(1)).current;

  // Blinking animation for "Coming Soon"
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [blinkAnim]);

  const handleLogout = () => {
    // Clear any user data/tokens here if needed
    // For now, just navigate to login screen
    router.replace('/login');
  };

  const handleLanguageChange = async (lang: 'en' | 'hi') => {
    await setLanguage(lang);
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

  // Show MyProfileScreen if needed
  if (showMyProfile) {
    return (
      <MyProfileScreen
        onBack={() => setShowMyProfile(false)}
        ownerName={ownerName}
        ownerPhone={ownerPhone}
        ownerWhatsapp={ownerWhatsapp || ownerPhone}
        pressName={pressName}
        email={email}
      />
    );
  }

  // Show TeamManagementScreen if needed
  if (showTeamManagement) {
    return (
      <TeamManagementScreen 
        onBack={() => setShowTeamManagement(false)} 
        ownerName={ownerName}
        ownerPhone={ownerPhone}
        ownerWhatsapp={ownerWhatsapp || ownerPhone}
        owners={owners}
        composers={composers}
        operators={operators}
      />
    );
  }

  return (
    <SafeAreaView style={[scss.safeArea, darkMode && scss.safeAreaDark]}>
      <View style={[scss.header, darkMode && scss.headerDark]}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="settings" size={26} color="#fff" style={{ marginLeft: 12, marginRight: 4 }} />
        <Text style={scss.headerTitle}>{t('settings.settings')}</Text>
      </View>
      <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={[scss.card, darkMode && scss.cardDark]}>
        <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('settings.account')}</Text>
        <TouchableOpacity style={scss.row} onPress={() => setShowMyProfile(true)}>
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="person-circle" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.myProfile')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{t('settings.updateDetails')}</Text></View>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#6B7280' : '#a1a1aa'} />
        </TouchableOpacity>

        <TouchableOpacity style={scss.row} onPress={() => setShowTeamManagement(true)}>
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="people" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.teamManagement')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{t('settings.manageTeam')}</Text></View>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#6B7280' : '#a1a1aa'} />
        </TouchableOpacity>
        <View style={scss.row}>
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="moon" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.appearance')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{t('settings.switchDarkMode')}</Text></View>
          <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={darkMode ? '#7C3AED' : '#ccc'} trackColor={{ true: '#E9D5FF', false: '#E5E7EB' }} />
        </View>
        <View style={scss.row}>
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="globe" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.language')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{language === 'en' ? 'Eng' : 'हिंदी'}</Text></View>
          <View style={scss.langToggleWrap}>
            <TouchableOpacity style={[scss.langBtn, language === 'en' && scss.langBtnActive]} onPress={() => handleLanguageChange('en')}><Text style={[scss.langBtnText, language === 'en' && scss.langBtnTextActive]}>Eng</Text></TouchableOpacity>
            <TouchableOpacity style={[scss.langBtn, language === 'hi' && scss.langBtnActive]} onPress={() => handleLanguageChange('hi')}><Text style={[scss.langBtnText, language === 'hi' && scss.langBtnTextActive]}>हिंदी</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Support Section */}
      <View style={[scss.card, darkMode && scss.cardDark]}>
        <Text style={[scss.sectionTitle, darkMode && scss.sectionTitleDark]}>{t('settings.support')}</Text>
        <TouchableOpacity style={scss.row}>
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="help-circle" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.helpSupport')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{t('settings.getHelp')}</Text></View>
          <Ionicons name="chevron-forward" size={20} color={darkMode ? '#6B7280' : '#a1a1aa'} />
        </TouchableOpacity>
        <View style={[scss.row, { opacity: 0.5 }]}> 
          <View style={[scss.iconCircle, darkMode && scss.iconCircleDark]}><Ionicons name="people" size={22} color={darkMode ? '#c4b5fd' : '#a78bfa'} /></View>
          <View style={scss.rowText}><Text style={[scss.rowTitle, darkMode && scss.rowTitleDark]}>{t('settings.connectCommunity')}</Text><Text style={[scss.rowDesc, darkMode && scss.rowDescDark]}>{t('settings.connectOthers')}</Text></View>
          <Animated.View style={[scss.comingSoon, { opacity: blinkAnim }]}><Text style={scss.comingSoonText}>{t('settings.comingSoon')}</Text></Animated.View>
        </View>
      </View>
      {/* Log Out Button */}
      <TouchableOpacity style={scss.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={scss.logoutBtnText}>{t('common.logout')}</Text>
      </TouchableOpacity>
      <Text style={scss.footerText}>dil se printing 🇮🇳</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const scss = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  safeAreaDark: {
    backgroundColor: '#1F2937',
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 20,
    height: 64,
  },
  headerDark: {
    backgroundColor: '#6D28D9',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
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
  sectionTitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  rowDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '400',
  },
  langToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  langBtnActive: {
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  langBtnText: {
    color: '#6B7280',
    fontWeight: '600',
    fontSize: 13,
  },
  langBtnTextActive: {
    color: '#7C3AED',
    fontWeight: '700',
  },
  comingSoon: {
    backgroundColor: '#A855F7',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 24,
    paddingVertical: 13,
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  footerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 13,
    marginTop: 16,
    fontWeight: '500',
  },
  // Dark Mode Styles
  cardDark: {
    backgroundColor: '#374151',
    shadowColor: '#000',
    shadowOpacity: 0.3,
  },
  sectionTitleDark: {
    color: '#9CA3AF',
  },
  rowTitleDark: {
    color: '#F3F4F6',
  },
  rowDescDark: {
    color: '#D1D5DB',
  },
  iconCircleDark: {
    backgroundColor: '#4B5563',
  },
  // Profile Edit Section Styles
  profileEditSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  fieldLabelDark: {
    color: '#F3F4F6',
  },
  textInput: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    color: '#111827',
  },
  textInputDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F3F4F6',
  },
  readOnlyInput: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  rowGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  textAreaWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  textAreaWrapperDark: {},
  textArea: {
    minHeight: 72,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingRight: 36,
    color: '#111827',
    textAlignVertical: 'top',
  },
  textAreaDark: {
    backgroundColor: '#4B5563',
    borderColor: '#6B7280',
    color: '#F3F4F6',
  },
  fieldIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  helperTextDark: {
    color: '#D1D5DB',
  },
  saveBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
