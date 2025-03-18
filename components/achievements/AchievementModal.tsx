import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { IAchievement } from '@/services/types/types';
import { BlurView } from 'expo-blur';
import Fireworks from '../animations/Fireworks';

interface AchievementModalProps {
  achievement: IAchievement | null;
  visible: boolean;
  onClose: () => void;
  showFireworks: boolean;
  onFireworksFinish: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  visible,
  onClose,
  showFireworks,
  onFireworksFinish,
}) => {
  const { t } = useTranslation();

  if (!achievement) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <BlurView intensity={50} tint="dark" style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialCommunityIcons
              name={achievement.icon as any}
              size={60}
              color={Colors.deepBlue}
              style={styles.icon}
            />
            <Text style={styles.congratsText}>{t('achievementUnlocked')}</Text>
            <Text style={styles.title}>{achievement.title}</Text>
            <Text style={styles.description}>{achievement.description}</Text>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{t('continue')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showFireworks && (
          <Fireworks
            visible={showFireworks}
            onAnimationFinish={onFireworksFinish}
          />
        )}
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    marginBottom: 15,
  },
  congratsText: {
    fontSize: 18,
    color: Colors.deepGray,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementModal; 