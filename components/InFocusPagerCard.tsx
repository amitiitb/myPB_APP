import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface StatItem {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

interface InFocusPagerCardProps {
  title: string;
  stats: StatItem[];
  backgroundColor?: string;
  borderColor?: string;
}

const InFocusPagerCard: React.FC<InFocusPagerCardProps> = ({
  title,
  stats,
  backgroundColor = '#FFFFFF',
  borderColor = '#E5E7EB',
}) => {
  const { darkMode } = useTheme();

  return (
    <View
      style={[
        styles.card,
        darkMode && styles.cardDark,
        {
          backgroundColor: darkMode ? '#374151' : backgroundColor,
          borderColor: darkMode ? '#4B5563' : borderColor,
        },
      ]}
    >
      {/* Title */}
      <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
        {title}
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <View key={`stat-${idx}`} style={styles.statItem}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${stat.color}22` },
              ]}
            >
              <Ionicons name={stat.icon as any} size={28} color={stat.color} />
            </View>

            {/* Label */}
            <Text style={[styles.statLabel, darkMode && styles.statLabelDark]}>
              {stat.label}
            </Text>

            {/* Value */}
            <Text
              style={[
                styles.statValue,
                darkMode && styles.statValueDark,
                { color: stat.color },
              ]}
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    justifyContent: 'center',
  },
  cardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  statLabelDark: {
    color: '#D1D5DB',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  statValueDark: {
    color: '#FFFFFF',
  },
});

export default InFocusPagerCard;
