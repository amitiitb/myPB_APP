import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  return (
    <View style={scss.container}>
      {/* Top Nav Bar */}
      <View style={scss.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={scss.headerTitle}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={scss.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Account Section */}
      <View style={scss.card}>
        <Text style={scss.sectionTitle}>ACCOUNT</Text>
        <TouchableOpacity style={scss.row}>
          <View style={scss.iconCircle}><Ionicons name="person-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>My Profile</Text><Text style={scss.rowDesc}>Update your personal and business details</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
        </TouchableOpacity>
        <TouchableOpacity style={scss.row}>
          <View style={scss.iconCircle}><Ionicons name="people-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>Team Management</Text><Text style={scss.rowDesc}>Manage composers and operators</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
        </TouchableOpacity>
        <View style={scss.row}>
          <View style={scss.iconCircle}><Ionicons name="moon-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>Appearance</Text><Text style={scss.rowDesc}>Switch to Dark Mode</Text></View>
          <Switch value={darkMode} onValueChange={setDarkMode} thumbColor={darkMode ? '#7C3AED' : '#ccc'} trackColor={{ true: '#E9D5FF', false: '#E5E7EB' }} />
        </View>
        <View style={scss.row}>
          <View style={scss.iconCircle}><Ionicons name="globe-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>Language</Text><Text style={scss.rowDesc}>Hindi (हिंदी)</Text></View>
          <View style={scss.langToggleWrap}>
            <TouchableOpacity style={[scss.langBtn, language === 'en' && scss.langBtnActive]} onPress={() => setLanguage('en')}><Text style={[scss.langBtnText, language === 'en' && scss.langBtnTextActive]}>English</Text></TouchableOpacity>
            <TouchableOpacity style={[scss.langBtn, language === 'hi' && scss.langBtnActive]} onPress={() => setLanguage('hi')}><Text style={[scss.langBtnText, language === 'hi' && scss.langBtnTextActive]}>हिंदी</Text></TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Support Section */}
      <View style={scss.card}>
        <Text style={scss.sectionTitle}>SUPPORT</Text>
        <TouchableOpacity style={scss.row}>
          <View style={scss.iconCircle}><Ionicons name="help-circle-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>Help & Support</Text><Text style={scss.rowDesc}>Get help and contact support</Text></View>
          <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
        </TouchableOpacity>
        <View style={[scss.row, { opacity: 0.5 }]}> 
          <View style={scss.iconCircle}><Ionicons name="people-circle-outline" size={22} color="#a78bfa" /></View>
          <View style={scss.rowText}><Text style={scss.rowTitle}>Connect with Community</Text><Text style={scss.rowDesc}>Connect with other printing press owners</Text></View>
          <View style={scss.comingSoon}><Text style={scss.comingSoonText}>Coming Soon</Text></View>
        </View>
      </View>
      {/* Log Out Button */}
      <TouchableOpacity style={scss.logoutBtn}>
        <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={scss.logoutBtnText}>Log Out</Text>
      </TouchableOpacity>
      <Text style={scss.footerText}>dil se printing</Text>
      </ScrollView>
    </View>
  );
};

const scss = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C3AED',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
    fontSize: 13,
    color: '#a1a1aa',
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 2,
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ede9fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6D28D9',
  },
  rowDesc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  langToggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: 16,
    overflow: 'hidden',
    marginLeft: 8,
  },
  langBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  langBtnActive: {
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  langBtnText: {
    color: '#7C3AED',
    fontWeight: '700',
    fontSize: 15,
  },
  langBtnTextActive: {
    color: '#6D28D9',
  },
  comingSoon: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  comingSoonText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 18,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 15,
    marginTop: 18,
    fontWeight: '600',
  },
});

export default SettingsScreen;
