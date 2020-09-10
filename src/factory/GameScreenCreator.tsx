import React, { useContext, useCallback } from 'react';

import { GameScreen } from '@modi/ui';
import { AppStateContext, GameStateProvider } from '@modi/providers';
import { useNavigation } from '@modi/hooks';

const GameScreenCreator: React.FC = () => {
  const navigation = useNavigation();

  const [
    { username, currGameId, gameAccessToken },
    appStateDispatch,
  ] = useContext(AppStateContext);

  const goToNewGame = useCallback((lobbyId: string) => {
    appStateDispatch.removeGameCredentials().then(() => {
      navigation.navigate('Lobby', { lobbyId });
    });
  }, []);

  return (
    <GameStateProvider
      username={username!}
      accessToken={gameAccessToken!}
      gameId={currGameId!}
      onPlayAgainLobbyIdRecieved={goToNewGame}
    >
      <GameScreen />
    </GameStateProvider>
  );
};

export default GameScreenCreator;
