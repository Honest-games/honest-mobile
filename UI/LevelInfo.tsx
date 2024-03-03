import Colors from '@/constants/Colors'
import { Dimensions, StyleSheet, Text, View, ViewStyle } from 'react-native'
const { width } = Dimensions.get('window')

export const LevelInfo = ({
	levelInfo,
	style
}: {
	levelInfo: string
	style?: ViewStyle
}) => (
	<View style={[styles.levelsInfo, style]}>
		<Text style={styles.levelsInfoText}>{levelInfo}</Text>
	</View>
)

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		width: width,
		alignItems: 'center'
	},
	questionIcon: {
		position: 'absolute',
		right: 12,
		bottom: 12,
		zIndex: 1000
	},
	topContent: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		paddingHorizontal: 20
	},
	deckProgress: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	progressBar: {
		width: 80,
		height: 8,
		backgroundColor: '#EBEBEB',
		borderRadius: 4
	},
	progressColor: {
		backgroundColor: Colors.lightGreen,
		height: '100%',
		width: '30%',
		borderRadius: 4
	},
	progressText: {
		marginLeft: 10,
		color: '#ADADAD'
	},
	likes: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		height: 20,
		backgroundColor: '#F2F2F2',
		borderRadius: 10
	},
	likesText: {
		color: 'white',
		marginRight: 5
	},
	commonInformation: {
		marginTop: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	img: {
		height: 180,
		width: 180,
		borderRadius: 75
	},
	deckTitle: {
		color: Colors.deepGray,
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 33
	},
	deckDescriptionContainer: {
		marginTop: 10,
		width: '85%'
	},
	deckDescription: {
		width: '90%',
		color: Colors.grey1,
		fontSize: 16,
		fontWeight: '400',
		textAlign: 'center',
		marginTop: 33
	},
	levelsInfo: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	levelsInfoText: {
		color: Colors.grey1,
		fontSize: 12,
		fontWeight: '400'
	},
	sectionButtons: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 13,
		marginTop: 30,
		marginBottom: 30
	},
	bottomSheetModal: {
		borderRadius: 32
	}
})
