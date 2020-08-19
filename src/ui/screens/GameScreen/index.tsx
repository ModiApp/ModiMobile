import React from 'react';
import { Animated, View } from 'react-native';

import { useGameState } from '@modi/hooks';
import {
  ScreenContainer,
  Container,
  PlayingCard,
  Text,
} from '@modi/ui/components';

import BottomControls from './BottomControls';

const GameScreen: React.FC = () => {
  const { me } = useGameState();

  // const [card, cardPosAnim] = useCardAnimation(gameState, gameAccessToken);
  const card = me?.card;
  return (
    <ScreenContainer>
      <Container>
        <Text size={24}>{me?.username}</Text>
        <Text size={16}>Lives: {me?.lives}</Text>
      </Container>
      <View
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        <Animated.View
          style={{
            // position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            // transform: [
            //   {
            //     translateX: cardPosAnim.x.interpolate({
            //       inputRange: [-1, 1],
            //       outputRange: ['-100%', '100%'],
            //     }),
            //   },
            //   {
            //     translateY: cardPosAnim.y.interpolate({
            //       inputRange: [0, 1],
            //       outputRange: ['0%', '-150%'],
            //     }),
            //   },
            // ],
          }}
        >
          {!!card && <PlayingCard suit={card.suit} rank={card.rank} />}
        </Animated.View>
      </View>
      <BottomControls />
    </ScreenContainer>
  );
};

export default GameScreen;
