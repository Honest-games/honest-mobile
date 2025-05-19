import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'

interface SearchBarProps {
	onChangeInput: (text: string) => void
	onSearchSubmit?: () => void
	value: string
}

const SearchBar: React.FC<SearchBarProps> = ({
	onChangeInput,
	onSearchSubmit,
	value
}) => {
	const { t } = useTranslation()
	const inputRef = useRef<TextInput>(null)

	const handleClear = () => {
		onChangeInput('')
		inputRef.current?.focus()
	}

	return (
		<View style={styles.searchBar}>
			<TouchableOpacity onPress={onSearchSubmit} style={styles.iconLeft} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
				<AntDesign name='search1' size={24} color={Colors.grey1} />
			</TouchableOpacity>
			<TextInput
				ref={inputRef}
				style={styles.input}
				placeholder={t('searchBarPlaceholder')}
				onChangeText={onChangeInput}
				value={value}
				placeholderTextColor={Colors.grey1}
				returnKeyType='search'
				onSubmitEditing={onSearchSubmit}
			/>
			{value ? (
				<TouchableOpacity onPress={handleClear} style={styles.iconRight} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
					<AntDesign name='close' size={24} color={Colors.grey1} />
				</TouchableOpacity>
			) : null}
		</View>
	)
}

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 48,
		backgroundColor: 'white',
		borderRadius: 25,
		paddingHorizontal: 24,
	},
	iconLeft: {
		marginRight: 12,
	},
	iconRight: {
		marginLeft: 12,
	},
	input: {
		flex: 1,
		color: Colors.grey1,
		fontSize: 16,
		paddingVertical: 0,
		paddingHorizontal: 0,
		backgroundColor: 'transparent',
	},
})

export default SearchBar
