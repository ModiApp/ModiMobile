import React from 'react';
import { Animated, View } from 'react-native';

import { useGameState } from '@modi/hooks';
import { ScreenContainer, Container, Text } from '@modi/ui/components';

import CardMap from './CardMap';
import BottomControls from './BottomControls';

const GameScreen: React.FC = () => {
  const { me } = useGameState();
  return (
    <ScreenContainer>
      <Container>
        <Text size={24}>{me?.username}</Text>
        <Text size={16}>Lives: {me?.lives}</Text>
      </Container>
      <Container flex={1}>
        <CardMap />
      </Container>
      <BottomControls />
    </ScreenContainer>
  );
};

export default GameScreen;
