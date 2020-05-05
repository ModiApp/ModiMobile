import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const BackIcon = props =>
  Platform.OS === 'ios' ? (
    <Icon {...props} name="ios-arrow-back" color="white" />
  ) : (
    <Icon {...props} name="md-arrow-round-back" color="white" />
  );
