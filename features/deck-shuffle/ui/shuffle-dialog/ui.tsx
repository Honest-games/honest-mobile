import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/shared/config';
import { AllDecksMixIcon, CurrentLevelMixIcon } from '@/assets/images';

interface ShuffleDialogProps {
  visible: boolean;
  onClose: () => void;
  onShuffleLevel: () => void;
  onShuffleDeck: () => void;
  isShuffleLevelDisabled: boolean;
  isSingleLevel: boolean;
}

export const ShuffleDialog: React.FC<ShuffleDialogProps> = ({
  visible,
  onClose,
  onShuffleLevel,
  onShuffleDeck,
  isShuffleLevelDisabled,
  isSingleLevel
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.dialog}>
              <Text style={styles.title}>Перемешать:</Text>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={[styles.deckButton]}
                  onPress={onShuffleDeck}
                  activeOpacity={0.8}
                >
                  <AllDecksMixIcon width={40} height={40} />
                  <Text style={styles.deckButtonText}>{t('shuffleAllLevels')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.levelButton,
                    isShuffleLevelDisabled && styles.disabledButton
                  ]}
                  onPress={onShuffleLevel}
                  disabled={isShuffleLevelDisabled}
                  activeOpacity={0.8}
                >
                  <CurrentLevelMixIcon width={40} height={40} />
                  <Text style={[
                    styles.levelButtonText,
                    isShuffleLevelDisabled && styles.disabledButtonText
                  ]}>
                    {t('shuffleCurrentLevel')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.deepGray,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  deckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B7DBCA',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  deckButtonText: {
    marginLeft: 12,
    fontSize: 20,
    color: '#5B5B5B',
    fontWeight: '500',
  },
  levelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#B7DBCA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  levelButtonText: {
    marginLeft: 12,
    fontSize: 18,
    color: '#5B5B5B',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#B7DBCA',
  },
}); 