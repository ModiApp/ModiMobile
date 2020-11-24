import React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
} from 'react-native';

import { fontFamilies } from '@modimobile/ui/styles';

interface TextInputProps extends RNTextInputProps {}
const TextInput: React.FC<TextInputProps> = ({ style, ...props }) => {
  return <RNTextInput style={[styles.textInput, style]} {...props} />;
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: 'white',
    color: 'black',
    padding: 8,
    borderRadius: 50,
    fontFamily: fontFamilies.primary,
  },
});

export default TextInput;
