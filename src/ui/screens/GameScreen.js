import React from 'react';

import { ScreenContainer, Container, PlayingCard } from '../components';

const GameScreen = ({ currentPlayer }) => {
  return (
    <ScreenContainer>
      <Container flex={1} />
      <Container alignItems="center">
        <PlayingCard
          rank={currentPlayer.card.rank}
          suit={currentPlayer.card.suit}
        />
      </Container>
    </ScreenContainer>
  );
};

export default GameScreen;
