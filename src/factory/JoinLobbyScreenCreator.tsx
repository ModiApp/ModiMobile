import React, { useState } from 'react';
import { JoinLobbyScreen } from '../ui';
import { LobbyService } from '../service';

const JoinLobbyScreenCreator = ({ navigation }) => {
  const [isValidatingLobbyId, setIsValidatingLobbyId] = useState(false);
  const [isLobbyIdInvalid, setIsLobbyIdInvalid] = useState(false);
  const [validationError, setValidationError] = useState(undefined);

  const onLobbyIdSet = async id => {
    setIsValidatingLobbyId(true);
    LobbyService.isLobbyIdValid(id)
      .then(isValid =>
        isValid
          ? navigation.navigate('Lobby', { id })
          : setIsLobbyIdInvalid(true),
      )
      .catch(e => setValidationError(e.message))
      .finally(() => setIsValidatingLobbyId(false));
  };

  return (
    <JoinLobbyScreen
      onLobbyIdSet={onLobbyIdSet}
      isValidatingLobbyId={isValidatingLobbyId}
      isLobbyIdInvalid={isLobbyIdInvalid}
      validationError={validationError}
      onCancel={() => navigation.navigate('Home')}
    />
  );
};

export default JoinLobbyScreenCreator;
