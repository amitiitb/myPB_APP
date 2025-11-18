import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BottomNavProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
  onlyOrders?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress, onlyOrders }) => {
  const { darkMode } = useTheme();
  
  if (onlyOrders) {
    return (
      <View style={styles.bottomNavContent}>
        <TouchableOpacity style={styles.navTabActive}>
          <View style={styles.activeTabBg}>
            <Ionicons name="file-tray-stacked-outline" size={26} color="#7C3AED" />
          </View>
          <Text style={styles.navTabTextActive}>Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <>
      <View style={[styles.separatorLine, darkMode && styles.separatorLineDark]} />
      <View style={[styles.bottomNavContent, darkMode && styles.bottomNavContentDark]}>
        {/* Home */}
        <TouchableOpacity style={activeTab === 'home' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('home')}>
          <View style={activeTab === 'home' ? styles.activeTabBg : styles.iconContainer}>
            <Ionicons name="home" size={26} color={activeTab === 'home' ? '#3B82F6' : '#6B7280'} style={styles.iconLowered} />
          </View>
          <Text style={activeTab === 'home' ? [styles.navTabTextActive, {color: '#3B82F6'}] : [styles.navTabText, darkMode && styles.navTabTextDark]}>Home</Text>
        </TouchableOpacity>
        {/* Orders */}
        <TouchableOpacity style={activeTab === 'orders' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('orders')}>
          <View style={activeTab === 'orders' ? styles.activeTabBg : styles.iconContainer}>
            <Ionicons name="file-tray-stacked-outline" size={26} color={activeTab === 'orders' ? '#7C3AED' : '#6B7280'} style={styles.iconLowered} />
          </View>
          <Text style={activeTab === 'orders' ? [styles.navTabTextActive, {color: '#7C3AED'}] : [styles.navTabText, darkMode && styles.navTabTextDark]}>Orders</Text>
        </TouchableOpacity>
        {/* Finance */}
        <TouchableOpacity style={activeTab === 'finance' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('finance')}>
          <View style={activeTab === 'finance' ? styles.activeTabBg : styles.iconContainer}>
            <Text style={{ fontSize: 26, color: activeTab === 'finance' ? '#10B981' : '#6B7280', fontWeight: '700', ...styles.iconLowered }}>₹</Text>
          </View>
          <Text style={activeTab === 'finance' ? [styles.navTabTextActive, {color: '#10B981'}] : [styles.navTabText, darkMode && styles.navTabTextDark]}>Finance</Text>
        </TouchableOpacity>
        {/* Inventory */}
        <TouchableOpacity style={activeTab === 'inventory' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('inventory')}>
          <View style={activeTab === 'inventory' ? styles.activeTabBg : styles.iconContainer}>
            <Ionicons name="layers-outline" size={26} color={activeTab === 'inventory' ? '#F59E0B' : '#6B7280'} style={styles.iconLowered} />
          </View>
          <Text style={activeTab === 'inventory' ? [styles.navTabTextActive, {color: '#F59E0B'}] : [styles.navTabText, darkMode && styles.navTabTextDark]}>Inventory</Text>
        </TouchableOpacity>
        {/* Reports */}
        <TouchableOpacity style={activeTab === 'reports' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('reports')}>
          <View style={activeTab === 'reports' ? styles.activeTabBg : styles.iconContainer}>
            <Ionicons name="bar-chart-outline" size={26} color={activeTab === 'reports' ? '#EF4444' : '#6B7280'} style={styles.iconLowered} />
          </View>
          <Text style={activeTab === 'reports' ? [styles.navTabTextActive, {color: '#EF4444'}] : [styles.navTabText, darkMode && styles.navTabTextDark]}>Reports</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  separatorLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 0,
  },
  separatorLineDark: {
    backgroundColor: '#1F2937',
  },
  bottomNavContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  bottomNavContentDark: {
    backgroundColor: 'rgba(31, 41, 55, 0.95)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  navTabActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeTabBg: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconLowered: {
    marginTop: 6,
  },
  navTabText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  navTabTextDark: {
    color: '#D1D5DB',
  },
  navTabTextActive: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    marginTop: 2,
  },
});

export default BottomNav;
