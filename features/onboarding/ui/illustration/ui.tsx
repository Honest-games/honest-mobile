import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { Colors } from '@shared/config';
import { Cards, Logo, OnbordingCards, OnbordingLevels, OnbordingPhone, Flower, OnbordingLine, OrangeFlower } from '@/assets/images';

const { width: screenWidth } = Dimensions.get('window');

interface IllustrationProps {
  type: 'welcome' | 'themes' | 'levels' | 'gameplay' | 'achievements';
}

export const Illustration: React.FC<IllustrationProps> = ({ type }) => {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withSpring(1, { damping: 15 });
    scale.value = withSequence(
      withSpring(1.05, { damping: 12 }),
      withSpring(1, { damping: 15 })
    );
  }, [type]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value
    };
  });

  const renderIllustration = () => {
    switch (type) {
      case 'welcome':
        return <Logo />;
      case 'themes':
        return <ThemesIllustration />;
      case 'levels':
        return <LevelsIllustration />;
      case 'gameplay':
        return <GameplayIllustration />;
      case 'achievements':
        return <AchievementsIllustration />;
      default:
        return <Logo />;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderIllustration()}
    </Animated.View>
  );
};

const ThemesIllustration: React.FC = () => (
  <View style={styles.themesContainer}>
    <Flower width={screenWidth*0.5} height={screenWidth*0.5} style={styles.backgroundFlower} />
    <OnbordingCards width={screenWidth * 0.8} height={screenWidth * 0.8} style={styles.foregroundCards} />
  </View>
);

const LevelsIllustration: React.FC = () => (
  <View style={styles.levelsContainer}>
    <OnbordingLine width={screenWidth} height={screenWidth*0.5} style={styles.backgroundLine} />
    <OnbordingLevels width={screenWidth} height={screenWidth} style={styles.foregroundLevels} />
  </View>
);

const GameplayIllustration: React.FC = () => (
  <View style={styles.gameplayContainer}>
    <OrangeFlower width={screenWidth} height={screenWidth*0.5} style={styles.backgroundOrangeFlower} />
    <Cards width={screenWidth*1.2} height={screenWidth*1.2} style={styles.foregroundCards} />
  </View>
);

const AchievementsIllustration: React.FC = () => (
  <View style={styles.achievementsContainer}>
    <OnbordingLine width={screenWidth} height={screenWidth*0.5} style={styles.backgroundPurpleLine} />
    <Image 
      source={require('@/assets/images/iphone-mockup.png')} 
      style={styles.foregroundPhone}
      resizeMode="contain"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  themesContainer: {
    flex: 1,
    width: screenWidth,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundFlower: {
    position: 'absolute',
    top: 90,
    right: 0,
  },
  foregroundCards: {
    marginLeft: 20,
    zIndex: 1
  },
  levelsContainer: {
    flex: 1,
    width: screenWidth,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundLine: {
    position: 'absolute',
    top: 90,
    left: 90,
  },
  foregroundLevels: {
    zIndex: 1
  },
  gameplayContainer: {
    flex: 1,
    width: screenWidth,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundOrangeFlower: {
    position: 'absolute',
    top: 90,
  },
  achievementsContainer: {
    flex: 1,
    width: screenWidth,
    height: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  backgroundPurpleLine: {
    position: 'absolute',
    top: 90,
    left: 90,
    tintColor: Colors.dimBlue
  },
  foregroundPhone: {
    width: screenWidth,
    height: screenWidth * 1.2,
    zIndex: 1
  }
});