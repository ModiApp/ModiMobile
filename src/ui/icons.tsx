import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const BackIcon: React.FC<{ size: number }> = ({ size }) => (
  <Icon
    size={size}
    name={Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back'}
    color="white"
  />
);
