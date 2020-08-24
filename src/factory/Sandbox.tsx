import React from 'react';
import { View } from 'react-native';
import { NavigationStackScreenComponent } from 'react-navigation-stack';
import { ScreenContainer } from '@modi/ui/components';

import CardMap from '@modi/ui/screens/GameScreen/CardMap';

const SandboxScreen: NavigationStackScreenComponent = () => {
  return (
    <ScreenContainer>
      <CardMap />
    </ScreenContainer>
  );
};

export default SandboxScreen;
