import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import Animated from 'react-native-reanimated'

interface SearchBarProps {
	searchBarStyle: any
	onChangeInput: (text: string) => void
	onSearchSubmit?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
	searchBarStyle,
	onChangeInput,
	onSearchSubmit
}) => {
	const { t } = useTranslation()

	return (
		<Animated.View style={[styles.searchBar, searchBarStyle]}>
			<TextInput
				style={{ flex: 1, color: Colors.grey1 }}
				placeholder={t('searchBarPlaceholder')}
				onChangeText={onChangeInput}
			/>
			<TouchableOpacity onPress={onSearchSubmit}>
				<AntDesign name='search1' size={24} color={Colors.deepBlue} />
			</TouchableOpacity>
		</Animated.View>
	)
}
const styles = StyleSheet.create({
	searchBar: {
		flex: 1,
		position: 'absolute',
	
		right: 20,
		zIndex: 100,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		backgroundColor: 'white',
		borderRadius: 25,
		paddingHorizontal: 24
	}
})
export default SearchBar
