import React, { useState, useContext, useEffect } from 'react';

import AppContext from '../StateManager';
import { LobbyService, GameService } from '../service';
import { HomeScreen } from '../ui';
import { NavigationStackScreenComponent } from 'react-navigation-stack';

const HomeScreenCreator: NavigationStackScreenComponent = ({ navigation }) => {
  const [globalState, updateState] = useContext(AppContext);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);

  const { username, currentLobbyId, currentGameId } = globalState;

  // Try to move this to a point before the homescreen is even rendered
  useEffect(() => {
    (async () => {
      if (currentLobbyId) {
        const stillExists = await LobbyService.isLobbyIdValid(currentLobbyId);
        if (!stillExists) {
          updateState({ currentLobbyId: undefined });
        } else {
          navigation.navigate('Lobby', { id: currentLobbyId });
        }
      } else if (currentGameId) {
        const stillExists = await GameService.isGameIdValid(currentGameId);
        if (!stillExists) {
          updateState({
            currentGameId: undefined,
            authorizedPlayerId: undefined,
          });
        } else {
          navigation.navigate('Game', { id: currentGameId });
        }
      }
    })();
  }, [currentLobbyId, currentGameId, navigation]);

  const onCreateGameButtonPressed = async () => {
    if (requireUsername()) {
      setIsCreatingGame(true);
      LobbyService.createLobby()
        .then(id => navigation.navigate('Lobby', { id }))
        .finally(() => setIsCreatingGame(false));
    }
  };

  const requireUsername = () => {
    return !!username || setShouldAskForUsername(true);
  };

  return (
    <HomeScreen
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={() => {
        requireUsername() && navigation.navigate('JoinLobby');
      }}
      onUsernameUpdated={u => updateState({ username: u })}
      username={username}
      isCreatingGame={isCreatingGame}
      shouldAskForUsername={shouldAskForUsername && !username}
    />
  );
};

export default HomeScreenCreator;
