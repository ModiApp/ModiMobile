import React, { useState } from 'react';
import { JoinLobbyScreen } from '../ui';
import { LobbyService } from '../service';

const JoinLobbyScreenCreator = ({ navigation }) => {
  const [isValidatingLobbyId, setIsValidatingLobbyId] = useState(false);
  const [isLobbyIdInvalid, setIsLobbyIdInvalid] = useState(false);
  const onLobbyIdSet = async id => {
    setIsValidatingLobbyId(true);
    const isValid = !!id && (await LobbyService.isLobbyIdValid(id));
    setIsValidatingLobbyId(false);
    isValid ? navigation.navigate('Lobby', { id }) : setIsLobbyIdInvalid(true);
  };

  return (
    <JoinLobbyScreen
      onLobbyIdSet={onLobbyIdSet}
      isValidatingLobbyId={isValidatingLobbyId}
      isLobbyIdInvalid={isLobbyIdInvalid}
      onCancel={() => navigation.navigate('Home')}
    />
  );
};

export default JoinLobbyScreenCreator;
