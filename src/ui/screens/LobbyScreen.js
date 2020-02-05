import React from 'react';
import PropTypes from 'prop-types';

import { ScreenContainer, Container, Button, Text } from '../components';

const LobbyScreen = ({
  gamePin,
  lobbyCreator,
  currentPlayer,
  connectedPlayers,
  onInviteFriendsBtnPressed,
  onStartGameBtnPressed,
}) => (
  <ScreenContainer>
    <Container flex={1} paddingHorrizonal={16}>
      <Container flex={2} justifyContent="center">
        <Container alignItems="center">
          <Text fontSize={24}>Game PIN:</Text>
          <Text fontSize={42}>{gamePin}</Text>
          <Button bgColor="red" onPress={onInviteFriendsBtnPressed}>
            <Text fontSize={14}>Invite Friends</Text>
          </Button>
        </Container>
      </Container>

      <Container flex={7} paddingVertical={8}>
        <PlayerList players={connectedPlayers} />
      </Container>

      <Container flex={1} justifyContent="center">
        {lobbyCreator.id === currentPlayer.id ? (
          <Button bgColor="blue" onPress={onStartGameBtnPressed}>
            <Text fontSize={24}>Start Game</Text>
          </Button>
        ) : (
          <Text fontSize={24}>
            Waiting for {lobbyCreator.username} to start the game...
          </Text>
        )}
      </Container>
    </Container>
  </ScreenContainer>
);

const PlayerSchema = PropTypes.shape({
  username: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
});

LobbyScreen.propTypes = {
  gamePin: PropTypes.number.isRequired,
  lobbyCreator: PlayerSchema,
  connectedPlayers: PropTypes.arrayOf(PlayerSchema),
  onInviteFriendsBtnPressed: PropTypes.func.isRequired,
  onStartGameBtnPressed: PropTypes.func.isRequired,
};

const PlayerList = ({ players }) => (
  <Container height="100%" padding={16} borderRadius={20} bgColor="lightGreen">
    {players.map(({ username, id }, i) => (
      <Container padding={16}>
        <Text fontSize={24}>
          {i + 1}) {username}
        </Text>
      </Container>
    ))}
  </Container>
);

export default LobbyScreen;
