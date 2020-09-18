import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  Button,
  Container,
  Icon,
  ScreenContainer,
  Text,
  TextInput,
} from '../components';

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
          <Text size={24}>Game PIN:</Text>
          <Text size={42}>{lobbyId}</Text>
          <Button color="red" onPress={onInviteFriendsBtnPressed} thin>
            <Text size={14}>Invite Friends</Text>
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
        minHeight={24}
      >
        <Button
          color="red"
          fullWidth
          onPress={onBackBtnPressed}
          style={{ height: 64, width: 64, borderRadius: 32 }}
        >
          <Icon name="back" size={32} color="white" />
        </Button>

        <Container flex={1}>
          {attendees[0]?.id === currUserId ? (
            <Button
              color="blue"
              onPress={onStartGameBtnPressed}
              style={{ height: 64 }}
            >
              <Text size={28}>Start Game</Text>
            </Button>
          ) : (
            <Text size={28}>
              Waiting for {attendees[0]?.username} to start the game...
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
          onSubmitEditing={(e) => onUsernameSet(e.nativeEvent.text)}
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
