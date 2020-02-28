import React from 'react';
import {
  SafeAreaView,
  View,
  Text as RNText,
  TextInput as RNTextInput,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { colors, sizing, fontFamilies } from '../styles';

import PlayingCard from './PlayingCard';

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
  props.bgColor &&
    s.push({ backgroundColor: colors[props.bgColor] || props.bgColor });
  props.color && s.push({ color: colors[props.color] || props.color });
  return (
    <Component style={[css, ...s]} {...propsWithoutStyles}>
      {children}
    </Component>
  );
};

const Button = withStylesFromProps(TouchableOpacity, {
  borderRadius: 50,
  padding: 8,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const Container = withStylesFromProps(View);

const Text = withStylesFromProps(RNText, {
  fontFamily: fontFamilies.primary,
  color: 'white',
});

const TextInput = withStylesFromProps(
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

const ScreenContainer = withStylesFromProps(SafeAreaView, {
  backgroundColor: colors.feltGreen,
  ...sizing.fullScreen,
});

const LoadingSpinner = ActivityIndicator;

export {
  ScreenContainer,
  Container,
  Button,
  Text,
  TextInput,
  LoadingSpinner,
  PlayingCard,
};
