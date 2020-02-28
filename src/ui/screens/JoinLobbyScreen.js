import React from 'react';
import { SafeAreaView, KeyboardAvoidingView } from 'react-native';

import {
  Container,
  Button,
  Text,
  TextInput,
  LoadingSpinner,
} from '../components';

import { BackIcon } from '../icons';

const JoinLobbyScreen = ({
  onLobbyIdSet,
  isValidatingLobbyId,
  isLobbyIdInvalid,
  validationError,
  onCancel,
}) => (
  <SafeAreaView flex={1}>
    <Button width={56} margin={16} onPress={onCancel}>
      <BackIcon size={28} />
    </Button>
    <KeyboardAvoidingView flex={1} justifyContent="flex-end" behavior="padding">
      <Container margin={16}>
        <Container flexDirection="row" alignItems="center">
          {isValidatingLobbyId && <LoadingSpinner size="small" color="white" />}
          <Text
            color={isLobbyIdInvalid || validationError ? 'red' : 'white'}
            margin={8}
            fontSize={16}>
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
          onSubmitEditing={e => onLobbyIdSet(e.nativeEvent.text)}
          autoFocus
          keyboardType="numeric"
        />
      </Container>
    </KeyboardAvoidingView>
  </SafeAreaView>
);

export default JoinLobbyScreen;
