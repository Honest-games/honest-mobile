import { StyleSheet, Text, View } from 'react-native';

interface CustomLabelProps {
  children: React.ReactNode;
  labelColor: string;
}

export const CustomLabel = ({ children, labelColor }: CustomLabelProps) => {
  const styles = StyleSheet.create({
    label: {
      borderWidth: 1,
      borderRadius: 24.5,
      borderColor: labelColor,
      justifyContent: 'center',
      alignItems: 'center'
    },
    labelText: {
      color: labelColor,
      fontSize: 14,
      marginLeft: 10,
      marginRight: 10,
      marginTop: 1,
      marginBottom: 1
    }
  });

  return (
    <View style={styles.label}>
      <Text numberOfLines={1} adjustsFontSizeToFit style={styles.labelText}>
        {children}
      </Text>
    </View>
  );
}; 