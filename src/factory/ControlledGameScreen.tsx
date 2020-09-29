import React, { useCallback } from 'react';

import { GameScreen } from '@modi/ui';
import {
  useAppState,
  GameStateProvider,
  GameScreenLayoutProvider,
  GameScreenAnimationProvider,
} from '@modi/providers';
import { StackActions } from '@react-navigation/native';

interface ControlledGameScreenProps extends MainStackScreenProps<'Game'> {}

const ControlledGameScreen: React.FC<ControlledGameScreenProps> = ({
  navigation,
}) => {
  const [
    { username, currGameId, gameAccessToken },
    appStateDispatch,
  ] = useAppState();

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
      <GameScreenLayoutProvider>
        <GameScreenAnimationProvider>
          <GameScreen />
        </GameScreenAnimationProvider>
      </GameScreenLayoutProvider>
    </GameStateProvider>
  );
};

export default ControlledGameScreen;
