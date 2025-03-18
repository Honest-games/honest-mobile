import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import LottieView from 'lottie-react-native';

interface FireworksProps {
  visible: boolean;
  onAnimationFinish: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({ visible, onAnimationFinish }) => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    if (visible) {
      animation.current?.play();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LottieView
        ref={animation}
        source={require('../../assets/animations/fireworks.json')}
        autoPlay={false}
        loop={false}
        style={styles.animation}
        onAnimationFinish={onAnimationFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  animation: {
    width: '100%',
    height: '100%',
  },
});

export default Fireworks; 