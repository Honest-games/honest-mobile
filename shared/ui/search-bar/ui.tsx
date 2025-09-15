import { Colors } from '@/shared/config';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

interface SearchBarProps {
	onChangeInput: (text: string) => void;
	onSearchSubmit?: () => void;
	value: string;
}

const AnimatedFeather = Animated.createAnimatedComponent(Feather);
const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

export const SearchBar: React.FC<SearchBarProps> = ({
	onChangeInput,
	onSearchSubmit,
	value
}) => {
	const { t } = useTranslation();
	const inputRef = useRef<TextInput>(null);
	const animationProgress = useSharedValue(0);

	useEffect(() => {
		animationProgress.value = withTiming(value ? 1 : 0, { duration: 300 });
	}, [value]);

	const searchIconStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(animationProgress.value, [0, 1], [1, 0]),
			transform: [
				{
					scale: interpolate(animationProgress.value, [0, 1], [1, 0.8]),
				},
			],
		};
	});

	const clearIconStyle = useAnimatedStyle(() => {
		return {
			opacity: interpolate(animationProgress.value, [0, 1], [0, 1]),
			transform: [
				{
					scale: interpolate(animationProgress.value, [0, 1], [0.8, 1]),
				},
			],
		};
	});

	const handleClear = () => {
		onChangeInput('');
		inputRef.current?.focus();
	};

	return (
		<View style={styles.searchBar}>
			<View style={styles.iconContainer}>
				<TouchableOpacity onPress={onSearchSubmit} style={styles.absoluteIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
					<AnimatedFeather name='search' size={24} color={Colors.grey1} style={searchIconStyle} />
				</TouchableOpacity>
				<TouchableOpacity onPress={handleClear} style={styles.absoluteIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
					<AnimatedAntDesign name='close' size={24} color={Colors.grey1} style={clearIconStyle} />
				</TouchableOpacity>
			</View>
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
		</View>
	);
};

const styles = StyleSheet.create({
	searchBar: {
		flexDirection: 'row',
		alignItems: 'center',
		height: 48,
		backgroundColor: 'white',
		borderRadius: 25,
		paddingHorizontal: 24,
	},
	iconContainer: {
		width: 24,
		height: 24,
		position: 'relative',
		marginRight: 12,
	},
	absoluteIcon: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 24,
		height: 24,
		margin: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		flex: 1,
		color: Colors.grey1,
		fontSize: 16,
		paddingVertical: 0,
		paddingHorizontal: 0,
		backgroundColor: 'transparent',
	},
}); 