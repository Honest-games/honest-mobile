import { LevelInfo } from '@/UI/LevelInfo'
import Colors from '@/constants/Colors'
import useFetchDeckSvg from '@/features/hooks/useFetchDeckSvg'
import { IDeck, ILevelData } from '@/services/types/types'
import { FontAwesome } from '@expo/vector-icons'
import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react'
import {
	Dimensions,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	ViewStyle
} from 'react-native'
import { SvgXml } from 'react-native-svg'
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
	deckId: string
}

export type Ref = BottomSheetModal

const CustomBottomSheetModal = forwardRef<Ref, CustomBottomSheetModalProps>(
	({ deck, error, levels, levelInfo, isFetching, isLoading, deckId }, ref) => {
		const {
			svgData,
			isLoadingImage,
			error: errorSvg
		} = useFetchDeckSvg(deck?.image_id)

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
		const [completedCount, setCompletedCount] = useState<any>(0)

		useEffect(() => {
			async function fetchData() {
				try {
					const storedCompletedCount = await AsyncStorage.getItem(
						`completedCount_${deckId}`
					)

					if (storedCompletedCount) {
						setCompletedCount(parseInt(storedCompletedCount))
					}
				} catch (e) {
					console.error('Ошибка чтения из AsyncStorage:', e)
				}
			}
			fetchData()
		}, [deck, setCompletedCount, completedCount, ref, deckId])

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
					<View style={{ flex: 1, marginBottom: 65, gap: 20 }}>
						<DeckProgressBar completedCount={completedCount} deck={deck} />
						<DeckInformation
							svgIcon={svgData}
							isLoading={isLoadingImage}
							deck={deck}
						/>
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
	style,
	svgIcon,
	isLoading
}: {
	deck: IDeck | undefined
	style?: ViewStyle
	svgIcon: any
	isLoading: boolean
}) => (
	<View style={[styles.commonInformation, style]}>
		{isLoading ? (
			<Text>Loading...</Text>
		) : svgIcon ? (
			<View>
				<SvgXml xml={svgIcon} width={121} height={118} />
			</View>
		) : (
			<Text>SVG not available</Text>
		)}
		<Text style={styles.deckTitle}>
			{deck?.name.toLowerCase() || 'Название колоды'}
		</Text>
		<Text style={styles.deckDescription}>
			{deck?.description.toLowerCase() || 'описание колоды'}
		</Text>
	</View>
)

const DeckProgressBar = ({
	completedCount,
	deck,
	style
}: {
	deck: IDeck | undefined
	style?: ViewStyle
	completedCount: number
}) => {
	const [pressHeart, setPressHeart] = useState(false)
	return (
		<View style={[styles.topContent, style]}>
			<View style={styles.deckProgress}>
				<View style={styles.progressBar}>
					<View style={styles.progressColor}></View>
				</View>
				<Text style={styles.progressText}>{`${completedCount}/100`}</Text>
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

	commonInformation: {
		marginTop: 20,
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},

	deckTitle: {
		color: Colors.deepGray,
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 33
	},

	deckDescription: {
		width: '90%',
		color: Colors.grey1,
		fontSize: 16,
		fontWeight: '400',
		textAlign: 'center',
		marginTop: 33
	},

	bottomSheetModal: {
		borderRadius: 32
	}
})

export default CustomBottomSheetModal
