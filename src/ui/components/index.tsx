import React from 'react';
import {
  SafeAreaView,
  View,
  Text as RNText,
  TextInput as RNTextInput,
  ActivityIndicator,
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { colors, sizing, fontFamilies } from '../styles';

import PlayingCard, { CardBack } from './PlayingCard';
import Button from './Button';
import Icon from './Icon';
import Text from './Text';

/** Useful for grabbing style attributes from a component's props */
const stylesFromProps = (props) => {
  const styleProps = new Set([
    'alignItems',
    'aspectRatio',
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
    'minHeight',
    'padding',
    'paddingVertical',
    'paddingHorrizontal',
    'width',
    'transform',
  ]);

  const styles = Object.keys(props)
    .filter((prop) => styleProps.has(prop))
    .map((styleProp) => ({ [styleProp]: props[styleProp] }));

  const propsWithoutStyles = Object.fromEntries(
    Object.keys(props)
      .filter((prop) => !(styleProps.has(prop) || prop === 'style'))
      .map((key) => [key, props[key]]),
  );

  const overridenStyles = props.style;

  return { styles, overridenStyles, propsWithoutStyles };
};

const withStylesFromProps = (Component: React.ComponentType, css?) => (
  props,
) => {
  const { styles, overridenStyles, propsWithoutStyles } = stylesFromProps(
    props,
  );
  props.bgColor &&
    styles.push({ backgroundColor: colors[props.bgColor] || props.bgColor });
  props.color && styles.push({ color: colors[props.color] || props.color });
  return (
    <Component
      style={[css, ...styles, overridenStyles]}
      {...propsWithoutStyles}
    >
      {props.children}
    </Component>
  );
};

export const Container = withStylesFromProps(View) as React.FC<
  StyleProp<ViewStyle>
>;

export const TextInput = withStylesFromProps(
  (props) => <RNTextInput {...props} placeholderTextColor="lightgray" />,
  {
    backgroundColor: 'white',
    color: 'black',
    borderRadius: 50,
    padding: 8,
    textAlign: 'center',
    fontFamily: fontFamilies.primary,
  },
) as React.FC<TextInputProps>;
type TextInputProps = RNTextInputProps & StyleProp<TextStyle>;
export const ScreenContainer = withStylesFromProps(SafeAreaView, {
  backgroundColor: colors.feltGreen,
  ...sizing.fullScreen,
});

const LoadingSpinner = ActivityIndicator;

export { Button, CardBack, Icon, LoadingSpinner, PlayingCard, Text };
