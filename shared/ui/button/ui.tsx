import { getLevelColor } from '@features/converters'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { createButtonStyles } from './styles'
import { Colors } from '@shared/config'

interface ButtonProps {
  title: string
  onPress?: () => void
  size?: string
  color: string
  isButtonPressed?: boolean
  bgColor?: string
}

export const Button = (props: ButtonProps) => {
  const { title, onPress, size, isButtonPressed, bgColor } = props

  const levelBgColor = getLevelColor(bgColor)
  const backgroundColor = levelBgColor || Colors.deepBlue
  
  const styles = createButtonStyles(backgroundColor, size)

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