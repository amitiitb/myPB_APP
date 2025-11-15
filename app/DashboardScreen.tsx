import HeaderBar from '@/components/HeaderBar';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
    Dimensions,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC = () => {
  const [dateFilter, setDateFilter] = useState('Last 7 Days');
  const notificationCount = 4;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <HeaderBar 
        title="Dashboard" 
        notificationCount={notificationCount}
        onNotificationPress={() => console.log('Notifications pressed')}
        onSettingsPress={() => console.log('Settings pressed')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Business Reports Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Business Reports</Text>
          <TouchableOpacity style={styles.dateFilterBtn}>
            <Ionicons name="calendar-outline" size={16} color="#6B7280" style={{ marginRight: 6 }} />
            <Text style={styles.dateFilterText}>{dateFilter}</Text>
          </TouchableOpacity>
        </View>
        {/* Report Cards Grid */}
        <View style={styles.reportGrid}>
          {/* Card 1: Total Orders */}
          <View style={styles.reportCard}>
            <Text style={[styles.reportBigNum, { color: '#7C3AED' }]}>0</Text>
            <Text style={styles.reportCardTitle}>Total Orders</Text>
            <Text style={styles.reportPercentDrop}>▼ 100%</Text>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabel}>In Progress:</Text><Text style={styles.reportSubValue}>0</Text></View>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabel}>Delivered:</Text><Text style={styles.reportSubValue}>0</Text></View>
            {/* Completion Rate Bar */}
            <View style={styles.completionBarBg}>
              <View style={styles.completionBarFill} />
            </View>
          </View>
          {/* Card 2: Total Sales */}
          <View style={styles.reportCard}>
            <Text style={[styles.reportBigNum, { color: '#10B981' }]}>0</Text>
            <Text style={styles.reportCardTitle}>Total Sales</Text>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabel}>Received:</Text><Text style={styles.reportSubValue}>0</Text></View>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabel}>Due:</Text><Text style={styles.reportSubValue}>0</Text></View>
          </View>
          {/* Card 3: Average Order */}
          <View style={styles.reportCard}>
            <Text style={[styles.reportBigNum, { color: '#7C3AED' }]}>0</Text>
            <Text style={styles.reportCardTitle}>Avg Order (In Rs)</Text>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabelSmall}>Highest</Text><Text style={styles.reportSubValueSmall}>0</Text></View>
            <View style={styles.reportSubRow}><Text style={styles.reportSubLabelSmall}>Lowest</Text><Text style={styles.reportSubValueSmall}>0</Text></View>
          </View>
          {/* Card 4: Total Customers */}
          <View style={styles.reportCard}>
            <Text style={[styles.reportBigNum, { color: '#EF4444' }]}>5</Text>
            <Text style={styles.reportCardTitle}>Total Customers</Text>
            <View style={styles.reportSubRow}><Ionicons name="person-add-outline" size={16} color="#10B981" style={{ marginRight: 4 }} /><Text style={styles.reportSubLabelSmall}>New:</Text><Text style={styles.reportSubValueSmall}>0</Text></View>
            <View style={styles.reportSubRow}><Ionicons name="repeat-outline" size={16} color="#7C3AED" style={{ marginRight: 4 }} /><Text style={styles.reportSubLabelSmall}>Repeated:</Text><Text style={styles.reportSubValueSmall}>0</Text></View>
          </View>
        </View>

        {/* Order Overview Box */}
        <TextInput
          style={styles.orderOverviewBox}
          placeholder="Order Overview..."
          placeholderTextColor="#9CA3AF"
        />

        {/* Category Breakdown Section */}
        <Text style={styles.sectionTitle}>Category Breakdown</Text>
        <View style={styles.categoryBox} />

        {/* Add New Order Button */}
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <TouchableOpacity style={styles.addOrderBtn}>
            <Ionicons name="add" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addOrderBtnText}>Add New Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Glass Bottom Navigation Bar */}
      <BlurView intensity={80} tint="light" style={styles.bottomNavBar}>
        <View style={styles.bottomNavContent}>
          <TouchableOpacity style={styles.navTabActive}>
            <View style={styles.activeTabBg}>
              <Ionicons name="home" size={22} color="#7C3AED" />
            </View>
            <Text style={styles.navTabTextActive}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Ionicons name="file-tray-stacked-outline" size={22} color="#6B7280" />
            <Text style={styles.navTabText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Ionicons name="card-outline" size={22} color="#6B7280" />
            <Text style={styles.navTabText}>Finance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Ionicons name="cube-outline" size={22} color="#6B7280" />
            <Text style={styles.navTabText}>Inventory</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navTab}>
            <Ionicons name="people-outline" size={22} color="#6B7280" />
            <Text style={styles.navTabText}>Customers</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  dateFilterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  dateFilterText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  reportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reportCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  reportBigNum: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 2,
  },
  reportCardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  reportPercentDrop: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  reportSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reportSubLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginRight: 4,
  },
  reportSubValue: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '600',
  },
  reportSubLabelSmall: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 2,
  },
  reportSubValueSmall: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '600',
    marginRight: 6,
  },
  completionBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 2,
  },
  completionBarFill: {
    width: '0%',
    height: 6,
    backgroundColor: '#7C3AED',
    borderRadius: 4,
  },
  orderOverviewBox: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#374151',
  },
  categoryBox: {
    width: '100%',
    height: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  addOrderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: width * 0.7,
    borderRadius: 26,
    backgroundColor: 'transparent',
    overflow: 'hidden',
    // Gradient background will be added inline
  },
  addOrderBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomNavBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: Platform.OS === 'ios' ? 20 : 12,
    height: 70,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
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

export default DashboardScreen;
