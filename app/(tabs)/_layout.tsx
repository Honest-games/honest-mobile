import Colors from '@/constants/Colors'
import { useAppSelector } from '@/features/hooks/useRedux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {
	const splashAnimationFinished = useAppSelector((state) => state.splash.splashAnimationFinished);
	return (
		<Tabs
			screenOptions={{
				tabBarStyle: {display: splashAnimationFinished ? "flex" : "none"},
				tabBarActiveTintColor: Colors.deepBlue,
				tabBarInactiveTintColor: Colors.grey,
				tabBarShowLabel: false
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
			
			<Tabs.Screen
				name='profile'
				options={{
					tabBarLabel: 'Profile',
					headerShown: false,
					tabBarIcon: ({ size, color }) => (
						<MaterialCommunityIcons name='account' size={24} color={color} />
					)
				}}
			/>
		</Tabs>
	)
}
