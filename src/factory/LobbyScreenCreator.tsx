import React, { useCallback } from 'react';
import Share from 'react-native-share';

import {
  useAppState,
  useLobbyState,
  useGoHomeIfInvalidLobbyId,
} from '@modi/hooks';

import { LobbyStateProvider } from '@modi/providers';
import { LobbyScreen } from '@modi/ui';

interface LobbyScreenCreatorProps extends MainStackScreenProps<'Lobby'> {}

const LobbyScreenCreator: React.FC<LobbyScreenCreatorProps> = ({
  navigation,
  route,
}) => {
  const { lobbyId } = route.params;
  const [{ username }, appStateDispatch] = useAppState();

  const onInviteFriendsBtnPressed = useCallback(() => {
    Share.open({
      message: `Join My Modi Game! modi://lobbies/${lobbyId}`,
    });
  }, []);

  const onEventStarted = useCallback(({ eventId, accessToken }) => {
    appStateDispatch.removeLobbyId().then(() => {
      navigation.navigate('Game', { gameId: eventId, accessToken });
    });
  }, []);

  const onBackBtnPressed = useCallback(() => {
    appStateDispatch.removeLobbyId();
    navigation.goBack();
  }, []);

  return (
    <LobbyStateProvider lobbyId={lobbyId!} onEventStarted={onEventStarted}>
      <ConnectedLobbyScreen
        lobbyId={lobbyId!}
        showUsernameInput={!username || username === ''}
        onUsernameSet={appStateDispatch.setUsername}
        onInviteFriendsBtnPressed={onInviteFriendsBtnPressed}
        onBackBtnPressed={onBackBtnPressed}
      />
    </LobbyStateProvider>
  );
};

interface ConnectedLobbyScreenProps {
  lobbyId: string;
  showUsernameInput: boolean;
  onUsernameSet: (username: string) => void;
  onInviteFriendsBtnPressed: () => void;
  onBackBtnPressed: () => void;
}
const ConnectedLobbyScreen: React.FC<ConnectedLobbyScreenProps> = ({
  lobbyId,
  showUsernameInput,
  onUsernameSet,
  onInviteFriendsBtnPressed,
  onBackBtnPressed,
}) => {
  const { attendees, currUserId, dispatch } = useLobbyState();

  const dispatchStartGame = useCallback(() => {
    dispatch('START_GAME');
  }, []);

  return (
    <LobbyScreen
      currUserId={currUserId}
      attendees={attendees}
      lobbyId={lobbyId}
      showUsernameInput={showUsernameInput}
      onUsernameSet={onUsernameSet}
      onInviteFriendsBtnPressed={onInviteFriendsBtnPressed}
      onBackBtnPressed={onBackBtnPressed}
      onStartGameBtnPressed={dispatchStartGame}
    />
  );
};

export default LobbyScreenCreator;
