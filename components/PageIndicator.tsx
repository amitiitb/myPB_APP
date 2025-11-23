import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PageIndicatorProps {
  totalPages: number;
  currentPage: number;
}

const PageIndicator: React.FC<PageIndicatorProps> = ({ totalPages, currentPage }) => {
  const { darkMode } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalPages }).map((_, idx) => (
        <View
          key={`dot-${idx}`}
          style={[
            styles.dot,
            idx === currentPage && styles.dotActive,
            idx === currentPage && darkMode && styles.dotActiveDark,
            idx !== currentPage && darkMode && styles.dotInactiveDark,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  dotActive: {
    width: 24,
    backgroundColor: '#7C3AED',
  },
  dotActiveDark: {
    backgroundColor: '#A78BFA',
  },
  dotInactiveDark: {
    backgroundColor: '#4B5563',
  },
});

export default PageIndicator;
