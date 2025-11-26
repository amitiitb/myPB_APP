import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import OrderCard, { Order } from '../components/OrderCard';

const ORDERS: Order[] = [
	{
		id: '1',
		date: '06 Nov, 2025',
		name: 'Amit',
		status: ['Ready to Deliver', 'Unfulfilled'],
		price: '$20000',
		items: 1998,
		details: 'Order details for Amit',
		tags: ['Ready to Deliver', 'Unfulfilled'],
	},
	{
		id: '2',
		date: '01 Nov, 2025',
		name: 'Rohit Singh',
		status: ['Composing', 'Unfulfilled'],
		price: '$233000',
		items: 5000,
		details: 'Order details for Rohit Singh',
		tags: ['Composing', 'Unfulfilled'],
	},
	{
		id: '3',
		date: '15 Nov, 2025',
		name: 'Priya Sharma',
		status: ['Order Placed', 'Unfulfilled'],
		price: '$15000',
		items: 250,
		details: 'Order details for Priya Sharma',
		tags: ['Order Placed', 'Unfulfilled'],
	},
];

const FILTERS = ['All', 'Composing', 'Proofreading', 'Printing'];

const OrdersScreen: React.FC = () => {
	const [selectedFilter, setSelectedFilter] = useState('All');
	const [search, setSearch] = useState('');
	const [showDetails, setShowDetails] = useState<string | null>(null);
	const navigation = require('expo-router').useNavigation();

	const filteredOrders = ORDERS.filter(order =>
		(selectedFilter === 'All' || order.tags.includes(selectedFilter)) &&
		(search === '' || order.name.toLowerCase().includes(search.toLowerCase()) || order.id.includes(search))
	);

	return (
		<View style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					<Text style={styles.headerTitle}>Orders</Text>
					<View style={styles.headerActions}>
						<View style={styles.langToggle}>
							<TouchableOpacity style={[styles.langBtn, { backgroundColor: '#fff' }]}><Text style={[styles.langText, { color: '#7C3AED' }]}>EN</Text></TouchableOpacity>
							<TouchableOpacity style={styles.langBtn}><Text style={styles.langText}>HI</Text></TouchableOpacity>
						</View>
						<TouchableOpacity style={styles.iconBtn}><Ionicons name="notifications" size={22} color="#fff" /><View style={styles.badge}><Text style={styles.badgeText}>4</Text></View></TouchableOpacity>
						<TouchableOpacity style={styles.iconBtn}><Ionicons name="settings" size={22} color="#fff" /></TouchableOpacity>
					</View>
				</View>
			</View>

			{/* Filters */}
			<View style={styles.filterRow}>
				{FILTERS.map(f => (
					<TouchableOpacity
						key={f}
						style={[styles.filterChip, selectedFilter === f && styles.filterChipActive]}
						onPress={() => setSelectedFilter(f)}
					>
						<Text style={[styles.filterChipText, selectedFilter === f && styles.filterChipTextActive]}>{f}</Text>
					</TouchableOpacity>
				))}
				<TouchableOpacity style={styles.filterIcon}><Ionicons name="filter" size={20} color="#7C3AED" /></TouchableOpacity>
			</View>

			{/* Search Bar */}
			<View style={styles.searchBar}>
				<Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
				<TextInput
					style={styles.searchInput}
					placeholder="Search by name, phone, order ID..."
					value={search}
					onChangeText={setSearch}
					placeholderTextColor="#9CA3AF"
				/>
			</View>

			{/* Orders List */}
			<ScrollView contentContainerStyle={styles.ordersList}>
				{filteredOrders.map(order => (
					<OrderCard
						key={order.id}
						order={order}
						showDetails={showDetails === order.id}
						onToggleDetails={() => setShowDetails(showDetails === order.id ? null : order.id)}
					/>
				))}
				{/* Floating Add New Order Button */}
				<TouchableOpacity style={styles.addOrderBtn} onPress={() => navigation.navigate('add-order-step1')}>
					<Ionicons name="add" size={28} color="#fff" />
					<Text style={styles.addOrderBtnText}>Add New Order</Text>
				</TouchableOpacity>
			</ScrollView>

			{/* Bottom Navigation */}
			<View style={styles.bottomNav}>
				<NavItem icon="home" label="Home" active={false} />
				<NavItem icon="albums" label="Orders" active={true} />
				<NavItem icon="logo-rupiah" label="Finance" active={false} />
				<NavItem icon="layers" label="Inventory" active={false} />
				<NavItem icon="bar-chart" label="Reports" active={false} />
			</View>
		</View>
	);
};

const NavItem = ({ icon, label, active }: { icon: string; label: string; active: boolean }) => (
	<TouchableOpacity style={styles.navItem}>
		<Ionicons name={icon as any} size={26} color={active ? '#7C3AED' : '#6B7280'} />
		<Text style={[styles.navLabel, active && { color: '#7C3AED', fontWeight: '700' }]}>{label}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#fff',
	},
	header: {
		backgroundColor: '#7C3AED',
		paddingTop: 32,
		paddingBottom: 18,
		paddingHorizontal: 18,
		borderBottomLeftRadius: 24,
		borderBottomRightRadius: 24,
	},
	headerRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	headerTitle: {
		fontSize: 28,
		fontWeight: '700',
		color: '#fff',
	},
	headerActions: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 10,
	},
	langToggle: {
		flexDirection: 'row',
		backgroundColor: '#A78BFA',
		borderRadius: 16,
		marginRight: 8,
		overflow: 'hidden',
	},
	langBtn: {
		paddingVertical: 4,
		paddingHorizontal: 16,
		borderRadius: 16,
	},
	langText: {
		fontSize: 13,
		fontWeight: '700',
	},
	iconBtn: {
		marginHorizontal: 2,
		position: 'relative',
	},
	badge: {
		position: 'absolute',
		top: -6,
		right: -6,
		backgroundColor: '#EF4444',
		borderRadius: 10,
		paddingHorizontal: 5,
		paddingVertical: 1,
		minWidth: 18,
		alignItems: 'center',
		justifyContent: 'center',
	},
	badgeText: {
		color: '#fff',
		fontSize: 11,
		fontWeight: '700',
	},
	filterRow: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 18,
		marginTop: 12,
		marginBottom: 8,
		gap: 8,
	},
	filterChip: {
		paddingVertical: 6,
		paddingHorizontal: 16,
		borderRadius: 16,
		backgroundColor: '#F3F4F6',
	},
	filterChipActive: {
		backgroundColor: '#7C3AED',
	},
	filterChipText: {
		fontSize: 14,
		color: '#6B7280',
		fontWeight: '600',
	},
	filterChipTextActive: {
		color: '#fff',
	},
	filterIcon: {
		marginLeft: 4,
		padding: 6,
		borderRadius: 16,
		backgroundColor: '#F3F4F6',
	},
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F3F4F6',
		borderRadius: 14,
		marginHorizontal: 18,
		marginBottom: 8,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	searchInput: {
		flex: 1,
		fontSize: 15,
		color: '#111827',
		paddingVertical: 0,
	},
	ordersList: {
		paddingHorizontal: 18,
		paddingBottom: 120,
	},
	addOrderBtn: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#EC4899',
		borderRadius: 32,
		paddingVertical: 16,
		paddingHorizontal: 32,
		alignSelf: 'center',
		marginTop: 12,
		position: 'absolute',
		bottom: 60,
		shadowColor: '#EC4899',
		shadowOpacity: 0.18,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 6,
		zIndex: 10,
	},
	addOrderBtnText: {
		color: '#fff',
		fontSize: 18,
		fontWeight: '700',
		marginLeft: 8,
	},
	bottomNav: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		backgroundColor: '#fff',
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderTopWidth: 1,
		borderTopColor: '#E5E7EB',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 20,
	},
	navItem: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingVertical: 4,
	},
	navLabel: {
		fontSize: 12,
		color: '#6B7280',
		fontWeight: '600',
		marginTop: 2,
		textAlign: 'center',
	},
});

export default OrdersScreen;
