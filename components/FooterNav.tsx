import BottomNav from '@/components/BottomNav';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface FooterNavProps {
  scss?: any;
  activeTab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports';
  onTabPress: (tab: 'home' | 'orders' | 'finance' | 'inventory' | 'reports') => void;
  onlyOrders?: boolean;
}

const FooterNav: React.FC<FooterNavProps> = ({ scss, activeTab, onTabPress, onlyOrders }) => {
  return (
    <View style={styles.footerContainer} pointerEvents="box-none">
      <BlurView intensity={80} tint="light" style={styles.bottomNavBar}>
        <BottomNav activeTab={activeTab} onTabPress={onTabPress} onlyOrders={onlyOrders} />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    paddingHorizontal: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
  },
  bottomNavBar: {
    height: 70,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
});

export default FooterNav;
