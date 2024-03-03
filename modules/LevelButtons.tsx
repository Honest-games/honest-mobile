import { Button } from '@/UI'
import Colors from '@/constants/Colors'
import { ILevelData } from '@/services/types/types'
import { StyleSheet, View } from 'react-native'

interface LevelButtonsProps {
	levels: ILevelData[] | undefined
	onButtonPress?: (levelId: string, buttonName: string) => void
	size?: 'large' | 'small'
}

export const LevelButtons: React.FC<LevelButtonsProps> = ({
	levels,
	onButtonPress,
	size
}) => {
	const styles = StyleSheet.create({
		sectionButtons: {
			alignItems: 'center',
			flexDirection: 'column',
			width: '100%',
			gap: 12
		},
		buttons: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			borderRadius: 33.5,
			height: 33,
			width: '100%'
		},
		commonButton: {
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: 33.5,
			backgroundColor: Colors.primary,
			height: 54,
			width: 248
		},
		levelsInfo: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		levelInfoText: {
			color: Colors.primary,
			fontSize: 12,
			fontWeight: '400'
		}
	})

	return (
		<View style={styles.sectionButtons}>
			{levels &&
				levels.map(button => (
					<Button
						key={button.ID}
						title={button.Name}
						onPress={
							onButtonPress && (() => onButtonPress(button.ID, button.Name))
						}
						color={'#919F67'}
						size={size}
					/>
				))}
		</View>
	)
}
