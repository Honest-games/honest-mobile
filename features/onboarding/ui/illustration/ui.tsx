import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import { Colors } from '@shared/config';
import { Cards, Logo } from '@/assets/images';

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
        return <Cards width={screenWidth+80} height={screenWidth+80} />;
      case 'levels':
        return <LevelsIllustration />;
      case 'gameplay':
        return <GameplayIllustration />;
      case 'achievements':
        return <AchievementsIllustration />;
      default:
        return <WelcomeIllustration />;
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {renderIllustration()}
    </Animated.View>
  );
};

const LevelsIllustration: React.FC = () => (
  <View style={styles.levelsContainer}>
    <View style={[styles.levelCircle, { backgroundColor: Colors.lightGreen, width: 60, height: 60 }]}>
      <View style={styles.levelNumber} />
    </View>
    <View style={[styles.levelCircle, { backgroundColor: Colors.yellow, width: 80, height: 80 }]}>
      <View style={styles.levelNumber} />
    </View>
    <View style={[styles.levelCircle, { backgroundColor: Colors.orange, width: 100, height: 100 }]}>
      <View style={styles.levelNumber} />
    </View>
  </View>
);

const GameplayIllustration: React.FC = () => (
  <View style={styles.gameplayContainer}>
    <View style={[styles.questionCard, { backgroundColor: Colors.primary }]}>
      <View style={styles.questionLine} />
      <View style={[styles.questionLine, { width: '70%' }]} />
    </View>
    <View style={styles.playersContainer}>
      <View style={[styles.player, { backgroundColor: Colors.lightGreen }]} />
      <View style={[styles.player, { backgroundColor: Colors.yellow }]} />
      <View style={[styles.player, { backgroundColor: Colors.orange }]} />
    </View>
  </View>
);

const AchievementsIllustration: React.FC = () => (
  <View style={styles.achievementsContainer}>
    <View style={[styles.trophy, { backgroundColor: Colors.yellow }]}>
      <View style={[styles.trophyBase, { backgroundColor: Colors.orange }]} />
    </View>
    <View style={styles.stars}>
      {[0, 1, 2].map((_, index) => (
        <View
          key={index}
          style={[
            styles.star,
            {
              backgroundColor: Colors.yellow,
              transform: [{ rotate: `${index * 45}deg` }]
            }
          ]}
        />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth ,
    height: screenWidth ,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  // Welcome
  welcomeContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative'
  },
  circle: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primaryCircle: {
    width: 200,
    height: 200,
    backgroundColor: Colors.primary
  },
  secondaryCircle: {
    width: 120,
    height: 120,
    backgroundColor: Colors.beige,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  smallCircle: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  floatingElement: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15
  },
  // Topics
  topicsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  topicCard: {
    position: 'absolute',
    width: 120,
    height: 80,
    borderRadius: 16
  },
  // Levels
  levelsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  levelCircle: {
    borderRadius: 1000,
    justifyContent: 'center',
    alignItems: 'center'
  },
  levelNumber: {
    width: 20,
    height: 20,
    backgroundColor: Colors.beige,
    borderRadius: 10
  },
  // Gameplay
  gameplayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40
  },
  questionCard: {
    width: 200,
    height: 120,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center'
  },
  questionLine: {
    height: 12,
    backgroundColor: Colors.beige,
    borderRadius: 6,
    marginBottom: 8,
    width: '100%'
  },
  playersContainer: {
    flexDirection: 'row',
    gap: 16
  },
  player: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  // Achievements
  achievementsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30
  },
  trophy: {
    width: 80,
    height: 100,
    borderRadius: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10
  },
  trophyBase: {
    width: 60,
    height: 20,
    borderRadius: 10
  },
  stars: {
    flexDirection: 'row',
    gap: 12
  },
  star: {
    width: 20,
    height: 20,
    borderRadius: 4
  }
});