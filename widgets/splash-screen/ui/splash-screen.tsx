import LottieView from 'lottie-react-native'
import React, { useRef } from 'react'
import { Dimensions, View } from 'react-native'

interface SplashScreenProps {
  onAnimationFinish?: (isCancelled: boolean) => void
}

const { height } = Dimensions.get('screen')

export const SplashScreen = ({ onAnimationFinish }: SplashScreenProps) => {
  const animation = useRef<LottieView>(null)
  
  return (
    <View style={{ height: height, backgroundColor: '#f3f3f3' }}>
      <LottieView
        loop={false}
        onAnimationFinish={onAnimationFinish}
        style={{ height: height, width: '100%' }}
        ref={animation}
        autoPlay
        source={require('@/assets/animations/anime.json')}
      />
    </View>
  )
} 