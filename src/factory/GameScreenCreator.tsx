import React, { useEffect, useContext, useCallback } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { validateGameId } from '../util';
import { GameScreen } from '../ui';
import { GameStateProvider } from '../providers';
import AppContext from '../StateManager';

type NavParams = { gameId: string };
const GameScreenCreator: NavigationStackScreenComponent<NavParams, {}> = ({
  navigation,
}) => {
  const [globalState, updateGlobalState] = useContext(AppContext);
  const { username, gameAccessToken } = globalState;
  const gameId = navigation.getParam('gameId');
  useEffect(() => {
    validateGameId(gameId).then((isValid) => {
      if (!isValid) {
        updateGlobalState({
          gameAccessToken: undefined,
          currGameId: undefined,
        });
        navigation.navigate('Home');
      }
    });
  }, [gameId]);

  const goToNewGame = useCallback((lobbyId: string) => {
    updateGlobalState({ currGameId: undefined, gameAccessToken: undefined });
    navigation.navigate('Lobby', { lobbyId });
  }, []);

  return (
    <GameStateProvider
      username={username!}
      accessToken={gameAccessToken!}
      gameId={gameId}
      onPlayAgainLobbyIdRecieved={goToNewGame}
    >
      <GameScreen />
    </GameStateProvider>
  );
};

export default GameScreenCreator;
