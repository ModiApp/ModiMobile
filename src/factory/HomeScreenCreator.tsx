import React, { useEffect, useState, useContext, useCallback } from 'react';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

import { validateGameId, validateLobbyId, createLobby } from '@modi/util';
import { useAppState } from '@modi/hooks';

import { HomeScreen } from '@modi/ui';

const HomeScreenCreator: NavigationStackScreenComponent = ({ navigation }) => {
  const [globalState, updateGlobalState] = useAppState();

  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);

  const { username, currLobbyId, currGameId } = globalState;
  useEffect(() => {
    if (currLobbyId) {
      validateLobbyId(currLobbyId).then((isValid) => {
        if (isValid) {
          navigation.navigate('Lobby', { lobbyId: currLobbyId });
        } else {
          navigation.setParams({ lobbyId: undefined });
          updateGlobalState({ currLobbyId: undefined });
        }
      });
    }
    if (currGameId) {
      validateGameId(currGameId).then((isValid) => {
        if (isValid) {
          navigation.navigate('Game', { gameId: currGameId });
        } else {
          navigation.setParams({ gameId: undefined });
          updateGlobalState({
            currGameId: undefined,
            gameAccessToken: undefined,
          });
        }
      });
    }
  }, [currLobbyId, currGameId]);

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
