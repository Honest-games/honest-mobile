import Colors from '@/constants/Colors'
import { AntDesign } from '@expo/vector-icons'
import React, { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TextInput, TouchableOpacity, View, Animated } from 'react-native'

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
	const [fadeAnim] = useState(new Animated.Value(1))
	const inputRef = useRef<TextInput>(null)

	const handleClear = () => {
		onChangeInput('')
	}

	const toggleIcon = () => {
		Animated.timing(fadeAnim, {
			toValue: value ? 0 : 1,
			duration: 200,
			useNativeDriver: true,
		}).start()
	}

	const handlePress = () => {
		inputRef.current?.focus()
	}

	React.useEffect(() => {
		toggleIcon()
	}, [value])

	return (
		<TouchableOpacity 
			style={styles.searchBar}
			onPress={handlePress}
			activeOpacity={1}
		>
			<TextInput
				ref={inputRef}
				style={{ flex: 1, color: Colors.grey1 }}
				placeholder={t('searchBarPlaceholder')}
				onChangeText={onChangeInput}
				value={value}
			/>
			<TouchableOpacity 
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
				onPress={value ? handleClear : onSearchSubmit}
			>
				<Animated.View style={{ opacity: fadeAnim }}>
					<AntDesign name='search1' size={24} color={Colors.deepBlue} />
				</Animated.View>
				<Animated.View style={[styles.clearIcon, { opacity: fadeAnim.interpolate({
					inputRange: [0, 1],
					outputRange: [1, 0]
				})}]}>
					<AntDesign name='close' size={24} color={Colors.deepBlue} />
				</Animated.View>
			</TouchableOpacity>
		</TouchableOpacity>
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
	},
	clearIcon: {
		position: 'absolute',
		top: 0,
		left: 0,
	}
})

export default SearchBar
