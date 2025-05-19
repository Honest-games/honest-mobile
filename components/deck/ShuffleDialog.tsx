import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import AllDeckMixIcon from '@/assets/images/allDeckMixIcon.svg';
import CurrentLevelMixIcon from '@/assets/images/currentLevelMixIcon.svg';

interface ShuffleDialogProps {
  visible: boolean;
  onClose: () => void;
  onShuffleLevel: () => void;
  onShuffleDeck: () => void;
  isShuffleLevelDisabled: boolean;
  isSingleLevel: boolean;
}

const ShuffleDialog: React.FC<ShuffleDialogProps> = ({
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
                  style={[styles.deckButton, /* если выбрана — styles.activeButton */]}
                  onPress={onShuffleDeck}
                  activeOpacity={0.8}
                >
                  <AllDeckMixIcon width={40} height={40} />
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

              {/* <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>{t('cancel')}</Text>
              </TouchableOpacity> */}
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
    color: Colors.deepGray1,
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
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: Colors.deepBlue,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.deepBlue,
  },
  cancelText: {
    color: Colors.deepBlue,
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#B7DBCA',
  },
});

export default ShuffleDialog; 