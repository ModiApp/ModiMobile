import React from 'react';

import { ScreenContainer, Container } from '@modi/ui/components';

import CardMap from './CardMap';
import BottomControls from './BottomControls';

const GameScreen: React.FC = () => {
  return (
    <ScreenContainer>
      <Container flex={1}>
        <CardMap />
      </Container>
      <BottomControls />
    </ScreenContainer>
  );
};

export default GameScreen;
