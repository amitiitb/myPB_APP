import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface CategoryCardProps {
  name: string;
  icon: string;
  backgroundColor?: string;
  textColor?: string;
  onPress?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  icon,
  backgroundColor = '#F3E8FF',
  textColor = '#7C3AED',
  onPress,
}) => {
  const { darkMode } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        darkMode && styles.cardDark,
        { backgroundColor: darkMode ? '#374151' : backgroundColor }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Ionicons 
          name={icon as any} 
          size={32} 
          color={darkMode ? '#A78BFA' : textColor} 
        />
      </View>

      {/* Category Name */}
      <Text style={[
        styles.categoryName,
        darkMode && styles.categoryNameDark
      ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F3E8FF',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  cardDark: {
    backgroundColor: '#374151',
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  categoryNameDark: {
    color: '#FFFFFF',
  },
});

export default CategoryCard;
