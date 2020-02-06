import React from 'react';
import Share from 'react-native-share';
import { LobbyScreen } from '../ui';

const LobbyScreenCreator = ({ navigation }) => {
  // Use lobbyId from url as 'Game Pin'
  const gamePin = navigation.getParam('id') || 123456;

  // Connect to LobbyService
  const lobbyCreator = { username: 'ikey', id: 2 };
  const currentPlayer = { username: 'ikey', id: 2 };
  const connectedPlayers = [
    { username: 'ikey', id: 1 },
    { username: 'jshapoopa 42', id: 2 },
    { username: 'louie', id: 3 },
  ];

  // When lobby creator presses 'start game' button
  const goToGame = () => console.log('Navigating to game!');

  // When user presses 'Invite Friends' button
  const openShareTab = () =>
    Share.open({
      message: `Ikey invited you to join their Modi Game! com.ikeybenz.modi:lobbies/${gamePin}`,
    })
      .then(res => console.log('Res:', res))
      .catch(err => console.log('Err', err));

  return (
    <LobbyScreen
      gamePin={gamePin}
      lobbyCreator={lobbyCreator}
      currentPlayer={currentPlayer}
      connectedPlayers={connectedPlayers}
      onInviteFriendsBtnPressed={openShareTab}
      onStartGameBtnPressed={goToGame}
      onBackBtnPressed={navigation.goBack}
    />
  );
};

export default LobbyScreenCreator;
