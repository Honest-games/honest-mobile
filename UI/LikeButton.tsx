import Colors from '@/constants/Colors'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'

interface LikeButtonProps {
	handleLike: () => void
	isLiked: () => boolean
}

const LikeButton: React.FC<LikeButtonProps> = ({ handleLike, isLiked }) => {
	return (
		<TouchableOpacity style={styles.likes} onPress={handleLike}>
			<FontAwesome
				style={{
					marginLeft: 10,
					marginRight: 10
				}}
				name={isLiked() ? 'heart' : 'heart-o'}
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
