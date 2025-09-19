import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '@shared/ui';
import { useOnboarding } from '../../hooks/useOnboarding';
import { Colors } from '@shared/config';

export const DevOnboardingControls: React.FC = () => {
  const {
    reset,
    start,
    currentStep,
    totalSteps,
    hasCompletedOnboarding,
    hasSkippedOnboarding,
    goToStep
  } = useOnboarding();

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'This will reset onboarding state and show it again on next app start.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            Alert.alert('Success', 'Onboarding has been reset. Reload the app to see it again.');
          }
        }
      ]
    );
  };

  const handleStartOnboarding = () => {
    start();
  };

  const handleGoToStep = (step: number) => {
    goToStep(step);
  };

  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠️ Dev Onboarding Controls</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Status: {hasCompletedOnboarding ? 'Completed' : hasSkippedOnboarding ? 'Skipped' : 'Not completed'}
        </Text>
        <Text style={styles.statusText}>
          Current Step: {currentStep + 1}/{totalSteps}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <Button
          title="Reset Onboarding"
          onPress={handleResetOnboarding}
          color={Colors.white}
          bgColor={Colors.grey2}
          outline={true}
          size="small"
        />

        <Button
          title="Start Onboarding"
          onPress={handleStartOnboarding}
          color={Colors.white}
          bgColor={Colors.deepBlue}
          size="small"
        />
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>Quick Jump to Step:</Text>
        <View style={styles.stepsButtons}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <Button
              key={index}
              title={`${index + 1}`}
              onPress={() => handleGoToStep(index)}
              color={Colors.white}
              bgColor={currentStep === index ? Colors.deepBlue : Colors.lightGrey}
              size="small"
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    minWidth: 250,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.deepGray,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: Colors.lightGrey,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    color: Colors.grey2,
    marginBottom: 2,
  },
  buttonsContainer: {
    marginBottom: 12,
    gap: 8,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepsTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.deepGray,
    marginBottom: 8,
  },
  stepsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
});