import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { IAchievement } from '@/services/types/types';
import { useTranslation } from 'react-i18next';
import Fireworks from '@/components/animations/Fireworks';

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
  onFireworksFinish
}) => {
  const { t } = useTranslation();

  if (!achievement) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay} onTouchEnd={onClose}>
        <View style={styles.modalContent}>
          <Fireworks
            visible={showFireworks}
            onAnimationFinish={onFireworksFinish}
          />
          
          <MaterialCommunityIcons
            name={achievement.icon as any}
            size={64}
            color={Colors.deepBlue}
            style={styles.icon}
          />
          
          <Text style={styles.title}>{t('achievementUnlocked')}</Text>
          <Text style={styles.achievementTitle}>
            {t(`achievements_list.${achievement.id}.title`)}
          </Text>
          <Text style={styles.achievementDescription}>
            {t(`achievements_list.${achievement.id}.description`)}
          </Text>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('continue')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.deepBlue,
    marginBottom: 10,
    textAlign: 'center',
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 10,
    textAlign: 'center',
  },
  achievementDescription: {
    fontSize: 16,
    color: Colors.grey,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors.deepBlue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AchievementModal; 