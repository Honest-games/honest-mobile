import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import Animated, { ScrollHandlerProcessed } from 'react-native-reanimated'
import Deck from '../../modules/Deck'

interface DeckScrollViewProps {
	scrollRef: any
	scrollHandler: ScrollHandlerProcessed<Record<string, unknown>>
	filtedDecks: any[]
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
				filtedDecks.map((deck: any) => (
					<Deck
						key={deck.id}
						title={deck.name}
						id={deck.id}
						onPresent={handleOpenSheet}
						onDismiss={handleDismissSheet}
					/>
				))}
		</Animated.ScrollView>
	)
}

const styles = StyleSheet.create({
	scrollContainer: {
		paddingBottom: Platform.OS === 'ios' ? 75 : 120,
		marginTop: Platform.OS === 'ios' ? 55 : 100,
		margin: 20
	}
})

export default DeckScrollView
