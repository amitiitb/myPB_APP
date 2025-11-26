import { useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddOrderStep1 from '../components/AddOrderStep1';

const AddOrderStep1Page: React.FC = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions?.({ headerShown: false });
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9FF' }}>
      {/* Header - SafeAreaView for status bar spacing only */}
      <SafeAreaView style={{ backgroundColor: '#7A3EFF' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
            <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>
      {/* Content below header */}
      <View style={styles.container}>
        <AddOrderStep1 onNext={() => {}} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7A3EFF',
    paddingHorizontal: 20,
    height: 64,
  },
  iconBtn: {
    padding: 4,
    borderRadius: 16,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 16,
  },
});

export default AddOrderStep1Page;
