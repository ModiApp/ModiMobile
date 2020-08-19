import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import BaseIcon from 'react-native-vector-icons/Ionicons';
import { IconProps as BaseIconProps } from 'react-native-vector-icons/Icon';

type IconName = 'back' | 'home';
interface IconProps extends BaseIconProps {
  name: IconName;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ name, size, ...props }) => {
  const useIconName = useCallback((customName: IconName) => {
    return ({
      back: Platform.OS === 'ios' ? 'ios-arrow-back' : 'md-arrow-round-back',
      home: 'home-sharp',
    } as { [key in IconName]: string })[customName];
  }, []);

  return <BaseIcon name={useIconName(name)} size={size} {...props} />;
};

export default Icon;
