import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@shared/config';
import { OnboardingStep } from '../../model/types';
import { Illustration } from '../illustration';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface OnboardingScreenProps {
  step: OnboardingStep;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ step }) => {
  const { t } = useTranslation();

  const getBackgroundColor = () => {
    switch (step.illustration) {
      case 'welcome':
        return Colors.lightBeige;
      case 'themes':
        return Colors.lightBeige1;
      case 'levels':
        return Colors.dimBlue;
      case 'gameplay':
        return Colors.dimOrange;
      case 'achievements':
        return Colors.dimBrown;
      default:
        return Colors.lightBeige;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.illustrationContainer}>
        <Illustration type={step.illustration} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{t(step.title)}</Text>
        <Text style={styles.description}>{t(step.description)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 60,
  },
  textContainer: {
    position: 'absolute',
    bottom: 170,
    left: 32,
    right: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'MakanHatiCyrillic',
    fontWeight: '700',
    color: Colors.deepGray,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '400',
    color: Colors.grey2,
    textAlign: 'center',
    lineHeight: 24,
  },
});