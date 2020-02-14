import React, { useContext } from 'react';
import Share from 'react-native-share';

import { LobbyScreen } from '../ui';
import AppContext from '../StateManager';

const LobbyScreenCreator = ({ navigation }) => {
  const lobbyId = navigation.getParam('id');
  const [{ username }, updateState] = useContext(AppContext);
  const {
    connectedPlayers,
    currentPlayer,
    lobbyLeader,
    sendMessage,
  } = LobbyService.useLobbyConnection(lobbyId, username);

  // When lobby creator presses 'start game' button
  const goToGame = () => {
    console.log('(not implemented yet) leader started game!');
    // sendMessage('start game');
  };

  // When user presses 'Invite Friends' button
  const openShareTab = () =>
    Share.open({
      message: `Join My Modi Game! modi://lobbies/${lobbyId}`,
    });

  return (
    <LobbyScreen
      gamePin={lobbyId}
      lobbyCreator={lobbyLeader}
      currentPlayer={currentPlayer}
      connectedPlayers={connectedPlayers}
      askForUsername={!username || username === ''}
      onUsernameSet={u => updateState({ username: u })}
      onInviteFriendsBtnPressed={openShareTab}
      onStartGameBtnPressed={goToGame}
      onBackBtnPressed={navigation.goBack}
    />
  );
};

export default LobbyScreenCreator;
