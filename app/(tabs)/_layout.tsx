import Colors from '@/constants/Colors'
import { useAppSelector } from '@/features/hooks/useRedux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import React from 'react'

export default function TabLayout() {

	const splashAnimationFinished = useAppSelector((state) => state.splash.splashAnimationFinished);
	console.log(splashAnimationFinished)
	return (
		<Tabs
			
			screenOptions={{
				tabBarStyle: {display: splashAnimationFinished ? "none" : "flex"},
				tabBarActiveTintColor: Colors.deepGray,
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
			
		</Tabs>
	)
}
