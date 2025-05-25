import { StyleSheet } from 'react-native'
import Color from 'color'

export const createButtonStyles = (backgroundColor: string, size?: string) => {
  const textColor = Color(backgroundColor).darken(0.5).toString()
  const height = size === 'large' ? 54 : 33

  return StyleSheet.create({
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
} 