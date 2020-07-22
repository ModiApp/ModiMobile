import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface IconProps {
  size: number;
}

export const BackIcon: React.FC<IconProps> = ({ size }) => (
  <Icon
    size={size}
    name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'}
    color="white"
  />
);
