import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface BottomNavProps {
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
  onlyOrders?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress, onlyOrders }) => {
  if (onlyOrders) {
    return (
      <View style={styles.bottomNavContent}>
        <TouchableOpacity style={styles.navTabActive}>
          <View style={styles.activeTabBg}>
            <Ionicons name="file-tray-stacked-outline" size={22} color="#7C3AED" />
          </View>
          <Text style={styles.navTabTextActive}>Orders</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <View style={styles.bottomNavContent}>
      <TouchableOpacity style={activeTab === 'home' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('home')}>
        <View style={activeTab === 'home' ? styles.activeTabBg : styles.iconContainer}>
          <Ionicons name="home" size={22} color={activeTab === 'home' ? '#7C3AED' : '#6B7280'} />
        </View>
        <Text style={activeTab === 'home' ? styles.navTabTextActive : styles.navTabText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={activeTab === 'orders' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('orders')}>
        <View style={activeTab === 'orders' ? styles.activeTabBg : styles.iconContainer}>
          <Ionicons name="file-tray-stacked-outline" size={22} color={activeTab === 'orders' ? '#7C3AED' : '#6B7280'} />
        </View>
        <Text style={activeTab === 'orders' ? styles.navTabTextActive : styles.navTabText}>Orders</Text>
      </TouchableOpacity>
      <TouchableOpacity style={activeTab === 'finance' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('finance')}>
        <View style={activeTab === 'finance' ? styles.activeTabBg : styles.iconContainer}>
          <Ionicons name="card-outline" size={22} color={activeTab === 'finance' ? '#7C3AED' : '#6B7280'} />
        </View>
        <Text style={activeTab === 'finance' ? styles.navTabTextActive : styles.navTabText}>Finance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={activeTab === 'inventory' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('inventory')}>
        <View style={activeTab === 'inventory' ? styles.activeTabBg : styles.iconContainer}>
          <Ionicons name="cube-outline" size={22} color={activeTab === 'inventory' ? '#7C3AED' : '#6B7280'} />
        </View>
        <Text style={activeTab === 'inventory' ? styles.navTabTextActive : styles.navTabText}>Inventory</Text>
      </TouchableOpacity>
      <TouchableOpacity style={activeTab === 'reports' ? styles.navTabActive : styles.navTab} onPress={() => onTabPress('reports')}>
        <View style={activeTab === 'reports' ? styles.activeTabBg : styles.iconContainer}>
          <Ionicons name="document-text-outline" size={22} color={activeTab === 'reports' ? '#7C3AED' : '#6B7280'} />
        </View>
        <Text style={activeTab === 'reports' ? styles.navTabTextActive : styles.navTabText}>Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navTabActive: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  activeTabBg: {
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    borderRadius: 16,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  navTabText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginTop: 4,
  },
  navTabTextActive: {
    fontSize: 11,
    color: '#7C3AED',
    fontWeight: '700',
    marginTop: 2,
  },
});

export default BottomNav;
