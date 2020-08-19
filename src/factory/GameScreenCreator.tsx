import React, { useEffect, useContext, useCallback } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { validateGameId } from '@modi/util';
import { GameScreen } from '@modi/ui';
import { AppStateContext, GameStateProvider } from '@modi/providers';

type NavParams = { gameId: string };
const GameScreenCreator: NavigationStackScreenComponent<NavParams, {}> = ({
  navigation,
}) => {
  const [globalState, updateGlobalState] = useContext(AppStateContext);
  const { username, gameAccessToken } = globalState;
  const gameId = navigation.getParam('gameId');
  useEffect(() => {
    gameId &&
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
    updateGlobalState({
      currGameId: undefined,
      gameAccessToken: undefined,
    }).then(() => {
      navigation.navigate('Lobby', { lobbyId });
    });
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
