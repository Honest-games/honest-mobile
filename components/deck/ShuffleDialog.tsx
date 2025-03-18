import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

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
              <Text style={styles.title}>{t('shuffleTitle')}</Text>
              
              <TouchableOpacity 
                style={[
                  styles.button,
                  isShuffleLevelDisabled && styles.disabledButton
                ]}
                onPress={onShuffleLevel}
                disabled={isShuffleLevelDisabled}
              >
                <Text style={[
                  styles.buttonText,
                  isShuffleLevelDisabled && styles.disabledButtonText
                ]}>
                  {t('shuffleCurrentLevel')}
                </Text>
              </TouchableOpacity>

              {!isSingleLevel && (
                <TouchableOpacity 
                  style={styles.button}
                  onPress={onShuffleDeck}
                >
                  <Text style={styles.buttonText}>{t('shuffleAllLevels')}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>{t('cancel')}</Text>
              </TouchableOpacity>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.deepGray,
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
    backgroundColor: Colors.grey1,
  },
  disabledButtonText: {
    color: Colors.grey,
  },
});

export default ShuffleDialog; 