import Colors from '@/constants/Colors'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native'
import React from "react";
const { width } = Dimensions.get('window')

export const LevelInfo = ({
	levelInfo,
	style
}: {
	levelInfo: string
	style?: ViewStyle
}) => {
	const { t } = useTranslation()
	return (
		<View style={[styles.levelsInfo, style]}>
			<Text style={styles.levelsInfoText}>{t(levelInfo)}</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	levelsInfo: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	levelsInfoText: {
		color: Colors.lightGrey,
		fontSize: 12,
		fontWeight: '400'
	}
})
