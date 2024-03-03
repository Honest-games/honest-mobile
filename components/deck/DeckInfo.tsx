import DeckLogo from '@/assets/svg/DeckLogo'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

interface DeckInfoProps {
	title: string | undefined
	id: string | number
}

const DeckInfo: React.FC<DeckInfoProps> = ({ title, id }) => {
	return (
		<View style={styles.commonInformaion}>
			<DeckLogo />
			<View style={{ width: '100%' }}>
				<Text numberOfLines={1} style={styles.text}>
					{title}
				</Text>
			</View>
			<Link href={`/decks/${id}`} asChild>
				<TouchableOpacity style={styles.button}>
					<Text style={{ color: 'white', fontSize: 16, marginBottom: 5 }}>
						play
					</Text>
				</TouchableOpacity>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	commonInformaion: {
		flex: 1,
		zIndex: 100,
		height: '100%',

		flexDirection: 'column',
		justifyContent: 'center',

		alignItems: 'center',
		gap: 20
	},
	text: {
		textAlign: 'center',
		color: Colors.deepGray,
		fontSize: 16,
		fontWeight: 'bold'
	},
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 32,
		width: 86,
		backgroundColor: Colors.orange,
		borderRadius: 24.5
	}
})

export default DeckInfo
