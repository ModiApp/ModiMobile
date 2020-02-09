import React from 'react';
import {
  SafeAreaView,
  View,
  Text as RNText,
  TextInput as RNTextInput,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors, sizing, fontFamilies } from './styles';

/** Useful for grabbing style attributes from a component's props */
const stylesFromProps = props => {
  const styleProps = new Set([
    'alignItems',
    'borderRadius',
    'flex',
    'flexdDirection',
    'fontSize',
    'fontFamily',
    'height',
    'justifyContent',
    'margin',
    'marginHorrizontal',
    'marginVertical',
    'padding',
    'paddingVertical',
    'paddingHorrizontal',
    'width',
  ]);

  const styles = Object.keys(props)
    .filter(prop => styleProps.has(prop))
    .map(styleProp => ({ [styleProp]: props[styleProp] }));

  const propsWithoutStyles = Object.fromEntries(
    Object.keys(props)
      .filter(prop => !styleProps.has(prop))
      .map(key => [key, props[key]]),
  );

  return { styles, propsWithoutStyles };
};

const withStylesFromProps = (Component, css) => ({ children, ...props }) => {
  const { styles: s, propsWithoutStyles } = stylesFromProps(props);
  props.bgColor && s.push({ backgroundColor: colors[props.bgColor] });
  return (
    <Component style={[css, ...s]} {...propsWithoutStyles}>
      {children}
    </Component>
  );
};

export const Button = withStylesFromProps(TouchableOpacity, {
  borderRadius: 50,
  padding: 8,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

export const Container = withStylesFromProps(View);

export const Text = withStylesFromProps(RNText, {
  fontFamily: fontFamilies.primary,
  color: 'white',
});

export const TextInput = withStylesFromProps(
  props => <RNTextInput {...props} placeholderTextColor="lightgray" />,
  {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    padding: 8,
    textAlign: 'center',
    fontFamily: fontFamilies.primary,
  },
);

export const ScreenContainer = withStylesFromProps(SafeAreaView, {
  backgroundColor: colors.feltGreen,
  ...sizing.fullScreen,
});
