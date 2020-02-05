import React, { useState } from 'react';

import { HomeScreen } from '../ui';

const createGame = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(1234), 5000);
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
