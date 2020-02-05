import React from 'react';
import { ActivityIndicator } from 'react-native';

import { ScreenContainer, Container, Button, Text } from '../components';

const HomeScreen = ({
  onJoinGameBtnPressed,
  onCreateGameBtnPressed,
  isCreatingGame,
}) => (
  <ScreenContainer>
    <Container flex={1} alignItems="center" justifyContent="center">
      <Text fontSize={48}>Modi</Text>
    </Container>

    <Container flex={1} justifyContent="flex-end" padding={16}>
      <Button onPress={onJoinGameBtnPressed} bgColor="blue" margin={8}>
        <Text fontSize={28}>Join Game</Text>
      </Button>
      <Button
        onPress={onCreateGameBtnPressed}
        bgColor="red"
        margin={8}
        disabled={isCreatingGame}>
        {isCreatingGame ? (
          <>
            <ActivityIndicator size="large" color="white" />
            <Text fontSize={28}> Creating Game...</Text>
          </>
        ) : (
          <Text fontSize={28}>Create Game</Text>
        )}
      </Button>
    </Container>
  </ScreenContainer>
);

export default HomeScreen;
