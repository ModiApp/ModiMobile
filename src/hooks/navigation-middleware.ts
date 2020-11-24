import { useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { validateGameId, validateLobbyId } from '@modimobile/util';
import { useAppState } from '@modimobile/hooks';

function useNavigateToCurrGameOrLobby() {
  const [{ currGameId, currLobbyId }, updateGlobalState] = useAppState();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      if (currLobbyId) {
        validateLobbyId(currLobbyId).then((isValid) => {
          if (isValid) {
            navigation.navigate('Lobby', { lobbyId: currLobbyId });
          } else {
            updateGlobalState({ currLobbyId: undefined });
          }
        });
      }
      if (currGameId) {
        validateGameId(currGameId).then((isValid) => {
          if (isValid) {
            navigation.navigate('Game', { gameId: currGameId });
          } else {
            updateGlobalState({
              currGameId: undefined,
              gameAccessToken: undefined,
            });
          }
        });
      }
    }, [currLobbyId, currGameId]),
  );
}

function useGoHomeIfInvalidGameId() {
  const [{ currGameId }, updateGlobalState] = useAppState();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      currGameId &&
        validateGameId(currGameId).then((isValid) => {
          if (!isValid) {
            updateGlobalState({
              gameAccessToken: undefined,
              currGameId: undefined,
            });
            navigation.navigate('Home');
          }
        });
    }, [currGameId]),
  );
}

function useGoHomeIfInvalidLobbyId() {
  const [{ currLobbyId }, updateGlobalState] = useAppState();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      if (currLobbyId !== undefined) {
        validateLobbyId(currLobbyId).then((isValid) => {
          if (isValid) {
            updateGlobalState({ currLobbyId });
          } else {
            updateGlobalState({ currLobbyId: undefined }).then(() =>
              navigation.navigate('Home'),
            );
          }
        });
      } else {
        navigation.navigate('Home');
      }
      return () => {
        updateGlobalState({ currLobbyId: undefined });
      };
    }, [currLobbyId]),
  );
}

export {
  useNavigateToCurrGameOrLobby,
  useGoHomeIfInvalidLobbyId,
  useGoHomeIfInvalidGameId,
};
