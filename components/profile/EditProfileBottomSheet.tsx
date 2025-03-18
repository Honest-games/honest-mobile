import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Colors from '@/constants/Colors';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IUserProfile } from '@/services/types/types';

interface EditProfileBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  editedProfile: IUserProfile;
  onChangeProfile: (field: keyof IUserProfile, value: string) => void;
  onSave: () => void;
}

const EditProfileBottomSheet: React.FC<EditProfileBottomSheetProps> = ({
  bottomSheetModalRef,
  editedProfile,
  onChangeProfile,
  onSave,
}) => {
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheet}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{t('editProfile')}</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('name')}</Text>
          <TextInput
            style={styles.input}
            value={editedProfile.name}
            onChangeText={(text) => onChangeProfile('name', text)}
            placeholder={t('enterName')}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('bio')}</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={editedProfile.bio}
            onChangeText={(text) => onChangeProfile('bio', text)}
            placeholder={t('enterBio')}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t('mood')}</Text>
          <TextInput
            style={styles.input}
            value={editedProfile.mood}
            onChangeText={(text) => onChangeProfile('mood', text)}
            placeholder={t('enterMood')}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={onSave}>
          <Text style={styles.saveButtonText}>{t('save')}</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.white,
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.deepGray,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: Colors.deepGray,
    marginBottom: 5,
  },
  input: {
    backgroundColor: Colors.beige,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  multiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: Colors.deepBlue,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileBottomSheet; 