import React, { useState, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Colors from '@shared/config/styles/colors';
import { AnimatedAvatar } from './animated-avatar';
import { ProfileHeaderData } from '../model/types';
import { usePerformanceMonitor } from '@shared/hooks';

interface ProfileHeaderProps {
  profile: ProfileHeaderData;
  onAvatarPress: () => void;
  onNameChange?: (name: string) => void;
}

export const ProfileHeader = React.memo(({ profile, onAvatarPress, onNameChange }: ProfileHeaderProps) => {
  const { t } = useTranslation();
  usePerformanceMonitor('ProfileHeader');

  // Use direct profile name instead of expensive selector
  const displayName = useMemo(() => profile.name || '', [profile.name]);

  // Local state for name editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [localName, setLocalName] = useState(displayName);
  const textInputRef = useRef<TextInput>(null);

  const handleNamePress = useCallback(() => {
    setIsEditingName(true);
    setLocalName(displayName);
    // Focus with a small delay to ensure component is mounted
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 100);
  }, [displayName]);

  const handleNameSubmit = useCallback(() => {
    setIsEditingName(false);
    if (localName.trim() !== displayName && localName.trim().length > 0) {
      onNameChange?.(localName.trim());
    } else {
      setLocalName(displayName); // Reset to original if no change
    }
  }, [localName, displayName, onNameChange]);

  const handleNameBlur = useCallback(() => {
    handleNameSubmit();
  }, [handleNameSubmit]);

  const handleNameChange = useCallback((text: string) => {
    setLocalName(text);
  }, []);

  return (
    <View style={styles.container}>
      <AnimatedAvatar profile={profile} onPress={onAvatarPress} />
      <View style={styles.profileInfo}>
        {isEditingName ? (
          <TextInput
            ref={textInputRef}
            style={styles.nameInput}
            value={localName}
            onChangeText={handleNameChange}
            onBlur={handleNameBlur}
            onSubmitEditing={handleNameSubmit}
            placeholder={t('profile.namePlaceholder', 'Enter your name')}
            returnKeyType="done"
            maxLength={50}
            selectTextOnFocus
          />
        ) : (
          <TouchableOpacity onPress={handleNamePress} activeOpacity={0.7}>
            <Text style={styles.name}>
              {displayName || t('profile.tapToEdit', 'Tap to edit name')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

ProfileHeader.displayName = 'ProfileHeader';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
  },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.deepGray,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 120,
  },
});