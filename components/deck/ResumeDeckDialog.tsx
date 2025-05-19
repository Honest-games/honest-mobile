import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform, Dimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';

interface ResumeDeckDialogProps {
  visible: boolean;
  onClose: () => void;
  onStartOver: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ResumeDeckDialog: React.FC<ResumeDeckDialogProps> = ({
  visible,
  onClose,
  onStartOver,
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
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{t('resumeDeckTitle')}</Text>
              <Text style={styles.message}>{t('resumeDeckMessage')}</Text>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[styles.button, styles.secondaryButton]} 
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.secondaryButtonText}>{t('continue')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.button, styles.primaryButton]} 
                  onPress={onStartOver}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.primaryButtonText}>{t('startOver')}</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: Math.min(SCREEN_WIDTH * 0.9, 400),
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: Colors.grey1,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.lightGray,
  },
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResumeDeckDialog; 