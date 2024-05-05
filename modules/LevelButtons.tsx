import { Button } from '@/UI'
import { ILevelData } from '@/services/types/types'
import { StyleSheet, View } from 'react-native'
import React from "react";

interface LevelButtonsProps {
	levels: ILevelData[]
	onButtonPress?: (level: ILevelData) => void
	size?: 'large' | 'small'
	isButtonPressed?: boolean
}

export const LevelButtons: React.FC<LevelButtonsProps> = ({
	levels,
	onButtonPress,
	size,
	isButtonPressed
}) => {
	const styles = StyleSheet.create({
		sectionButtons: {
			alignItems: 'center',
			flexDirection: 'column',
			width: '100%',
			gap: 12
		}
	})

	return (
		<View style={styles.sectionButtons}>
			{levels.map(level => (
					<Button
						isButtonPressed={isButtonPressed}
						key={level.ID}
						title={level.Name}
						onPress={
							onButtonPress && (() => onButtonPress(level))
						}
						color={'#919F67'}
						bgColor={level.ColorButton}
						size={size}
					/>
				))}
		</View>
	)
}
