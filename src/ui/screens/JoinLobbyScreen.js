import React from 'react';
import { SafeAreaView } from 'react-native';
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
  onCancel,
}) => (
  <SafeAreaView flex={1}>
    <Button width={56} margin={16} onPress={onCancel}>
      <BackIcon size={28} />
    </Button>
    <Container flex={1} justifyContent="center">
      <Container margin={8}>
        <Container flexDirection="row">
          {isValidatingLobbyId && <LoadingSpinner size="small" color="white" />}
          <Text color={isLobbyIdInvalid ? 'red' : 'white'} margin={8}>
            {isLobbyIdInvalid
              ? 'Invalid Game PIN'
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
        />
      </Container>
    </Container>
  </SafeAreaView>
);

export default JoinLobbyScreen;
