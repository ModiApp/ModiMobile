import React from 'react';
import {
  SafeAreaView,
  View,
  Text as RNText,
  TextInput as RNTextInput,
  ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors, sizing, fontFamilies } from '../styles';

import PlayingCard, { CardBack } from './PlayingCard';
import CardMiniMap from './CardMiniMap';

/** Useful for grabbing style attributes from a component's props */
const stylesFromProps = props => {
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
    .filter(prop => styleProps.has(prop))
    .map(styleProp => ({ [styleProp]: props[styleProp] }));

  const propsWithoutStyles = Object.fromEntries(
    Object.keys(props)
      .filter(prop => !(styleProps.has(prop) || prop === 'style'))
      .map(key => [key, props[key]]),
  );

  const overridenStyles = props.style;

  return { styles, overridenStyles, propsWithoutStyles };
};

const withStylesFromProps = (Component: React.ComponentType, css?) => props => {
  const { styles, overridenStyles, propsWithoutStyles } = stylesFromProps(
    props,
  );
  props.bgColor &&
    styles.push({ backgroundColor: colors[props.bgColor] || props.bgColor });
  props.color && styles.push({ color: colors[props.color] || props.color });
  return (
    <Component
      style={[css, ...styles, overridenStyles]}
      {...propsWithoutStyles}>
      {props.children}
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

export const LoadingSpinner = ActivityIndicator;

export { PlayingCard, CardBack, CardMiniMap };
