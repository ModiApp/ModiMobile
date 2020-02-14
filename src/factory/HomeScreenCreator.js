import React, { useState, useContext } from 'react';

import AppContext from '../StateManager';
import { LobbyService } from '../service';
import { HomeScreen } from '../ui';

const HomeScreenCreator = ({ navigation }) => {
  const [state, updateState] = useContext(AppContext);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);

  const onCreateGameButtonPressed = async () => {
    if (requireUsername()) {
      setIsCreatingGame(true);
      LobbyService.createLobby()
        .then(id => navigation.navigate('Lobby', { id }))
        .finally(() => setIsCreatingGame(false));
    }
  };

  const requireUsername = () => {
    const hasUsername = state.username !== '';
    return hasUsername || (setShouldAskForUsername(true) && false);
  };

  return (
    <HomeScreen
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={() => {
        if (requireUsername()) {
          navigation.navigate('JoinLobby');
          setIsJoiningGame(true);
        }
      }}
      onUsernameUpdated={u => updateState({ username: u })}
      username={state.username}
      isCreatingGame={isCreatingGame}
      isJoiningGame={isJoiningGame}
      shouldAskForUsername={shouldAskForUsername && !!state.username}
    />
  );
};

export default HomeScreenCreator;
