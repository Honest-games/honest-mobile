import Colors from '@/constants/Colors'
import { getLevelColor } from '@/features/converters/button-converters'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface IButton {
	title: string
	onPress?: () => void
	size?: string
	color: string
	isButtonPressed?: boolean
	bgColor: string
}

const Button = (props: IButton) => {
	const { title, onPress, size, isButtonPressed, bgColor } = props

	const levelBgColor = getLevelColor(bgColor)

	const styles = StyleSheet.create({
		button: {
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			borderRadius: 33.5,
			backgroundColor: levelBgColor ? levelBgColor : Colors.deepBlue,
			height: size === 'large' ? 54 : 33,
			width: size === 'large' ? '100%' : 196
		},
		text: {
			color: 'white',
			fontSize: size === 'large' ? 20 : 16
		}
	})

	return (
		<TouchableOpacity
			disabled={isButtonPressed}
			onPress={onPress}
			style={[styles.button]}
		>
			<Text style={styles.text}>{title.toLowerCase()}</Text>
		</TouchableOpacity>
	)
}

export default Button
