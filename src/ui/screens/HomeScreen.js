import React from 'react';
import { ActivityIndicator } from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import {
  ScreenContainer,
  Container,
  Button,
  Text,
  TextInput,
} from '../components';

const HomeScreen = ({
  onJoinGameBtnPressed,
  onCreateGameBtnPressed,
  onUsernameUpdated,
  username,
  isCreatingGame,
  isJoiningGame,
  shouldAskForUsername,
}) => (
  <ScreenContainer>
    <Container flex={1} alignItems="center" justifyContent="center">
      <Text fontSize={64}>Modi</Text>
    </Container>

    <Container flex={1} justifyContent="flex-end" padding={16}>
      <Container>
        {shouldAskForUsername && (
          <Text color="red" fontSize={14}>
            Enter a username
          </Text>
        )}
        <TextInput
          placeholder="Username"
          margin={8}
          fontSize={28}
          value={username}
          onChangeText={onUsernameUpdated}
        />
      </Container>
      <KeyboardSpacer topSpacing={-150} />
      <Button
        onPress={onJoinGameBtnPressed}
        bgColor="blue"
        margin={8}
        disabled={isJoiningGame}>
        {isJoiningGame ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Text fontSize={28}>Join Game</Text>
        )}
      </Button>
      <Button
        onPress={onCreateGameBtnPressed}
        bgColor="red"
        margin={8}
        disabled={isCreatingGame}>
        {isCreatingGame ? (
          <ActivityIndicator size="large" color="white" />
        ) : (
          <Text fontSize={28}>Create Game</Text>
        )}
      </Button>
    </Container>
  </ScreenContainer>
);

export default HomeScreen;
