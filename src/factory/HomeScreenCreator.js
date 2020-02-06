import React, { useState } from 'react';

import { HomeScreen } from '../ui';

const createGame = () =>
  new Promise(resolve => {
    const randInt = () => Math.floor(Math.random() * 10);
    const randInts = n => n - 1 && randInts(n - 1) + `${randInt()}`;
    setTimeout(() => resolve(randInts(5)), 5000);
  });

const HomeScreenCreator = ({ navigation: { navigate } }) => {
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const onCreateGameButtonPressed = async () => {
    setIsCreatingGame(true);
    const id = await createGame();
    navigate('Lobby', { id });
    setIsCreatingGame(false);
  };
  const onJoinGameButtonPressed = () => navigate('JoinGame');
  return (
    <HomeScreen
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={onJoinGameButtonPressed}
      isCreatingGame={isCreatingGame}
    />
  );
};

export default HomeScreenCreator;
