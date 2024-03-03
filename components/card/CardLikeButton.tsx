import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface ICustomView {
	level?: IQuestonLevelAndColor
	press: boolean
	setPress: (press: boolean) => void
}

const CardLikeButton = ({ level, press, setPress }: ICustomView) => {
	return (
		<View style={{ width: '100%' }}>
			<View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
				{!level ? null : (
					<TouchableOpacity onPress={() => setPress(!press)}>
						<AntDesign
							name={press ? 'heart' : 'hearto'}
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