import React, { useState, useCallback } from 'react';

import { validateLobbyId } from '@modi/util';
import { JoinLobbyScreen } from '@modi/ui';

interface JoinLobbyScreenCreatorProps
  extends MainStackScreenProps<'JoinLobby'> {}

const JoinLobbyScreenCreator: React.FC<JoinLobbyScreenCreatorProps> = ({
  navigation,
}) => {
  const [isValidatingLobbyId, setIsValidatingLobbyId] = useState(false);
  const [isLobbyIdInvalid, setIsLobbyIdInvalid] = useState(false);
  const [validationError, setValidationError] = useState(undefined);

  const onLobbyIdSet = useCallback((lobbyId) => {
    setIsValidatingLobbyId(true);
    validateLobbyId(lobbyId)
      .then((isValid) => {
        if (isValid) {
          navigation.navigate('Lobby', { lobbyId });
        } else {
          setIsLobbyIdInvalid(true);
        }
      })
      .catch((e) => setValidationError(e.message))
      .finally(() => setIsValidatingLobbyId(false));
  }, []);

  const goBack = useCallback(() => {
    navigation.navigate('Home');
  }, []);

  return (
    <JoinLobbyScreen
      onLobbyIdSet={onLobbyIdSet}
      isValidatingLobbyId={isValidatingLobbyId}
      isLobbyIdInvalid={isLobbyIdInvalid}
      validationError={validationError}
      onCancel={goBack}
    />
  );
};

export default JoinLobbyScreenCreator;
