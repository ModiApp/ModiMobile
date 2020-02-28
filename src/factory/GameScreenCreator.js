import React from 'react';

import { GameScreen } from '../ui';

const GameScreenCreator = ({ navigation }) => {
  const currentPlayer = {
    username: 'Ikey',
    id: '1234',
    card: { suit: 'Spades', rank: 'Jack' },
    lives: 3,
  };
  return <GameScreen currentPlayer={currentPlayer} />;
};

export default GameScreenCreator;
