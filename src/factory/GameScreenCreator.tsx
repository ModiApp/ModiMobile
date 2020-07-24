import React, { useEffect, useContext } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { GameScreen } from '../ui';
import GameStateProvider from '../service/GameStateProvider';
import AppContext from '../StateManager';

// Not yet sure if i want to make a regular http request or use socket
// to determine if game exists
const mockGameService = () => ({
  isGameIdValid: (id: string) => !!id,
});

const GameService = mockGameService();

const GameScreenCreator: NavigationStackScreenComponent = ({ navigation }) => {
  const [globalState, updateGlobalState] = useContext(AppContext);
  const { username, authorizedPlayerId } = globalState;
  const gameId = navigation.getParam('id');
  useEffect(() => {
    (async () => {
      const isValid = await GameService.isGameIdValid(gameId);
      if (!isValid) {
        updateGlobalState({
          authorizedPlayerId: undefined,
          currentGameId: undefined,
        });
        navigation.navigate('Home');
      }
    })();
  }, [gameId]);

  return (
    <GameStateProvider
      username={username!}
      authorizedPlayerId={authorizedPlayerId!}
      gameId={gameId}>
      <GameScreen />
    </GameStateProvider>
  );
};

export default GameScreenCreator;
