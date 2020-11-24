import React, { useState, useCallback } from 'react';

import { createLobby } from '@modimobile/util';
import { useAppState, useNavigation } from '@modimobile/hooks';
import { HomeScreen } from '@modimobile/ui';

const ControlledHomeScreen: React.FC = () => {
  const [{ username }, appStateDispatch] = useAppState();
  const navigation = useNavigation();
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);

  const onCreateGameButtonPressed = useCallback(() => {
    if (requireUsername()) {
      setIsCreatingGame(true);
      createLobby()
        .then((lobbyId) => navigation.navigate('Lobby', { lobbyId }))
        .catch((error) => console.error(error.message))
        .finally(() => setIsCreatingGame(false));
    }
  }, [username]);

  const onJoinGameBtnPressed = useCallback(() => {
    if (requireUsername()) {
      navigation.navigate('JoinLobby');
    }
  }, [username]);

  const requireUsername = useCallback(() => {
    return !!username || setShouldAskForUsername(true);
  }, [username]);

  return (
    <HomeScreen
      username={username}
      isCreatingGame={isCreatingGame}
      shouldAskForUsername={shouldAskForUsername && !username}
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={onJoinGameBtnPressed}
      onUsernameUpdated={appStateDispatch.setUsername}
    />
  );
};

export default ControlledHomeScreen;
