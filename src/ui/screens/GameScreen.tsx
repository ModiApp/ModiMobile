import React from 'react';

import { ScreenContainer, Text } from '../components';

const GameScreen = ({
  connectedPlayers,
  currentPlayerId,
  isWaitingForPlayers,
}) => {
  return (
    <ScreenContainer>
      {connectedPlayers.map(({ id, player }) => (
        <Text>{player.username}</Text>
      ))}
    </ScreenContainer>
  );
};

export default GameScreen;
