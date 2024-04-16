import CardLikeButton from '@/components/card/CardLikeButton'
import Colors from '@/constants/Colors'
import { IQuestonLevelAndColor } from '@/features/converters/button-converters'
import {
	useDislikeQuestionMutation,
	useLikeQuestionMutation
} from '@/services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { memo, useEffect, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import CardText from './card/CardText'
import CardTopContent from './card/CardTopContent'
import Loader from '../modules/Loader'

const { height } = Dimensions.get('screen')
const screenWidth = Dimensions.get('screen').width
export const tinderCardWidth = screenWidth * 0.8
interface ICard {
	isFirst: boolean
	swipe?: any
	children: React.ReactNode
}

const SwipableCard = memo((props: ICard) => {
	const {
		swipe,
		isFirst,
		children,
		...rest
	} = props

	const styles = StyleSheet.create({
		card: {
			flex: 1,
			position: 'absolute',
			width: '100%',
			height: '100%',
		},
	})

	const rotate = swipe.x.interpolate({
		inputRange: [-100, 0, 100],
		outputRange: ['8deg', '0deg', '-8deg']
	})

	const allowSwipe = isFirst
	return (
		<Animated.View
			style={[
				styles.card,
				allowSwipe && {
					transform: [...swipe.getTranslateTransform(), { rotate: rotate }]
				}
			]}
			{...rest}
		>
			{children}
		</Animated.View>
	)
})

export default SwipableCard
