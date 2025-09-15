import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/config';
import { IAchievement } from '@/entities/achievement/model/types';
import { useTranslation } from 'react-i18next';
import { Fireworks } from '@/shared/ui/animations';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface AchievementNotificationProps {
  achievement: IAchievement | null;
  visible: boolean;
  onClose: () => void;
  showFireworks: boolean;
  onFireworksFinish: () => void;
}

export const AchievementModal: React.FC<AchievementNotificationProps> = ({
  achievement,
  visible,
  onClose,
  showFireworks,
  onFireworksFinish
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const slideAnim = useSharedValue(-200);
  const opacityAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.8);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    if (visible && achievement) {
      // Тактильная обратная связь при появлении
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Анимация появления с react-native-reanimated
      slideAnim.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });

      opacityAnim.value = withTiming(1, {
        duration: 300,
      });

      scaleAnim.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      // Анимация прогресс-бара
      progressAnim.value = withTiming(1, {
        duration: 4000,
      });

      // Автоматическое скрытие через 4 секунды
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    } else {
      // Сброс анимации прогресс-бара
      progressAnim.value = 0;

      // Анимация скрытия
      slideAnim.value = withTiming(-200, {
        duration: 250,
      });

      opacityAnim.value = withTiming(0, {
        duration: 250,
      });

      scaleAnim.value = withTiming(0.8, {
        duration: 250,
      });
    }
  }, [visible, achievement]);

  const handleClose = () => {
    slideAnim.value = withTiming(-200, {
      duration: 250,
    }, (finished) => {
      if (finished) {
        runOnJS(onClose)();
      }
    });

    opacityAnim.value = withTiming(0, {
      duration: 250,
    });

    scaleAnim.value = withTiming(0.8, {
      duration: 250,
    });
  };

  // Animated styles using react-native-reanimated
  const animatedNotificationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: slideAnim.value },
        { scale: scaleAnim.value }
      ],
      opacity: opacityAnim.value,
    };
  });

  const animatedProgressStyle = useAnimatedStyle(() => {
    const progressWidth = interpolate(
      progressAnim.value,
      [0, 1],
      [0, 100],
      Extrapolate.CLAMP
    );
    return {
      width: `${progressWidth}%`,
    };
  });

  if (!achievement || !visible) return null;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]} pointerEvents="box-none">
      <Fireworks
        visible={showFireworks}
        onAnimationFinish={onFireworksFinish}
      />

      <Animated.View
        style={[
          styles.notification,
          animatedNotificationStyle,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={achievement.icon as any}
              size={32}
              color={Colors.white}
            />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{t('achievementUnlocked')}</Text>
            <Text style={styles.achievementTitle}>
              {t(`achievements_list.${achievement.id}.title`)}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialCommunityIcons
              name="close"
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              animatedProgressStyle,
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
  },
  notification: {
    backgroundColor: Colors.deepBlue,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    lineHeight: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.yellow,
  },
}); 