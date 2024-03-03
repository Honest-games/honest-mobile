import Colors from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.deepGray
			}}
		>
			<Tabs.Screen
				name='index'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialCommunityIcons name='cards' size={24} color={color} />
					)
				}}
			/>
			{/* <Tabs.Screen
				name='two'
				options={{
					tabBarLabel: 'Decks',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<Ionicons name='heart' size={size} color={color} />
					)
				}}
			/> */}
		</Tabs>
	)
}
