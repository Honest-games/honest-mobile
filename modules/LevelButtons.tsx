import { Button } from '@/UI'
import { ILevelData } from '@/services/types/types'
import { StyleSheet, View } from 'react-native'
import React from "react";

interface LevelButtonsProps {
	levels: ILevelData[] | undefined
	onButtonPress?: (levelId: string, buttonName: string, colorButton: string) => void
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
			{levels &&
				levels.map(button => (
					<Button
						isButtonPressed={isButtonPressed}
						key={button.ID}
						title={button.Name}
						onPress={
							onButtonPress && (() => onButtonPress(button.ID, button.Name, button.ColorButton))
						}
						color={'#919F67'}
						bgColor={button.ColorButton}
						size={size}
					/>
				))}
		</View>
	)
}
