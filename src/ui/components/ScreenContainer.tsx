import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import { colors, fontFamilies } from '@modimobile/ui/styles';

const ScreenContainer: React.FC = ({ children }) => (
  <SafeAreaView style={styles.screen}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.feltGreen,
    fontFamily: fontFamilies.primary,
    fontColor: 'white',
  },
});

export default ScreenContainer;
