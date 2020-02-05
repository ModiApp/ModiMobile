import React from 'react';

import { LobbyScreen } from '../ui';
import { Button, Text } from '../ui/components';

const LobbyScreenCreator = ({ navigation }) => {
  const gamePin = navigation.getParam('id') || 123456;
  const lobbyCreator = { username: 'ikey', id: 2 };
  const currentPlayer = { username: 'ikey', id: 2 };
  const connectedPlayers = [
    { username: 'ikey', id: 1 },
    { username: 'jshapoopa 42', id: 2 },
    { username: 'louie', id: 3 },
  ];
  const openShareTab = () => console.log('Opened share tab');
  const goToGame = () => console.log('Navigating to game!');
  return (
    <LobbyScreen
      gamePin={gamePin}
      lobbyCreator={lobbyCreator}
      currentPlayer={currentPlayer}
      connectedPlayers={connectedPlayers}
      onInviteFriendsBtnPressed={openShareTab}
      onStartGameBtnPressed={goToGame}
    />
  );
};

LobbyScreenCreator.navigationOptions = ({ navigation: { goBack } }) => ({
  headerShown: true,
  headerLeft: () => (
    <Button onPress={goBack} padding={8}>
      <Text fontSize={32}>&larr;</Text>
    </Button>
  ),
});

export default LobbyScreenCreator;
