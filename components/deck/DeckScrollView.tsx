import { IDeck } from '@/services/types/types'
import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated'
import DeckItem from '../../modules/DeckItem'

interface DeckScrollViewProps {
	scrollRef: any
	scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
	filtedDecks: IDeck[] | undefined
	decks: any
	handleOpenSheet: (id: string) => void
	handleDismissSheet: () => void
}

const DeckScrollView: React.FC<DeckScrollViewProps> = ({
	scrollRef,
	scrollHandler,
	filtedDecks,
	decks,
	handleOpenSheet,
	handleDismissSheet
}) => {
	return (
		<Animated.ScrollView
			ref={scrollRef}
			onScroll={scrollHandler}
			contentContainerStyle={styles.scrollContainer}
			scrollEventThrottle={16}
		>
			{filtedDecks &&
				decks &&
				filtedDecks.map((deck: IDeck) => (
					<DeckItem
						key={deck.id}
						deck={deck}
						onPresent={handleOpenSheet}
						onDismiss={handleDismissSheet}
					/>
				))}
		</Animated.ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollContainer: {
		paddingBottom: Platform.OS === 'ios' ? 75 : 100,
		marginTop: Platform.OS === 'ios' ? 55 : 75,
		margin: 20
	}
})

export default DeckScrollView
