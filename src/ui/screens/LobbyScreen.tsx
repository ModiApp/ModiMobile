import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  ScreenContainer,
  Container,
  Button,
  Text,
  TextInput,
} from '../components';
import { BackIcon } from '../icons';

interface LobbyScreenProps {
  lobbyId: string;
  currUserId: string;
  attendees: LobbyAttendee[];
  showUsernameInput: boolean;
  onUsernameSet: (username: string) => void;
  onInviteFriendsBtnPressed: () => void;
  onStartGameBtnPressed: () => void;
  onBackBtnPressed: () => void;
}
const LobbyScreen: React.FC<LobbyScreenProps> = ({
  lobbyId,
  currUserId,
  attendees,
  showUsernameInput,
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
          <Text fontSize={42}>{lobbyId}</Text>
          <Button bgColor="red" onPress={onInviteFriendsBtnPressed}>
            <Text fontSize={14}>Invite Friends</Text>
          </Button>
        </Container>
      </Container>

      <Container flex={7} paddingVertical={8}>
        <PlayerList players={attendees} />
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
          {(attendees[0] || {}).id === currUserId ? (
            <Button bgColor="blue" onPress={onStartGameBtnPressed}>
              <Text fontSize={28}>Start Game</Text>
            </Button>
          ) : (
            <Text fontSize={28}>
              Waiting for {(attendees[0] || {}).username} to start the game...
            </Text>
          )}
        </Container>
      </Container>
    </Container>
    {showUsernameInput && (
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

interface PlayerListProps {
  players: LobbyAttendee[];
}
const PlayerList: React.FC<PlayerListProps> = ({ players }) => (
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
