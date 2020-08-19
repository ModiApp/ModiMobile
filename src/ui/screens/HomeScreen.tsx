import React from 'react';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  Button,
  Container,
  LoadingSpinner,
  ScreenContainer,
  Text,
  TextInput,
} from '@modi/ui/components';

interface HomeScreenProps {
  isCreatingGame: boolean;
  shouldAskForUsername: boolean;
  username: string | undefined;
  onUsernameUpdated: (newUsername: string) => void;
  onCreateGameBtnPressed: () => void;
  onJoinGameBtnPressed: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onJoinGameBtnPressed,
  onCreateGameBtnPressed,
  onUsernameUpdated,
  username,
  isCreatingGame,
  shouldAskForUsername,
}) => (
  <ScreenContainer>
    <Container flex={1} alignItems="center" justifyContent="center">
      <Text size={64}>Modi</Text>
    </Container>

    <Container flex={1} justifyContent="flex-end" padding={16}>
      <Container margin={8}>
        {shouldAskForUsername && <Text color="red">Enter a username:</Text>}
        <TextInput
          placeholder="Username"
          marginTop={8}
          padding={18}
          fontSize={28}
          value={username}
          onChangeText={onUsernameUpdated}
        />
      </Container>
      <KeyboardSpacer topSpacing={-150} />
      <Button
        onPress={onJoinGameBtnPressed}
        color="blue"
        title="Join Game"
        titleStyle={{ fontSize: 28 }}
        style={{ borderRadius: 50 }}
      />
      <Button
        onPress={onCreateGameBtnPressed}
        color="red"
        disabled={isCreatingGame}
        style={{ borderRadius: 50 }}
      >
        {isCreatingGame ? (
          <LoadingSpinner size="large" color="white" />
        ) : (
          <Text size={28}>Create Game</Text>
        )}
      </Button>
    </Container>
  </ScreenContainer>
);

export default HomeScreen;
