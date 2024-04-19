import Label from '@/UI/Label'
import {getLevelColor, IQuestonLevelAndColor} from '@/features/converters/button-converters'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import {ILevelData} from "@/services/types/types";

interface ITopContent {
	level: ILevelData
}

const CardTopContent = ({ level }: ITopContent) => {
	return (
		<View style={styles.topContent}>
			{!level ? null : (
				<View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
					<Label
						levelBgColor={getLevelColor(level.ColorButton)}
						levelTitle={level.Name}
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
