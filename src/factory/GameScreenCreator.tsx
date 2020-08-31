import React, { useContext, useCallback } from 'react';

import { GameScreen } from '@modi/ui';
import { AppStateContext, GameStateProvider } from '@modi/providers';
import { useGoHomeIfInvalidGameId } from '@modi/hooks';

interface GameScreenCreatorProps extends MainStackScreenProps<'Game'> {}

const GameScreenCreator: React.FC<GameScreenCreatorProps> = ({
  navigation,
  route,
}) => {
  const gameId = route.params.gameId;
  const [{ username, gameAccessToken }, updateGlobalState] = useContext(
    AppStateContext,
  );

  useGoHomeIfInvalidGameId();

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
      gameId={gameId!}
      onPlayAgainLobbyIdRecieved={goToNewGame}
    >
      <GameScreen />
    </GameStateProvider>
  );
};

export default GameScreenCreator;
