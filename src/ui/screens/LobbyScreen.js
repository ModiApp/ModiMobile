import React from 'react';
import PropTypes from 'prop-types';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  ScreenContainer,
  Container,
  Button,
  Text,
  TextInput,
} from '../components';
import { BackIcon } from '../icons';

const LobbyScreen = ({
  gamePin,
  lobbyCreator,
  currentPlayer,
  connectedPlayers,
  askForUsername,
  onUsernameSet,
  onInviteFriendsBtnPressed,
  onStartGameBtnPressed,
  onBackBtnPressed,
}) => (
  <ScreenContainer>
    <Container flex={1} padding={8} paddingHorizontal={16}>
      <Container flex={2} justifyContent="center" minHeight={52}>
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

      <Container
        flex={1}
        flexDirection="row"
        alignItems="center"
        minHeight={24}>
        <Container flex={1} marginRight={8}>
          <Button bgColor="red" onPress={onBackBtnPressed}>
            <BackIcon size={28} />
          </Button>
        </Container>

        <Container flex={5}>
          {lobbyCreator.id === currentPlayer.id ? (
            <Button bgColor="blue" onPress={onStartGameBtnPressed}>
              <Text fontSize={28}>Start Game</Text>
            </Button>
          ) : (
            <Text fontSize={28}>
              Waiting for {lobbyCreator.username} to start the game...
            </Text>
          )}
        </Container>
      </Container>
    </Container>
    {askForUsername && (
      <Container>
        <TextInput
          placeholder="Username"
          padding={8}
          fontSize={28}
          marginHorizontal={16}
          onSubmitEditing={e => onUsernameSet(e.nativeEvent.text)}
        />
        <KeyboardSpacer />
      </Container>
    )}
  </ScreenContainer>
);

const PlayerSchema = PropTypes.shape({
  username: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
});

LobbyScreen.propTypes = {
  gamePin: PropTypes.string.isRequired,
  lobbyCreator: PlayerSchema,
  currentPlayer: PlayerSchema,
  connectedPlayers: PropTypes.arrayOf(PlayerSchema),
  onInviteFriendsBtnPressed: PropTypes.func.isRequired,
  onStartGameBtnPressed: PropTypes.func.isRequired,
};

LobbyScreen.defaultProps = {
  lobbyCreator: {},
  currentPlayer: {},
};

const PlayerList = ({ players }) => (
  <Container height="100%" padding={16} borderRadius={20} bgColor="lightGreen">
    {players.map(({ username, id }, i) => (
      <Container padding={16} key={id}>
        <Text fontSize={24}>
          {i + 1}) {username}
        </Text>
      </Container>
    ))}
  </Container>
);

export default LobbyScreen;
