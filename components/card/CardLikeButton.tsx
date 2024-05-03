import { getLevelColor } from '@/features/converters/button-converters'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

interface ICustomView {
	color: string
	handleLike: () => void
	isLiked: boolean
}

const CardLikeButton = ({ color, handleLike, isLiked }: ICustomView) => {
	return (
		<View style={{ width: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
				<TouchableOpacity onPress={handleLike}>
					<AntDesign
						name={isLiked ? 'heart' : 'hearto'}
						size={24}
						color={getLevelColor(color)}
					/>
				</TouchableOpacity>
			</View>
		</View>
	)
}

export default CardLikeButton
