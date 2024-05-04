import DeckScrollView from '@/components/deck/DeckScrollView'
import { getLevelsInfo } from '@/features/converters'
import {useDeck, useUserId} from '@/features/hooks'
import useLanguage from '@/features/hooks/useLanguage'
import { useAppDispatch } from '@/features/hooks/useRedux'
import CustomBottomSheetModal from '@/modules/CustomBottomSheetModal'
import Loader from '@/modules/Loader'
import { useGetAllLikesQuery } from '@/services/api'
import { IDeck } from '@/services/types/types'
import { setDecksLikesSet } from '@/store/reducer/deck-likes-slice'

import SearchBar from '@/UI/SearchBar'
import Switcher from '@/UI/Switcher'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Platform, StyleSheet, View } from 'react-native'
import Animated, {
	Extrapolate,
	interpolate,
	useAnimatedRef,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
	withTiming
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
const { width } = Dimensions.get('window')

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
		filteredDecks,
		onFilteredDecks
	} = useDeck()
	const dispatch = useAppDispatch()
	const userId = useUserId()
	const { changeLanguage } = useLanguage()
	const bottomSheetRef = useRef<BottomSheetModal>(null)
	const scrollY = useSharedValue(0)
	const scrollRef = useAnimatedRef<Animated.ScrollView>()
	const levelInfo = getLevelsInfo(levels?.length ?? 0)

	const { data: likes } =
		useGetAllLikesQuery(userId)
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
			[0, 20],
			[width - 148, 48],
			Extrapolate.CLAMP
		)

		const shadowOpacity = interpolate(
			scrollY.value,
			[0, 100],
			[0, 0.25],
			Extrapolate.CLAMP
		)

		const shadowOffset = interpolate(
			scrollY.value,
			[0, 100],
			[0, 4],
			Extrapolate.CLAMP
		)

		return {
			width: withTiming(searchBarWidth, { duration: 800 }),
			shadowColor: '#000000',
			// shadowOffset: withTiming({ width: 0, height: 4 }, { duration: 500 }),
			shadowRadius: 4,
			shadowOpacity: withTiming(shadowOpacity, { duration: 1000 }),
			elevation: 5
		}
	})
	const switcherStyle = useAnimatedStyle(() => {
		const scrollOffset = interpolate(
			scrollY.value,
			[0, 10],
			[0, 150],
			Extrapolate.CLAMP
		)

		const opacity = interpolate(
			scrollY.value,
			[0, 10],
			[1, 0],
			Extrapolate.CLAMP
		)
		return {
			transform: [{ translateX: withTiming(scrollOffset, { duration: 600 }) }],
			opacity: withTiming(opacity, { duration: 600 })
		}
	})

	const handleOpenSheet = (id: string) => {
		bottomSheetRef.current?.present()
		setDeckId(id)
	}

	useEffect(() => {
		if (likes && likes.decks) {
			dispatch(setDecksLikesSet(likes.decks.map((deck: IDeck) => deck.id)))
		}
	}, [likes])

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.switcherContainer}>
				<Switcher
					switcherStyle={switcherStyle}
					onLanguageChange={changeLanguage}
				/>
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
					filtedDecks={filteredDecks}
					handleOpenSheet={handleOpenSheet}
					handleDismissSheet={() => bottomSheetRef.current?.dismiss()}
					decks={decks}
				/>
			)}
			<CustomBottomSheetModal
				deckId={deckId}
				isLoading={isLoadingDecks}
				error={error}
				isFetching={isFetchingLevels}
				deck={selectedDeck}
				ref={bottomSheetRef}
				levels={levels}
				levelInfo={levelInfo}
			/>
		</SafeAreaView>
	)
}

export default Page

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingBottom: Platform.OS === 'ios' ? -35 : 0,
		height: '100%',
		width: '100%'
	},
	switcherContainer: {
		flex: 1,
		position: 'absolute',
		top: 50,
		left: 20,
		zIndex: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 25
	}
})
