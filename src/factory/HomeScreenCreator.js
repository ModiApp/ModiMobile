import React, { useState, useContext } from 'react';
import axios from 'axios';

import AppContext from '../StateManager';
import { HomeScreen } from '../ui';

const API_URL = 'https://modi-server.herokuapp.com';
//const API_URL = 'http://localhost:5000';

const createLobby = () =>
  axios.get(`${API_URL}/lobbies/new`).then(r => r.data.lobbyId);
// const createLobby = () => new Promise(r => setTimeout(() => r('1234'), 500));
const HomeScreenCreator = ({ navigation }) => {
  const [state, updateState] = useContext(AppContext);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isJoiningGame, setIsJoiningGame] = useState(false);
  const [shouldAskForUsername, setShouldAskForUsername] = useState(false);
  const onCreateGameButtonPressed = async () => {
    if (requireUsername()) {
      setIsCreatingGame(true);
      createLobby()
        .then(id => {
          navigation.navigate('Lobby', { id });
        })
        .finally(() => setIsCreatingGame(false));
    }
  };
  const onJoinGameButtonPressed = () => {
    if (requireUsername()) {
      setIsJoiningGame(true);
      // Modal with prompt to set lobbyId
      navigation.navigate('JoinGame');
    }
  };

  const requireUsername = () => {
    const hasUsername = state.username !== '';
    return hasUsername || (setShouldAskForUsername(true) && false);
  };

  return (
    <HomeScreen
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={onJoinGameButtonPressed}
      onUsernameUpdated={u => updateState({ username: u })}
      username={state.username}
      isCreatingGame={isCreatingGame}
      isJoiningGame={isJoiningGame}
      shouldAskForUsername={shouldAskForUsername && state.username === ''}
    />
  );
};

export default HomeScreenCreator;
