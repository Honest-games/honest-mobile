import { LevelInfo } from '@/UI/LevelInfo'
import DeckLogoModal from '@/assets/svg/DeckLogoModal'
import Colors from '@/constants/Colors'
import { IDeck, ILevelData } from '@/services/types/types'
import { FontAwesome } from '@expo/vector-icons'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { forwardRef, useCallback, useMemo, useState } from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle
} from 'react-native'
import { LevelButtons } from './LevelButtons'
import Loader from './Loader'

const { width } = Dimensions.get('window')

interface CustomBottomSheetModalProps {
	deck: IDeck | undefined
	error: any
	levels: ILevelData[] | undefined
	levelInfo: string
	isFetching: boolean
	isLoading: boolean
}

export type Ref = BottomSheetModal

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
	({ deck, error, levels, levelInfo, isFetching, isLoading }, ref) => {
		const renderBackdrop = useCallback(
			(props: any) => (
				<BottomSheetBackdrop
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					{...props}
				/>
			),
			[]
		)

		const snapPoints = useMemo(() => ['80%'], [])

		return (
			<BottomSheetModal
				ref={ref}
				index={0}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				backgroundStyle={styles.bottomSheetModal}
			>
				{isFetching || isLoading ? (
					<Loader />
				) : (
					<View style={{ flex: 1, marginBottom: 100, gap: 20 }}>
						<DeckProgressBar deck={deck} />
						<DeckInformation deck={deck} />
						<LevelInfo levelInfo={levelInfo} />
						<LevelButtons levels={levels} />
					</View>
				)}
			</BottomSheetModal>
		)
	}
)

const DeckInformation = ({
	deck,
	style
}: {
	deck: IDeck | undefined
	style?: ViewStyle
}) => (
	<View style={[styles.commonInformation, style]}>
		<DeckLogoModal />

		<Text style={styles.deckTitle}>{deck?.name || 'Название колоды'}</Text>
		<Text style={styles.deckDescription}>
			{deck?.description || 'Описание колоды'}
		</Text>
	</View>
)

const DeckProgressBar = ({
	deck,
	style
}: {
	deck: IDeck | undefined
	style?: ViewStyle
}) => {
	const [pressHeart, setPressHeart] = useState(false)

	return (
		<View style={[styles.topContent, style]}>
			<View style={styles.deckProgress}>
				<View style={styles.progressBar}>
					<View style={styles.progressColor}></View>
				</View>
				<Text style={styles.progressText}>30/100</Text>
			</View>
			<TouchableOpacity
				style={styles.likes}
				onPress={() => setPressHeart(!pressHeart)}
			>
				<FontAwesome
					style={{
						marginLeft: 10,
						marginRight: 10
					}}
					name={pressHeart ? 'heart' : 'heart-o'}
					size={16}
					color={Colors.orange}
				/>
			</TouchableOpacity>
		</View>
	)
}

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

export default CustomBottomSheetModal
