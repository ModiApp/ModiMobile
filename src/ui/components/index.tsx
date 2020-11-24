import React from 'react';
import {
  SafeAreaView,
  View,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { colors, fontFamilies } from '../styles';

import PlayingCard, { CardBack } from './PlayingCard';
import Button from './Button';
import Icon from './Icon';
import Text from './Text';
import TextInput from './TextInput';

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

export const ScreenContainer: React.FC = ({ children }) => (
  <SafeAreaView style={styles.screen}>{children}</SafeAreaView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.feltGreen,
  },
});

const LoadingSpinner = ActivityIndicator;

export { Button, CardBack, Icon, LoadingSpinner, PlayingCard, Text, TextInput };
