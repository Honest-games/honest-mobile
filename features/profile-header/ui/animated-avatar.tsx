import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { Colors } from '@/shared/config';

interface AnimatedAvatarProps {
  profile: {
    avatarUri?: string;
    emoji?: string;
    backgroundColor?: string;
    avatarId?: number;
  };
  onPress: () => void;
}

export const AnimatedAvatar = React.memo(({ profile, onPress }: AnimatedAvatarProps) => {
  const scale = useSharedValue(1);
  const editButtonOpacity = useSharedValue(0.8);
  const avatarKey = `${profile.avatarUri}-${profile.emoji}-${profile.backgroundColor}`;

  // Animate avatar changes
  useEffect(() => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 150 }),
      withSpring(1, { damping: 8, stiffness: 120 })
    );
  }, [avatarKey]);

  const handlePress = () => {
    // Immediate visual feedback with animation
    scale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 150 })
    );

    editButtonOpacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withTiming(0.8, { duration: 150 })
    );

    // Run onPress on JS thread
    runOnJS(onPress)();
  };

  const avatarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const editButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: editButtonOpacity.value
  }));

  return (
    <TouchableOpacity style={styles.avatarContainer} onPress={handlePress}>
      <Animated.View style={avatarAnimatedStyle}>
        {profile.avatarUri ? (
          <Image source={{ uri: profile.avatarUri }} style={styles.avatarImage} />
        ) : profile.emoji ? (
          <View style={[styles.avatarEmojiContainer, { backgroundColor: profile.backgroundColor || Colors.beige }]}>
            <Text style={styles.avatarEmoji}>{profile.emoji}</Text>
          </View>
        ) : (
          <View style={styles.avatarEmojiContainer}>
            <Text style={styles.avatarEmoji}>😊</Text>
          </View>
        )}
      </Animated.View>

      <Animated.View style={[styles.editAvatarButton, editButtonAnimatedStyle]}>
        <MaterialCommunityIcons name="pencil" size={20} color={Colors.white} />
      </Animated.View>
    </TouchableOpacity>
  );
});

AnimatedAvatar.displayName = 'AnimatedAvatar';

const styles = StyleSheet.create({
  avatarContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarEmojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 48,
    textAlign: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    backgroundColor: Colors.deepBlue,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
});