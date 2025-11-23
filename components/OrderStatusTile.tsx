import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface OrderStatusTileProps {
  label: string;
  count: number;
  icon: string;
  color: string;
  onPress?: () => void;
}

const OrderStatusTile: React.FC<OrderStatusTileProps> = ({
  label,
  count,
  icon,
  color,
  onPress,
}) => {
  const { darkMode } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.tile,
        darkMode && styles.tileDark,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon Background */}
      <View style={[
        styles.iconBg,
        { backgroundColor: color + '22' }
      ]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>

      {/* Label */}
      <Text style={[styles.label, darkMode && styles.labelDark]}>
        {label}
      </Text>

      {/* Count */}
      <Text style={[styles.count, { color }]}>
        {count}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: '32%',
  },
  tileDark: {
    backgroundColor: '#374151',
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  labelDark: {
    color: '#D1D5DB',
  },
  count: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
});

export default OrderStatusTile;
