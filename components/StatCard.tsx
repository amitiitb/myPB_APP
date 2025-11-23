import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  backgroundColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  iconColor = '#7C3AED',
  backgroundColor = '#F3E8FF',
}) => {
  const { darkMode } = useTheme();

  return (
    <View style={[
      styles.card,
      darkMode && styles.cardDark,
      { backgroundColor: darkMode ? '#374151' : backgroundColor }
    ]}>
      {/* Icon Section */}
      {icon && (
        <View style={[
          styles.iconContainer,
          { backgroundColor: darkMode ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.1)' }
        ]}>
          <Ionicons name={icon as any} size={24} color={iconColor} />
        </View>
      )}

      {/* Label */}
      <Text style={[styles.label, darkMode && styles.labelDark]}>
        {label}
      </Text>

      {/* Main Value */}
      <Text style={[styles.value, darkMode && styles.valueDark]}>
        {value}
      </Text>

      {/* Subtitle (Optional) */}
      {subtitle && (
        <Text style={[styles.subtitle, darkMode && styles.subtitleDark]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 160,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
  },
  cardDark: {
    backgroundColor: '#374151',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
    color: '#9CA3AF',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  valueDark: {
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  subtitleDark: {
    color: '#6B7280',
  },
});

export default StatCard;
