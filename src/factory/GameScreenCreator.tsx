import React, { useContext, useCallback, useEffect } from 'react';

import { GameScreen } from '@modi/ui';
import { AppStateContext, GameStateProvider } from '@modi/providers';
import { useNavigation } from '@modi/hooks';
import { useFocusEffect } from '@react-navigation/native';

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
      navigation.navigate('Lobby', { lobbyId });
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(
        'got to gamescreen with',
        gameAccessToken,
        currGameId,
        username,
      );
    }, [gameAccessToken, currGameId]),
  );

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
