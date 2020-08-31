import React, { useState, useCallback } from 'react';

import { createLobby } from '@modi/util';
import { useAppState, useNavigateToCurrGameOrLobby } from '@modi/hooks';
import { HomeScreen } from '@modi/ui';

interface HomeScreenCreatorProps extends MainStackScreenProps<'Home'> {}

const HomeScreenCreator: React.FC<HomeScreenCreatorProps> = ({
  navigation,
}) => {
  const [{ username }, updateGlobalState] = useAppState();

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);

  // Checks if device has an active gameId or lobbyId
  useNavigateToCurrGameOrLobby();

  const onCreateGameButtonPressed = useCallback(() => {
    if (requireUsername()) {
      setIsCreatingGame(true);
      createLobby()
        .then((lobbyId) => updateGlobalState({ currLobbyId: lobbyId }))
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

  const saveNewUsername = useCallback((newUsername: string) => {
    updateGlobalState({ username: newUsername });
  }, []);

  return (
    <HomeScreen
      username={username}
      isCreatingGame={isCreatingGame}
      shouldAskForUsername={shouldAskForUsername && !username}
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={onJoinGameBtnPressed}
      onUsernameUpdated={saveNewUsername}
    />
  );
};

export default HomeScreenCreator;
