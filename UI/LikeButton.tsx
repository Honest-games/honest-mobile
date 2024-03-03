import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

interface LikeButtonProps {
	pressHeart: boolean
	setPressHeart: React.Dispatch<React.SetStateAction<boolean>>
}

const LikeButton: React.FC<LikeButtonProps> = ({
	pressHeart,
	setPressHeart
}) => {
	return (
		<TouchableOpacity
			style={styles.likes}
			onPress={() => setPressHeart(!pressHeart)}
		>
			<FontAwesome
				style={{
					marginLeft: 10,
					marginRight: 10
				}}
				name={pressHeart ? 'heart' : 'heart-o'}
				size={16}
				color={Colors.orange}
			/>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	likes: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 20,
		backgroundColor: '#F2F2F2',
		borderRadius: 10
	}
})

export default LikeButton
