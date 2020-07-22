import React, { useRef } from 'react';
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';

import Text from './Text';
import { colors } from '../styles';

interface ButtonProps {
  color: ColorName;
  title?: string;

  /** Defaults to true */
  fullWidth?: boolean;

  /** Custom styles for the title Text component */
  titleStyle?: StyleProp<TextStyle>;

  /** Lessens padding of button title. Default is false */
  thin?: boolean;
}

const Button: React.FC<ButtonProps & TouchableOpacityProps> = ({
  title,
  onPress,
  color,
  fullWidth,
  titleStyle,
  thin,
  children,
  style,
  ...props
}) => {
  const defaultStyles = useRef<StyleProp<ViewStyle>>({
    flex: fullWidth ? 1 : undefined,
    backgroundColor: colors[color],
    margin: 8,
    padding: thin ? 8 : 16,
    borderRadius: 16,
    alignItems: 'center',
  }).current;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[defaultStyles, style]}
      {...props}>
      {title ? <Text style={titleStyle}>{title}</Text> : children}
    </TouchableOpacity>
  );
};

export default Button;
