import React, { useEffect, useState, useContext } from 'react';
import Share from 'react-native-share';

import useLobbyConnection from '../hooks/useLobbyConnection';
import { LobbyScreen } from '../ui';
import AppContext from '../StateManager';

const LobbyScreenCreator = ({ navigation }) => {
  const [appState, _] = useContext(AppContext);
  const lobbyId = navigation.getParam('id'),
    gamePin = lobbyId;
  const [username, setUsername] = useState(appState.username);

  // If came from url, manually set username here
  useEffect(() => {
    if (!username) {
      setUsername(prompt('Enter username:'));
    }
  }, [username]);

  const { connectedPlayers, currentPlayer, lobbyLeader } = useLobbyConnection(
    lobbyId,
    username,
  );

  // When lobby creator presses 'start game' button
  const goToGame = () => console.log('Navigating to game!');

  // When user presses 'Invite Friends' button
  const openShareTab = () =>
    Share.open({
      message: `Join My Modi Game! modi://lobbies/${lobbyId}`,
    });

  return (
    <LobbyScreen
      gamePin={gamePin}
      lobbyCreator={lobbyLeader}
      currentPlayer={currentPlayer}
      connectedPlayers={connectedPlayers}
      onInviteFriendsBtnPressed={openShareTab}
      onStartGameBtnPressed={goToGame}
      onBackBtnPressed={navigation.goBack}
    />
  );
};

export default LobbyScreenCreator;
