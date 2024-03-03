import SampleOfSwitcher from '@/assets/svg/SampleOfSwitcher'
import DeckScrollView from '@/components/deck/DeckScrollView'
import { View } from '@/components/default/Themed'
import { useDecks } from '@/features/hooks'
import CustomBottomSheetModal from '@/modules/CustomBottomSheetModal'
import Loader from '@/modules/Loader'
import SearchBar from '@/UI/SearchBar'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'
import { Dimensions, Platform, SafeAreaView, StyleSheet } from 'react-native'
import Animated, {
	Extrapolate,
	interpolate,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const Page = () => {
	const {
		decks,
		isLoadingDecks,
		isFetchingDecks,
		error,
		deckId,
		setDeckId,
		levels,
		isFetchingLevels,
		selectedDeck,
		setSelectedDeck,
		filtedDecks,
		onFilteredDecks
	} = useDecks()

	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const scrollY = useSharedValue(0)
	const scrollRef = useAnimatedRef<Animated.ScrollView>()

	const scrollToTop = (scrollRef: any, scrollY: any) => {
		scrollRef.current?.scrollTo({ y: 0, animated: true })
	}

	const handleScrollToTop = () => {
		scrollToTop(scrollRef, scrollY)
	}

	const scrollHandler = useAnimatedScrollHandler({
		onScroll: event => {
			scrollY.value = event.contentOffset.y
		}
	})

	const searchBarStyle = useAnimatedStyle(() => {
		const searchBarWidth = interpolate(
			scrollY.value,
			[0, 100],
			[width - 144, 48],
			Extrapolate.CLAMP
		)
		return {
			width: withTiming(searchBarWidth, { duration: 500 })
		}
	})

	const handleDismissSheet = () => bottomSheetRef.current?.dismiss()
	const handleOpenSheet = (id: string) => {
		bottomSheetRef.current?.present()
		setDeckId(id)
	}

	return (
		<SafeAreaView style={styles.container}>
			<View
				style={{
					flex: 1,
					position: 'absolute',
					top: 50,
					left: 20,
					zIndex: 100,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					height: 48,
					backgroundColor: 'white',
					borderRadius: 25,
					paddingHorizontal: 12
				}}
			>
				{/* Вместо SampleOfSwitcher должен быть компонент слайдера языка */}
				<SampleOfSwitcher />
			</View>

			<SearchBar
				searchBarStyle={searchBarStyle}
				onFilteredDecks={onFilteredDecks}
				scrollToTop={handleScrollToTop}
			/>

			{isLoadingDecks || isFetchingDecks ? (
				<Loader />
			) : (
				<DeckScrollView
					scrollRef={scrollRef}
					scrollHandler={scrollHandler}
					filtedDecks={filtedDecks}
					handleOpenSheet={handleOpenSheet}
					handleDismissSheet={() => bottomSheetRef.current?.dismiss()}
					decks={decks}
				/>
			)}
			<CustomBottomSheetModal
				isLoading={isLoadingDecks}
				error={error}
				isFetching={isFetchingLevels}
				deck={selectedDeck}
				ref={bottomSheetRef}
				levels={levels}
				levelInfo={
					levels?.length ? `there is gonna be ${levels.length} levels` : 'start'
				}
			/>
		</SafeAreaView>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
		height: '100%',
		width: '100%'
	},
	scrollContainer: {
		paddingBottom: 80,
		marginTop: Platform.OS === 'ios' ? 55 : 100,
		margin: 20
	}
})
