import { StyleSheet, Text, View } from 'react-native';

interface LabelProps {
  levelBgColor: string;
  levelTitle: string;
}

export const Label = ({ levelBgColor, levelTitle }: LabelProps) => {
  const styles = StyleSheet.create({
    label: {
      justifyContent: 'flex-start',
      borderRadius: 12,
      height: 24,
      backgroundColor: levelBgColor,
      alignItems: 'center'
    },
    labelText: {
      fontSize: 16,
      marginLeft: 12,
      marginRight: 12,
      color: 'white'
    }
  });

  return (
    <View style={styles.label}>
      <Text style={styles.labelText}>{levelTitle.toLowerCase()}</Text>
    </View>
  );
}; 