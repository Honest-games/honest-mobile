import Label from '@/UI/Label'
import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import React from 'react'
import { StyleSheet, View } from 'react-native'

interface ITopContent {
	level?: IQuestonLevelAndColor
}

const CardTopContent = ({ level }: ITopContent) => {
	return (
		<View style={styles.topContent}>
			{!level ? null : (
				<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
					<Label
						levelBgColor={level.levelBgColor}
						levelTitle={level.levelTitle}
					/>
				</View>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	topContent: {
		justifyContent: 'center',
		width: '100%',
		height: 20
	}
})
export default CardTopContent
