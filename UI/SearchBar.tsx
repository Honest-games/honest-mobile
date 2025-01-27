import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface SearchBarProps {
	onChangeInput: (text: string) => void
	onSearchSubmit?: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({
	onChangeInput,
	onSearchSubmit
}) => {
	const { t } = useTranslation()

	return (
		<View style={styles.searchBar}>
			<TextInput
				style={{ flex: 1, color: Colors.grey1 }}
				placeholder={t('searchBarPlaceholder')}
				onChangeText={onChangeInput}
			/>
			<TouchableOpacity onPress={onSearchSubmit}>
				<AntDesign name='search1' size={24} color={Colors.deepBlue} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 48,
		backgroundColor: 'white',
		borderRadius: 25,
		paddingHorizontal: 24,
		
	}
})

export default SearchBar
