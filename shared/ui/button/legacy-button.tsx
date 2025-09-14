import Colors from '@/constants/Colors'
import { getLevelColor } from '@/features/converters/button-converters'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import Color from 'color'

interface IButton {
	title: string
	onPress?: () => void
	size?: string
	color: string
	isButtonPressed?: boolean
	bgColor?: string
}

const Button = (props: IButton) => {
	const { title, onPress, size, isButtonPressed, bgColor } = props

	const levelBgColor = getLevelColor(bgColor)
	const backgroundColor = levelBgColor || Colors.deepBlue
	const textColor = Color(backgroundColor).darken(0.5).toString()

	let height = size === 'large' ? 54 : 33;
	const styles = StyleSheet.create({
		button: {
			justifyContent: 'center',
			alignItems: 'center',
			color: 'white',
			borderRadius: 15,
			backgroundColor,
			height: height,
			width: size === 'large' ? '90%' : 196
		},
		text: {
			color: textColor,
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
