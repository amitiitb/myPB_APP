import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface Order {
  id: string;
  date: string;
  name: string;
  status: string[];
  price: string;
  items: number;
  details: string;
  tags: string[];
}

interface Props {
  order: Order;
  showDetails: boolean;
  onToggleDetails: () => void;
}

const OrderCard: React.FC<Props> = ({ order, showDetails, onToggleDetails }) => (
  <View style={styles.orderCard}>
    <Text style={styles.orderDate}>{order.date}</Text>
    <Text style={styles.orderName}>{order.name}</Text>
    <View style={styles.statusRow}>
      {order.status.map((s, i) => (
        <View key={i} style={[styles.statusBadge, s === 'Unfulfilled' ? styles.statusUnfulfilled : s === 'Ready to Deliver' ? styles.statusReady : s === 'Composing' ? styles.statusComposing : styles.statusPlaced]}>
          <Text style={[styles.statusBadgeText, s === 'Unfulfilled' ? styles.statusUnfulfilledText : s === 'Ready to Deliver' ? styles.statusReadyText : s === 'Composing' ? styles.statusComposingText : styles.statusPlacedText]}>{s}</Text>
        </View>
      ))}
    </View>
    <View style={styles.orderInfoRow}>
      <Text style={styles.orderPrice}>{order.price}</Text>
      <Text style={styles.orderItems}>{order.items} item</Text>
    </View>
    <TouchableOpacity onPress={onToggleDetails}>
      <Text style={styles.showDetails}>{showDetails ? 'Hide Order Details' : 'Show Order Details'} <Ionicons name={showDetails ? 'chevron-up' : 'chevron-down'} size={16} color="#7C3AED" /></Text>
    </TouchableOpacity>
    {showDetails && (
      <View style={styles.orderDetailsBox}>
        <Text style={styles.orderDetailsText}>{order.details}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  orderDate: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 2,
  },
  orderName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statusUnfulfilled: {
    backgroundColor: '#FEE2E2',
  },
  statusUnfulfilledText: {
    color: '#EF4444',
  },
  statusReady: {
    backgroundColor: '#FDE68A',
  },
  statusReadyText: {
    color: '#F59E42',
  },
  statusComposing: {
    backgroundColor: '#FDE68A',
  },
  statusComposingText: {
    color: '#F59E42',
  },
  statusPlaced: {
    backgroundColor: '#FDE68A',
  },
  statusPlacedText: {
    color: '#F59E42',
  },
  orderInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  orderItems: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  showDetails: {
    color: '#7C3AED',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  orderDetailsBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  orderDetailsText: {
    fontSize: 14,
    color: '#374151',
  },
});

export default OrderCard;
