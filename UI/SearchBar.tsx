import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Animated from 'react-native-reanimated'

interface SearchBarProps {
	searchBarStyle: any
	onFilteredDecks: (text: string) => void
	scrollToTop: any
}

const SearchBar: React.FC<SearchBarProps> = ({
	scrollToTop,
	searchBarStyle,
	onFilteredDecks
}) => {
	return (
		<Animated.View style={[styles.searchBar, searchBarStyle]}>
			<TextInput
				style={{ flex: 1 }}
				placeholder='search for deck you want'
				onChangeText={onFilteredDecks}
			/>
			<TouchableOpacity onPress={scrollToTop}>
				<AntDesign name='search1' size={24} color='black' />
			</TouchableOpacity>
		</Animated.View>
	)
}
const styles = StyleSheet.create({
	searchBar: {
		flex: 1,
		position: 'absolute',
		top: 50,

		right: 20,
		zIndex: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		backgroundColor: 'white',
		borderRadius: 25,
		paddingHorizontal: 12
	}
})
export default SearchBar
