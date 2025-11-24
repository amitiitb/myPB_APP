import { useTheme } from '@/context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
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
  gradientColors?: [string, string];
}

const InFocusPagerCard: React.FC<InFocusPagerCardProps> = ({
  title,
  stats,
  backgroundColor = '#FFFFFF',
  borderColor = '#E5E7EB',
  gradientColors = ['#F0F4FF', '#EDE9FE'],
}) => {
  const { darkMode } = useTheme();

  const content = (
    <View style={styles.cardContent}>
      {/* Title */}
      <Text style={[styles.cardTitle, darkMode && styles.cardTitleDark]}>
        {title}
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <View key={`stat-${idx}`} style={styles.statItem}>
            {/* Icon Container with Gradient */}
            <LinearGradient
              colors={[`${stat.color}30`, `${stat.color}10`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              <Ionicons name={stat.icon as any} size={28} color={stat.color} />
            </LinearGradient>

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

  if (darkMode) {
    return (
      <View
        style={[
          styles.card,
          styles.cardDark,
          {
            backgroundColor: '#374151',
            borderColor: '#4B5563',
          },
        ]}
      >
        {content}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { borderColor }]}
    >
      {content}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 320,
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
    justifyContent: 'center',
  },
  cardDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  cardContent: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
    letterSpacing: 0.5,
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
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statLabelDark: {
    color: '#D1D5DB',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  statValueDark: {
    color: '#FFFFFF',
  },
});

export default InFocusPagerCard;
