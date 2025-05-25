import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/shared/config';

interface AvatarProps {
  profile: {
    avatarUri?: string;
    emoji?: string;
    backgroundColor?: string;
    avatarId?: number;
  };
  onPress: () => void;
}

export const Avatar = React.memo(({ profile, onPress }: AvatarProps) => (
  <TouchableOpacity style={styles.avatarContainer} onPress={onPress}>
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
    <View style={styles.editAvatarButton}>
      <MaterialCommunityIcons name="pencil" size={20} color={Colors.white} />
    </View>
  </TouchableOpacity>
));

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