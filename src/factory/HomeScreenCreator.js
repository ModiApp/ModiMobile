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
  const onCreateGameButtonPressed = async () => {
    setIsCreatingGame(true);
    return createLobby()
      .then(id => {
        if (state.username !== '') {
          navigation.navigate('Lobby', { id });
        }
      })
      .finally(() => setIsCreatingGame(false));
  };
  const onJoinGameButtonPressed = () => navigation.navigate('JoinGame');
  return (
    <HomeScreen
      onCreateGameBtnPressed={onCreateGameButtonPressed}
      onJoinGameBtnPressed={onJoinGameButtonPressed}
      onUsernameUpdated={u => updateState({ username: u })}
      username={state.username}
      isCreatingGame={isCreatingGame}
    />
  );
};

export default HomeScreenCreator;
