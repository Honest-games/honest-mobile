import { LevelInfo } from '@/UI/LevelInfo'
import { DeckTopContent } from '@/components/deck/DeckTopContent'
import Colors from '@/constants/Colors'
import { decks } from '@/constants/data'
import { useDeckId } from '@/features/hooks'
import Card from '@/modules/Card'
import { LevelButtons } from '@/modules/LevelButtons'
import Loader from '@/modules/Loader'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')
const { height } = Dimensions.get('window')

const DeckId: React.FC = () => {
	const {
		levels,
		isFetchingLevels,
		question,
		isFetchingQuestion,
		isLoadingQuestion,
		buttonState,
		goBack,
		onButtonPress
	} = useDeckId()

	const levelInfoText: string = 'choose a level'
	const textToShow: string = question?.text || 'take first card'

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.deck}>
				<View style={styles.wrapper}>
					{isFetchingLevels && isFetchingQuestion ? (
						<Loader />
					) : (
						<>
							<DeckTopContent goBack={goBack} imgSource={decks[0].img} />
							<Card
								isLoading={isLoadingQuestion}
								isFetching={isFetchingQuestion}
								level={buttonState}
								color={Colors.beige}
								text={textToShow}
							/>
							<LevelInfo levelInfo={levelInfoText} />
							<LevelButtons
								levels={levels || []}
								onButtonPress={onButtonPress}
								size='large'
							/>
						</>
					)}
				</View>
			</View>
		</SafeAreaView>
	)
}

export default DeckId

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	wrapper: {
		flex: 1,
		flexDirection: 'column',
		margin: 24,
		gap: 12
	},
	deck: {
		flex: 1,
		width: width - 40,
		marginBottom: 20,
		marginTop: 20,
		backgroundColor: 'white',
		borderRadius: 33
	}
})
