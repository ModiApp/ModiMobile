import React from 'react';
import { SafeAreaView, KeyboardAvoidingView, Keyboard } from 'react-native';

import {
  Container,
  Text,
  TextInput,
  LoadingSpinner,
  Icon,
  Button,
} from '@modi/ui/components';

interface JoinLobbyScreenProps {
  isValidatingLobbyId: boolean;
  validationError?: string;
  isLobbyIdInvalid: boolean;
  onLobbyIdSet: (lobbyId: string) => void;
  onCancel: () => void;
}
const JoinLobbyScreen: React.FC<JoinLobbyScreenProps> = ({
  onLobbyIdSet,
  isValidatingLobbyId,
  isLobbyIdInvalid,
  validationError,
  onCancel,
}) => (
  <SafeAreaView style={{ flex: 1 }}>
    <Button onPress={onCancel} style={{ alignSelf: 'flex-start' }}>
      <Icon name="back" size={28} color="white" />
    </Button>
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: 'center' }}
      behavior="padding"
      onTouchEnd={Keyboard.dismiss}
    >
      <Container margin={16}>
        <Container flexDirection="row" alignItems="center">
          {isValidatingLobbyId && <LoadingSpinner size="small" color="white" />}
          <Text
            color={isLobbyIdInvalid || validationError ? 'red' : 'white'}
            margin={8}
            fontSize={16}
          >
            {isLobbyIdInvalid
              ? 'Invalid Game PIN'
              : validationError
              ? validationError
              : isValidatingLobbyId
              ? 'Joining...'
              : 'Join Existing Game'}
          </Text>
        </Container>

        <TextInput
          fontSize={24}
          placeholder="Game PIN"
          onSubmitEditing={(e) => onLobbyIdSet(e.nativeEvent.text)}
          autoFocus
        />
      </Container>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export default JoinLobbyScreen;
