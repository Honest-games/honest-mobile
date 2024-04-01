import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface ICustomView {
	level?: IQuestonLevelAndColor
	handleLike: () => void
	isLiked: boolean | null
}

const CardLikeButton = ({ level, 	handleLike,
	isLiked }: ICustomView) => {
	return (
		<View style={{ width: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
				{!level ? null : (
					<TouchableOpacity onPress={handleLike}>
						<AntDesign
							name={isLiked ? 'heart' : 'hearto'}
							size={24}
							color={level ? level.levelBgColor : Colors.deepBlue}
						/>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}

export default CardLikeButton