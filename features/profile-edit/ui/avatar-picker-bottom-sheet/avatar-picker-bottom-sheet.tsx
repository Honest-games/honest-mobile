import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch } from '@/shared/lib/hooks/useRedux';
import { updateProfile } from '@/entities/profile/model';
import { Colors } from '@/shared/config';

interface AvatarPickerBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
  onSelectAvatar: (type: string, value?: string) => void;
  profile: {
    name: string;
  };
}

export const AvatarPickerBottomSheet = React.memo<AvatarPickerBottomSheetProps>(({
  bottomSheetModalRef,
  onSelectAvatar,
  profile,
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [name, setName] = useState(profile.name);
  const [snapPoints, setSnapPoints] = useState(['65%']);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setSnapPoints(['70%']);
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setSnapPoints(['45%']);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        onSelectAvatar('photo', result.assets[0].uri);
        bottomSheetModalRef.current?.dismiss();
      }
    }
  };

  const handleChoosePhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === 'granted') {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        onSelectAvatar('photo', result.assets[0].uri);
        bottomSheetModalRef.current?.dismiss();
      }
    }
  };

  const handleSaveName = () => {
    dispatch(updateProfile({ name }));
    bottomSheetModalRef.current?.dismiss();
  };

  const renderBackdrop = (props: any) => (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
    />
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.bottomSheet}
      keyboardBehavior="extend"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.label}>{t('name')}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t('enterName')}
              autoFocus
            />
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity style={styles.option} onPress={handleTakePhoto}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="camera" size={32} color={Colors.deepBlue} />
              </View>
              <Text style={styles.optionText}>{t('profile.camera')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={handleChoosePhoto}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="image" size={32} color={Colors.deepBlue} />
              </View>
              <Text style={styles.optionText}>{t('profile.gallery')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.option}
              onPress={() => {
                onSelectAvatar('emoji');
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="emoticon" size={32} color={Colors.deepBlue} />
              </View>
              <Text style={styles.optionText}>{t('profile.emoji')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveName}
            >
              <Text style={styles.saveButtonText}>{t('save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => bottomSheetModalRef.current?.dismiss()}
            >
              <Text style={styles.cancelText}>{t('profile.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.white,
    borderRadius: 24,
  },
  container: {
    flex: 1,
    padding: 16,
    marginBottom: 30,
  },
  nameContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Colors.deepGray,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.beige,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  option: {
    alignItems: 'center',
    width: '30%',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.beige,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionText: {
    fontSize: 12,
    color: Colors.deepGray,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 'auto',
  },
  saveButton: {
    backgroundColor: Colors.deepBlue,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: Colors.deepBlue,
    fontWeight: '600',
  },
}); 