import { StyleSheet } from 'react-native';
import { colors } from '@app/core';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  button: {
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 40,
    padding: 5,
    backgroundColor: colors.primary,
  },
});
