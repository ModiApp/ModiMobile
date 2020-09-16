import React, { useContext, useCallback } from 'react';

import { GameScreen } from '@modi/ui';
import { AppStateContext, GameStateProvider } from '@modi/providers';
import { StackActions } from '@react-navigation/native';

interface ControlledGameScreenProps extends MainStackScreenProps<'Game'> {}
const GameScreenCreator: React.FC<ControlledGameScreenProps> = ({
  navigation,
}) => {
  const [
    { username, currGameId, gameAccessToken },
    appStateDispatch,
  ] = useContext(AppStateContext);

  const goToNewGame = useCallback((lobbyId: string) => {
    appStateDispatch.removeGameCredentials().then(() => {
      navigation.setParams({ gameId: undefined, accessToken: undefined });
      navigation.dispatch(StackActions.popToTop());
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
